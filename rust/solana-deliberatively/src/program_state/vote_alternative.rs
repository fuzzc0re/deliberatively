use crate::{program_state::Key, utils::try_from_slice_checked};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo,
    borsh::try_from_slice_unchecked,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    // program_option::COption,
    pubkey::Pubkey,
};

pub const MAX_VOTE_ALTERNATIVE_LEN: usize = 8 + // enum [key]
    32 + // Pubkey [proposer]
    32 + // Pubkey [token mint]
    200; // String [text of alternative item]

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VoteAlternative {
    /// For deserialization purposes.
    pub key: Key,
    /// Address of the representative that proposed the alternative.
    pub proposer: Pubkey,
    /// Token mint that this alternative is associated with.
    pub mint: Pubkey,
    /// Some text regarding the alternative. It could be a uri.
    pub text: Option<String>,
}

impl VoteAlternative {
    pub fn from_account_info(a: &AccountInfo) -> Result<VoteAlternative, ProgramError> {
        let data: VoteAlternative = try_from_slice_checked(
            &a.data.borrow_mut(),
            Key::VoteAlternative,
            MAX_VOTE_ALTERNATIVE_LEN,
        )?;

        Ok(data)
    }

    pub fn from_empty_account(a: &AccountInfo) -> Result<VoteAlternative, ProgramError> {
        let data: VoteAlternative = try_from_slice_unchecked(&a.data.borrow_mut())?;

        Ok(data)
    }

    pub fn save(&self, account: &AccountInfo) -> ProgramResult {
        self.serialize(&mut *account.data.borrow_mut())?;
        Ok(())
    }
}
