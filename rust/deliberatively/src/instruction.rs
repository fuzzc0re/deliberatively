use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    sysvar,
};

pub use crate::processor::init_vote_market::InitVoteMarketArgs;
pub use crate::processor::participate_vote_market::ParticipateVoteMarketArgs;

#[derive(Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum VoteMarketInstruction {
    /// Save the vote market data in the token_holder account, save the vote participant data in the
    /// initializer_token account, check if maximum supply of tokens is equal to number of participants,
    /// transfer ownership of tokenHolderAccount to the pda of this program.
    /// All initializations have happened client-side (mint account, token_holder account that
    /// holds all minted tokens minus 1, and initializer_token_account holding 1 token.
    ///
    ///   0. `[signer]` The account creating the vote market.
    ///   1. `[]` Token mint account.
    ///   2. `[writable]` Program mint derived address account to store vote market data.
    ///   3. `[writable]` Initializer mint derived token address account to store participation data.
    ///   4. `[]` Initializer token account to mint_to 1 vote market token.
    ///   5. `[]` The program derived address outside the curve25519 (::find_program_address).
    ///   6. `[]` The Rent sysvar.
    ///   7. `[]` The Token program.
    InitVoteMarket(InitVoteMarketArgs),
    ParticipateVoteMarket(ParticipateVoteMarketArgs),
    // ProposeVoteAlternative(ProposeVoteAlternativeArgs),
    // SubmitVote(SubmitVoteArgs),
}

#[allow(clippy::too_many_arguments)]
pub fn init_vote_market_instruction(
    program_id: Pubkey, // this program
    initializer_account: Pubkey,
    mint_account: Pubkey,
    program_mint_derived_account: Pubkey,
    initializer_mint_derived_account: Pubkey,
    initializer_token_account: Pubkey,
    pda: Pubkey,
    args: InitVoteMarketArgs,
) -> Instruction {
    Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new_readonly(initializer_account, true),
            AccountMeta::new_readonly(mint_account, false),
            AccountMeta::new(program_mint_derived_account, false),
            AccountMeta::new(initializer_mint_derived_account, false),
            AccountMeta::new_readonly(initializer_token_account, false),
            AccountMeta::new_readonly(pda, false),
            AccountMeta::new_readonly(sysvar::rent::id(), false),
            AccountMeta::new_readonly(spl_token::id(), false),
        ],
        data: VoteMarketInstruction::InitVoteMarket(args)
            .try_to_vec()
            .unwrap(),
    }
}
