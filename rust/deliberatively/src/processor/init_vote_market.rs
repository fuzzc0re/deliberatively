use crate::{
    errors::VoteError,
    program_state::{
        vote_market::VoteMarket, vote_participant::VoteParticipant, Key, VoteState,
        MAX_IDENTIFIER_TEXT_LEN, MAX_KEYWORD_LEN, MAX_NUMBER_OF_DAYS,
    },
    utils::{
        assert_account_is_empty, assert_account_is_owned_by, assert_account_is_rent_exempt,
        assert_account_is_signer, assert_account_is_token_program,
        assert_is_valid_address_with_seed, assert_is_valid_pda, assert_pda_is_mint_authority,
        get_mint_derived_program_address,
    },
    DELIBERATIVELY_SEED,
};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{clock::Clock, rent::Rent, Sysvar},
};

struct Accounts<'a, 'b: 'a> {
    initializer: &'a AccountInfo<'b>,
    mint: &'a AccountInfo<'b>,
    program_mint_derived: &'a AccountInfo<'b>,
    initializer_mint_derived: &'a AccountInfo<'b>,
    initializer_token_account: &'a AccountInfo<'b>,
    pda: &'a AccountInfo<'b>,
    rent: &'a AccountInfo<'b>,
    token_program: &'a AccountInfo<'b>,
}

