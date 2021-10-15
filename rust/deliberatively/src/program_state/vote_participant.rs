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

pub const MAX_VOTE_PARTICIPANT_LEN: usize = 1 + // enum [key]
    32 + // Pubkey [vote market token mint account address]
    32 + // Pubkey [mint associated address of participant]
    1 + // bool [has provided keyword]
    1 + // bool [is representative]
    32; // Pubkey [address of alternative proposed]

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VoteParticipant {
    /// For deserialization in order to recognize the type of state to modify.
    pub key: Key,
    /// The vote market token mint that this participant is associated with.
    pub vote_market_pubkey: Pubkey,
    /// The participant's token holding address.
    pub vote_market_participant_pubkey: Pubkey,
    // /// Is this an account created through the "participate" instruction or not?
    // pub has_provided_keyword: bool,
    /// Is this account a representative?
    /// If yes then this account has the top [maximum_number_of_representatives] tokens.
    pub is_representative: bool,
    /// If the account is a representative then they might have proposed an alternative
    /// for the participants to vote on.
    pub alternative: Option<Pubkey>,
}

impl VoteParticipant {
    pub fn from_account_info(a: &AccountInfo) -> Result<VoteParticipant, ProgramError> {
        let data: VoteParticipant = try_from_slice_checked(
            &a.data.borrow_mut(),
            Key::VoteParticipant,
            MAX_VOTE_PARTICIPANT_LEN,
        )?;

        Ok(data)
    }

    pub fn from_empty_account(a: &AccountInfo) -> Result<VoteParticipant, ProgramError> {
        let data: VoteParticipant = try_from_slice_unchecked(&a.data.borrow_mut())?;

        Ok(data)
    }

    pub fn save(&self, account: &AccountInfo) -> ProgramResult {
        self.serialize(&mut *account.data.borrow_mut())?;
        Ok(())
    }
}
