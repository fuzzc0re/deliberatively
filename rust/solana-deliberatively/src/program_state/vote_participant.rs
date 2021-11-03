use crate::{
    errors::VoteError,
    program_state::{Key, VoteState, MAX_PARTICIPANT_PRESENTATION_TEXT_LEN},
    utils::try_from_slice_checked,
};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    // program_option::COption,
    pubkey::{Pubkey, PUBKEY_BYTES},
};

pub const MAX_VOTE_PARTICIPANT_LEN: usize = 1 + // enum [key]
    PUBKEY_BYTES + // = 32 [vote market token mint account address]
    PUBKEY_BYTES + // = 32 [mint associated address of participant]
    MAX_PARTICIPANT_PRESENTATION_TEXT_LEN + // 
    1 + // bool [has provided keyword]
    1 + // bool [is representative]
    PUBKEY_BYTES + // = 32 [address of alternative proposed]
    // TODO find out why here too;
    4;

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct VoteParticipant {
    /// For deserialization in order to recognize the type of state to modify.
    pub key: Key,
    /// The vote market token mint that this participant is associated with.
    pub vote_market_pubkey: Pubkey,
    /// The participant's token holding address.
    pub vote_market_participant_pubkey: Pubkey,
    /// Some text that will be presented to other participants.
    pub presentation_text: String,
    /// Is this an account created through the "participate" instruction or not?
    pub has_provided_keyword: u8, // bool but borsh duh
    /// Is this account a representative?
    /// If yes then this account has the top [maximum_number_of_representatives] tokens.
    pub is_representative: u8,
    /// If the account is a representative then they might have proposed an alternative
    /// for the participants to vote on.
    /// If equal to vote_market_participant_pubkey then no alternative.
    pub alternative: Pubkey,
}

impl VoteState for VoteParticipant {
    fn key(&self) -> Key {
        self.key
    }

    fn save(&self, account: &AccountInfo) -> ProgramResult {
        self.serialize(&mut *account.data.borrow_mut())?;

        Ok(())
    }
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

    pub fn pad_presentation_text(&mut self) -> ProgramResult {
        let mut array_of_spaces = vec![];
        while array_of_spaces.len()
            < MAX_PARTICIPANT_PRESENTATION_TEXT_LEN - self.presentation_text.len()
        {
            array_of_spaces.push(32);
        }

        self.presentation_text =
            self.presentation_text.clone() + std::str::from_utf8(&array_of_spaces).unwrap();

        Ok(())
    }

    pub fn has_not_proposed_alternative(&self) -> ProgramResult {
        if self.alternative != self.vote_market_participant_pubkey {
            Err(VoteError::RepresentativeHasAlreadyProposedAlternative.into())
        } else {
            Ok(())
        }
    }
}
