use borsh::{BorshDeserialize, BorshSerialize};

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
