use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult};

/// Handlers for each instruction
pub mod vote_alternative;
pub mod vote_market;
pub mod vote_participant;

/// Re-export for others to use
pub use vote_alternative::*;
pub use vote_market::*;
pub use vote_participant::*;

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone, Copy)]
pub enum Key {
    Uninitialized,
    VoteMarket,
    VoteParticipant,
    VoteAlternative,
}

pub trait VoteState {
    fn key(&self) -> Key;
    fn save(&self, account: &AccountInfo) -> ProgramResult;
}

pub const MAX_MARKET_IDENTIFIER_TEXT_LEN: usize = 80;
pub const MAX_KEYWORD_LEN: usize = 50;
pub const MAX_NUMBER_OF_DAYS: usize = 365 * 4; // 4 years
pub const MAX_PARTICIPANT_PRESENTATION_TEXT_LEN: usize = 80;