fn parse_accounts<'a, 'b: 'a>(
    program_id: &Pubkey,
    accounts: &'a [AccountInfo<'b>],
) -> Result<Accounts<'a, 'b>, ProgramError> {
    let account_info_iter = &mut accounts.iter();
    let accounts = Accounts {
        initializer: next_account_info(account_info_iter)?,
        mint: next_account_info(account_info_iter)?,
        program_mint_derived: next_account_info(account_info_iter)?,
        initializer_mint_derived: next_account_info(account_info_iter)?,
        initializer_token_account: next_account_info(account_info_iter)?,
        pda: next_account_info(account_info_iter)?,
        rent: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
    };

    assert_account_is_signer(accounts.initializer)?;
    assert_account_is_token_program(accounts.token_program)?;
    assert_account_is_owned_by(accounts.initializer, &solana_program::system_program::id())?;
    assert_account_is_owned_by(accounts.mint, &spl_token::id())?;
    let pda = get_mint_derived_program_address(program_id, accounts.mint.key);
    assert_is_valid_pda(accounts.pda, &pda)?;
    assert_pda_is_mint_authority(&pda, accounts.mint)?;
    assert_is_valid_address_with_seed(
        accounts.program_mint_derived,
        program_id,
        DELIBERATIVELY_SEED,
        accounts.mint.key,
    )?;
    assert_account_is_empty(accounts.program_mint_derived)?;
    assert_account_is_owned_by(accounts.program_mint_derived, &program_id)?;
    assert_account_is_empty(accounts.initializer_mint_derived)?;
    assert_account_is_owned_by(accounts.initializer_mint_derived, &program_id)?;
    assert_account_is_owned_by(accounts.initializer_token_account, &spl_token::id())?;
    assert_account_is_owned_by(accounts.rent, &solana_program::sysvar::id())?;
    let rrent = &Rent::from_account_info(accounts.rent)?;
    assert_account_is_rent_exempt(rrent, accounts.mint)?;
    assert_account_is_rent_exempt(rrent, accounts.program_mint_derived)?;
    assert_account_is_rent_exempt(rrent, accounts.initializer_mint_derived)?;

    Ok(accounts)
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct InitVoteMarketArgs {
    /// Identifier for the vote market.
    pub identifier_text: String,
    /// Potential participants need to provide this in order to receive 1 token once
    pub keyword: String,
    /// Number of participants == number of minted tokens
    pub number_of_participants: u32,
    // /// With each transaction, the participant burns a percentage of voting power.
    // /// From 1 to 100.
    // pub rebalancing_cost: u8,
    /// The participants that have accumulated the most voting power and therefore can propose alternatives.
    pub maximum_number_of_representatives: u32,
    /// Date of the request + number_of_days gives us the unix timestamp of end date.
    pub number_of_days: u16,
    /// If > 0 then a participant needs to lock this amount of tokens to the vote market.
    pub minimum_contribution_required_from_participant: u64,
}

fn check_args(args: &InitVoteMarketArgs) -> ProgramResult {
    if args.identifier_text.len() > MAX_IDENTIFIER_TEXT_LEN {
        Err(VoteError::LargeIdentifierText.into())
    } else if args.keyword.len() > MAX_KEYWORD_LEN {
        Err(VoteError::LargeKeywordText.into())
    } else if args.number_of_days > MAX_NUMBER_OF_DAYS as u16 {
        Err(VoteError::LargeNumberOfDays.into())
    } else {
        Ok(())
    }
}

pub fn process_init_vote_market(
    program_id: &Pubkey, // the current program
    accounts: &[AccountInfo],
    args: InitVoteMarketArgs,
) -> ProgramResult {
    let accounts = parse_accounts(program_id, accounts)?;

    check_args(&args)?;

    let mut vote_market_data = VoteMarket::from_account_info(accounts.program_mint_derived)?;
    vote_market_data.key = Key::VoteMarket;
    vote_market_data.identifier_text = args.identifier_text;
    vote_market_data.pad_identifier_text()?;
    vote_market_data.keyword = args.keyword;
    vote_market_data.pad_keyword()?;
    vote_market_data.mint_pubkey = *accounts.mint.key;
    vote_market_data.number_of_participants = args.number_of_participants;
    vote_market_data.already_minted_voting_power = 0;
    // vote_market_data.rebalancing_cost = args.rebalancing_cost;
    vote_market_data.maximum_number_of_representatives = args.maximum_number_of_representatives;

    let start_date = &Clock::get().unwrap().unix_timestamp;
    let delay_from_start_date = args.number_of_days * 1000 * 60 * 60 * 24;
    vote_market_data.start_unix_timestamp = *start_date;
    vote_market_data.stop_unix_timestamp = *start_date + delay_from_start_date as i64;

    vote_market_data.minimum_contribution_required_from_participant =
        args.minimum_contribution_required_from_participant;

    // Initialize mint related account for initializer
    // let initializer_initializer_mint_account = spl_token::instruction::initialize_account(
    //     accounts.token_program.key,
    //     accounts.initializer_token_account.key,
    //     accounts.mint.key,
    //     accounts.token_program.key,
    // )?;
    //
    // invoke(
    //     &initializer_initializer_mint_account,
    //     &[
    //         accounts.token_program.clone(),
    //         accounts.initializer.clone(),
    //         accounts.initializer_token_account.clone(),
    //         accounts.mint.clone(),
    //         accounts.rent.clone(),
    //     ],
    // )?;

    let seeds = &[b"deliberatively", accounts.mint.key.as_ref()];
    let (_pda, bump_seed) = Pubkey::find_program_address(seeds, program_id);

    let mint_vote_market_token_to_initializer_instruction =
        spl_token::instruction::mint_to_checked(
            accounts.token_program.key,             // token_program_id: &Pubkey
            accounts.mint.key,                      // mint_pubkey: &Pubkey,
            accounts.initializer_token_account.key, // account_pubkey: &Pubkey,
            accounts.pda.key,                       // owner_pubkey: &Pubkey,
            &[accounts.pda.key],                    // signer_pubkeys: &[&Pubkey],
            100,                                    // amount: u64,
            2,                                      //decimals: u8
        )?;

    invoke_signed(
        &mint_vote_market_token_to_initializer_instruction,
        &[
            accounts.mint.clone(),
            accounts.initializer_token_account.clone(),
            accounts.pda.clone(),
            accounts.token_program.clone(),
        ],
        &[&[b"deliberatively", accounts.mint.key.as_ref(), &[bump_seed]]],
    )?;

    let mut vote_participant_data =
        VoteParticipant::from_account_info(accounts.initializer_mint_derived)?;
    vote_participant_data.key = Key::VoteParticipant;
    vote_participant_data.vote_market_pubkey = *accounts.mint.key;
    vote_participant_data.vote_market_participant_pubkey = *accounts.initializer_token_account.key;
    vote_participant_data.presentation_text = String::from("Hello, I am using deliberatively!");
    vote_participant_data.pad_presentation_text()?;
    vote_participant_data.has_provided_keyword = 1;
    vote_participant_data.is_representative = 0;
    vote_participant_data.alternative = *accounts.initializer_token_account.key;
    vote_participant_data.save(accounts.initializer_mint_derived)?;

    vote_market_data.already_minted_voting_power += 1;
    vote_market_data.save(accounts.program_mint_derived)?;

    Ok(())
}
