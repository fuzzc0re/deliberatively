use crate::instruction::VoteMarketInstruction;
use borsh::BorshDeserialize;
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

/// Handlers for each instruction
// pub mod contribute_to_vote_market;
pub mod init_vote_market;
pub mod participate_vote_market;
// pub mod propose_vote_alternative;
// pub mod submit_vote;

/// Re-export for other programs to consume
// pub use contribute_to_vote_market::*;
pub use init_vote_market::*;
pub use participate_vote_market::*;
// pub use propose_vote_alternative::*;
// pub use submit_vote::*;

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey, // this program
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = VoteMarketInstruction::try_from_slice(instruction_data)?;

        match instruction {
            VoteMarketInstruction::InitVoteMarket(args) => {
                process_init_vote_market(program_id, accounts, args)
            }

            VoteMarketInstruction::ParticipateVoteMarket(args) => {
                process_participate_vote_market(program_id, accounts, args)
            }
        }
    }
}
