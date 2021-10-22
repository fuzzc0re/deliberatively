use crate::{
    errors::VoteError,
    program_state::{
        vote_market::VoteMarket, vote_participant::VoteParticipant, Key, VoteState,
        MAX_KEYWORD_LEN, MAX_PARTICIPANT_PRESENTATION_TEXT_LEN,
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
    sysvar::{rent::Rent, Sysvar},
};

struct Accounts<'a, 'b: 'a> {
    participant: &'a AccountInfo<'b>,
    mint: &'a AccountInfo<'b>,
    program_mint_derived: &'a AccountInfo<'b>,
    participant_mint_derived: &'a AccountInfo<'b>,
    participant_token_account: &'a AccountInfo<'b>,
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
        participant: next_account_info(account_info_iter)?,
        mint: next_account_info(account_info_iter)?,
        program_mint_derived: next_account_info(account_info_iter)?,
        participant_mint_derived: next_account_info(account_info_iter)?,
        participant_token_account: next_account_info(account_info_iter)?,
        pda: next_account_info(account_info_iter)?,
        rent: next_account_info(account_info_iter)?,
        token_program: next_account_info(account_info_iter)?,
    };

    assert_account_is_signer(accounts.participant)?;
    assert_account_is_token_program(accounts.token_program)?;
    assert_account_is_owned_by(accounts.participant, &solana_program::system_program::id())?;
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
    assert_account_is_empty(accounts.participant_mint_derived)?;
    assert_account_is_owned_by(accounts.participant_mint_derived, &program_id)?;
    assert_account_is_owned_by(accounts.participant_token_account, &spl_token::id())?;
    assert_account_is_owned_by(accounts.rent, &solana_program::sysvar::id())?;
    let rrent = &Rent::from_account_info(accounts.rent)?;
    assert_account_is_rent_exempt(rrent, accounts.mint)?;
    assert_account_is_rent_exempt(rrent, accounts.program_mint_derived)?;
    assert_account_is_rent_exempt(rrent, accounts.participant_mint_derived)?;

    Ok(accounts)
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct ParticipateVoteMarketArgs {
    /// Prospective participant needs to provide this in order to receive 1 token.
    pub keyword: String,
    /// Some presentation text to be associated with the participant's profile.
    pub participant_presentation_text: String,
}

fn check_args(args: &ParticipateVoteMarketArgs) -> ProgramResult {
    if args.keyword.len() > MAX_KEYWORD_LEN {
        Err(VoteError::LargeKeywordText.into())
    } else if args.participant_presentation_text.len() > MAX_PARTICIPANT_PRESENTATION_TEXT_LEN {
        Err(VoteError::LargePresentationText.into())
    } else {
        Ok(())
    }
}

pub fn process_participate_vote_market(
    program_id: &Pubkey, // the current program
    accounts: &[AccountInfo],
    args: ParticipateVoteMarketArgs,
) -> ProgramResult {
    let accounts = parse_accounts(program_id, accounts)?;

    check_args(&args)?;

    let mut vote_market_data = VoteMarket::from_account_info(accounts.program_mint_derived)?;
    vote_market_data.can_mint_one_token()?;
    vote_market_data.there_is_still_time()?;
    vote_market_data.provided_keyword_matches(&args.keyword)?;

    let seeds = &[b"deliberatively", accounts.mint.key.as_ref()];
    let (_pda, bump_seed) = Pubkey::find_program_address(seeds, program_id);

    let mint_vote_market_token_to_participant_instruction =
        spl_token::instruction::mint_to_checked(
            accounts.token_program.key,             // token_program_id: &Pubkey
            accounts.mint.key,                      // mint_pubkey: &Pubkey,
            accounts.participant_token_account.key, // account_pubkey: &Pubkey,
            accounts.pda.key,                       // owner_pubkey: &Pubkey,
            &[accounts.pda.key],                    // signer_pubkeys: &[&Pubkey],
            100,                                    // amount: u64,
            2,                                      //decimals: u8
        )?;

    invoke_signed(
        &mint_vote_market_token_to_participant_instruction,
        &[
            accounts.mint.clone(),
            accounts.participant_token_account.clone(),
            accounts.pda.clone(),
            accounts.token_program.clone(),
        ],
        &[&[b"deliberatively", accounts.mint.key.as_ref(), &[bump_seed]]],
    )?;

    let mut vote_participant_data =
        VoteParticipant::from_account_info(accounts.participant_mint_derived)?;
    vote_participant_data.key = Key::VoteParticipant;
    vote_participant_data.vote_market_pubkey = *accounts.mint.key;
    vote_participant_data.vote_market_participant_pubkey = *accounts.participant_token_account.key;
    vote_participant_data.presentation_text = args.participant_presentation_text;
    vote_participant_data.pad_presentation_text()?;
    vote_participant_data.has_provided_keyword = 1;
    vote_participant_data.is_representative = 0;
    vote_participant_data.alternative = *accounts.participant_token_account.key;
    vote_participant_data.save(accounts.participant_mint_derived)?;

    vote_market_data.already_minted_voting_power += 1;
    vote_market_data.save(accounts.program_mint_derived)?;

    Ok(())
}
