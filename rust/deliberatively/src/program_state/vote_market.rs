use crate::{errors::VoteError, program_state::Key, utils::try_from_slice_checked};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo,
    borsh::try_from_slice_unchecked,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    // program_option::COption,
    pubkey::Pubkey,
};

pub const MAX_VOTE_MARKET_LEN: usize = 1 + // enum [key]
    32 + // Pubkey [associated mint public key]
    // 32 + // Pubkey [token holder account]
    4 + // u32 [number of participants]
    1 + // u8 [rebalancing cost]
    4 + // u32 [maximum number of representatives]
    8 + // i64 [start timestamp]
    8 + // i64 [end timestamp = start timestamp + number of days]
    8; // u64 [minimum contribution required]

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VoteMarket {
    /// For deserialization in order to recognize the type of state to modify.
    pub key: Key,
    /// Associated mint public key
    pub mint_pubkey: Pubkey,
    // /// Account holding all the participants' tokens
    // pub token_holder_pubkey: Pubkey,
    /// Number of participants == Maximum minted tokens.
    /// When a new participant enters the market, they get 1 token.
    /// 1 token represents a unit of voting power.
    /// Each unit can be broken up to 100 pieces and distributed to others.
    pub number_of_participants: u32,
    /// Already minted tokens to check if +1 will be greater than number_of_participants.
    pub already_minted_voting_power: u32,
    // /// With each transaction, the participant burns a percentage of voting power.
    // pub rebalancing_cost: u8,
    /// Representatives have the power to propose alternatives to be voted on by all participants.
    /// A participant can become a representative if their voting power/balance is more than 1.
    /// The participants that have accumulated the most voting power become the representatives.
    pub maximum_number_of_representatives: u32,
    /// We get it from solana_program::clock::Clock::epoch_start_timestamp.
    pub start_unix_timestamp: i64,
    /// After that date the voters cannot redistribute their voting power.
    /// In other words, they cannot revert a transaction.
    /// After that date, the representatives can start proposing alternatives.
    pub stop_unix_timestamp: i64,
    /// This can be 0 if the initializer says so.
    /// If > 0 then a participant needs to lock this amount of tokens to the vote market.
    /// The initializer can raise this amount before stop_unix_timestamp.
    /// The transaction costs are covered by the contributions until they become 0.
    /// If contributions == 0 then the participants cover the transaction costs of their
    /// rebalancings.
    pub minimum_contribution_required_from_participant: u32,
}

impl VoteMarket {
    pub fn from_account_info(a: &AccountInfo) -> Result<VoteMarket, ProgramError> {
        let data: VoteMarket =
            try_from_slice_checked(&a.data.borrow_mut(), Key::VoteMarket, MAX_VOTE_MARKET_LEN)?;

        Ok(data)
    }

    pub fn from_empty_account(a: &AccountInfo) -> Result<VoteMarket, ProgramError> {
        let data: VoteMarket = try_from_slice_unchecked(&a.data.borrow_mut())?;

        Ok(data)
    }

    pub fn save(&self, account: &AccountInfo) -> ProgramResult {
        self.serialize(&mut *account.data.borrow_mut())?;
        Ok(())
    }

    pub fn can_still_rebalance(&self, unix_timestamp: i64) -> ProgramResult {
        if !self.stop_unix_timestamp > unix_timestamp {
            Err(VoteError::NotEligibleToRebalanceDueToTimestamp.into())
        } else {
            Ok(())
        }
    }
}
