use crate::{errors::VoteError, program_state::Key};
use borsh::BorshDeserialize;
use solana_program::{
    account_info::AccountInfo,
    borsh::try_from_slice_unchecked,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    // program::{invoke, invoke_signed},
    program_pack::Pack,
    pubkey::Pubkey,
    sysvar::rent::Rent,
};

pub fn assert_account_is_owned_by(account: &AccountInfo, owner: &Pubkey) -> ProgramResult {
    if account.owner != owner {
        msg!(
            "{} Owner Invalid, Expected {}, Got {}",
            account.key,
            owner,
            account.owner
        );
        Err(VoteError::IncorrectOwner.into())
    } else {
        Ok(())
    }
}

pub fn assert_account_is_rent_exempt(rent: &Rent, account_info: &AccountInfo) -> ProgramResult {
    if !rent.is_exempt(account_info.lamports(), account_info.data_len()) {
        Err(VoteError::NotRentExempt.into())
    } else {
        Ok(())
    }
}

pub fn assert_account_is_signer(account_info: &AccountInfo) -> ProgramResult {
    if !account_info.is_signer {
        Err(ProgramError::MissingRequiredSignature.into())
    } else {
        Ok(())
    }
}

pub fn assert_account_is_token_program(account_info: &AccountInfo) -> ProgramResult {
    if *account_info.key != spl_token::id() {
        Err(VoteError::AccountIsNotTokenProgram.into())
    } else {
        Ok(())
    }
}

pub fn assert_account_is_empty(account_info: &AccountInfo) -> ProgramResult {
    let data = &account_info.data.borrow();
    if data[0] != Key::Uninitialized as u8 {
        Err(VoteError::NotEmptyAccount.into())
    } else {
        Ok(())
    }
}

pub fn assert_is_valid_address_with_seed(
    account_info: &AccountInfo,
    program_id: &Pubkey,
    seed: &str,
    mint: &Pubkey,
) -> ProgramResult {
    let derived_address = Pubkey::create_with_seed(mint, seed, program_id)?;
    if *account_info.key != derived_address {
        Err(VoteError::InvalidProgramDerivedAddress.into())
    } else {
        Ok(())
    }
}

pub fn get_mint_derived_program_address(program_id: &Pubkey, mint_pubkey: &Pubkey) -> Pubkey {
    let seeds = &[b"deliberatively", mint_pubkey.as_ref()];
    let (pda, _bump_seed) = Pubkey::find_program_address(seeds, program_id);

    pda
}

pub fn assert_is_valid_pda(account_info: &AccountInfo, pda: &Pubkey) -> ProgramResult {
    if *account_info.key != *pda {
        Err(VoteError::InvalidProgramDerivedAddress.into())
    } else {
        Ok(())
    }
}

pub fn assert_pda_is_mint_authority(
    pda: &Pubkey,
    mint_account_info: &AccountInfo,
) -> ProgramResult {
    let mint_data = spl_token::state::Mint::unpack_from_slice(&mint_account_info.data.borrow())?;
    let mint_authority = mint_data.mint_authority.unwrap();
    if mint_authority != *pda {
        Err(VoteError::ProgramIsNotMintAuthority.into())
    } else {
        Ok(())
    }
}

pub fn try_from_slice_checked<T: BorshDeserialize>(
    data: &[u8],
    data_type: Key,
    data_size: usize,
) -> Result<T, ProgramError> {
    if (data[0] != data_type as u8 && data[0] != Key::Uninitialized as u8)
        || data.len() != data_size
    {
        msg!("Expected account len {}, got {}", data_size, data.len());
        return Err(VoteError::DataTypeMismatch.into());
    }

    let result: T = try_from_slice_unchecked(data)?;

    Ok(result)
}

//
// pub fn assert_addresses_equal(
//     account_info: &AccountInfo,
//     expected_address: Pubkey,
// ) -> ProgramResult {
//     if *account_info.key != expected_address {
//         Err(VoteError::DerivedAddressDoesNotMatch.into())
//     } else {
//         Ok(())
//     }
// }
