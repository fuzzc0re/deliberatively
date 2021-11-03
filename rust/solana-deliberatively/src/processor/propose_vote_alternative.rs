use crate::utils::{assert_account_is_owned_by, assert_account_is_signer};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{clock::Clock, Sysvar},
};
use spl_token::state::Account;

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct ProposeVoteAlternativeArgs {
    pub title: String,
    pub uri: Option<String>,
}

struct Accounts<'a, 'b: 'a> {
    initializer: &'a AccountInfo<'b>,
}

pub fn process_propose_vote_alternative(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    args: ProposeVoteAlternativeArgs,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let accounts = Accounts {
        initializer: next_account_info(account_info_iter)?,
    };

    assert_account_is_owned_by(accounts.initializer, owner: program_id)?;

    if !accounts.initializer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let temp_token_account = next_account_info(account_info_iter)?;

    let token_to_receive_account = next_account_info(account_info_iter)?;
    if *token_to_receive_account.owner != spl_token::id() {
        return Err(ProgramError::IncorrectProgramId);
    }

    let vote_account = next_account_info(account_info_iter)?;
    let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;

    if !rent.is_exempt(vote_account.lamports(), vote_account.data_len()) {
        return Err(VoteError::NotRentExempt.into());
    }

    let mut vote_info = Vote::unpack_unchecked(&vote_account.data.borrow())?;
    if vote_info.is_initialized() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    vote_info.is_initialized = true;
    vote_info.initializer_pubkey = *initializer.key;
    vote_info.temp_token_account_pubkey = *temp_token_account.key;
    vote_info.initializer_token_to_receive_account_pubkey = *token_to_receive_account.key;
    vote_info.expected_amount = amount;

    Vote::pack(vote_info, &mut vote_account.data.borrow_mut())?;

    let (pda, _bump_seed) = Pubkey::find_program_address(&[b"vote"], program_id);
    let token_program = next_account_info(account_info_iter)?;
    let owner_change_ix = spl_token::instruction::set_authority(
        token_program.key,
        temp_token_account.key,
        Some(&pda),
        spl_token::instruction::AuthorityType::AccountOwner,
        initializer.key,
        &[&initializer.key],
    )?;

    msg!("Calling the token program to transfer token account ownership...");
    invoke(
        &owner_change_ix,
        &[
            temp_token_account.clone(),
            initializer.clone(),
            token_program.clone(),
        ],
    )?;

    Ok(())
}
