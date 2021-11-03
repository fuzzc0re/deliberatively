use crate::{
    errors::VoteError, 
    program_state::{
        Key, VoteState, MAX_MARKET_IDENTIFIER_TEXT_LEN, MAX_KEYWORD_LEN
    }, 
    utils::try_from_slice_checked
};
use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    // program_option::COption,
    pubkey::{PUBKEY_BYTES, Pubkey},
    sysvar::{Sysvar, clock::Clock}
};

pub const MAX_VOTE_MARKET_LEN: usize = 1 + // enum [key]
    MAX_MARKET_IDENTIFIER_TEXT_LEN + 
    MAX_KEYWORD_LEN +
    PUBKEY_BYTES + // 32
    4 + // u32 [number of participants]
    4 + // u32 [already minted voting power]
    // 1 + // u8 [rebalancing cost]
    4 + // u32 [maximum number of representatives]
    8 + // i64 [start timestamp]
    8 + // i64 [end timestamp = start timestamp + number of days]
    8 + // u64 [minimum contribution required]
    // TODO find out why we need 8 bytes more
    8;

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct VoteMarket {
    /// For deserialization in order to recognize the type of state to modify.
    pub key: Key,
    /// Identifier text for the vote market
    pub identifier_text: String,
    /// Keyword that prospective participants need to provide
    pub keyword: String,
    /// Associated mint public key
    pub mint_pubkey: Pubkey,
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
    pub minimum_contribution_required_from_participant: u64,
}

impl VoteState for VoteMarket {
    fn key(&self) -> Key {
        self.key 
    }

    fn save(&self, account: &AccountInfo) -> ProgramResult {
        self.serialize(&mut *account.data.borrow_mut())?;

        Ok(())
    }
}

impl VoteMarket {
    pub fn from_account_info(a: &AccountInfo) -> Result<VoteMarket, ProgramError> {
        let data: VoteMarket =
            try_from_slice_checked(&a.data.borrow_mut(), Key::VoteMarket, MAX_VOTE_MARKET_LEN)?;
        Ok(data)
    }

    pub fn pad_identifier_text(&mut self) -> ProgramResult {
        let mut array_of_spaces = vec![];
        while array_of_spaces.len() < MAX_MARKET_IDENTIFIER_TEXT_LEN - self.identifier_text.len() {
            array_of_spaces.push(32);
        }

        self.identifier_text =
            self.identifier_text.clone() + std::str::from_utf8(&array_of_spaces).unwrap();

        Ok(())
    }

    pub fn pad_keyword(&mut self) -> ProgramResult {
        let mut array_of_spaces = vec![];
        while array_of_spaces.len() < MAX_KEYWORD_LEN - self.keyword.len() {
            array_of_spaces.push(32);
        }

        self.keyword =
            self.keyword.clone() + std::str::from_utf8(&array_of_spaces).unwrap();

        Ok(())
    }
    
    pub fn can_mint_one_token(&self) -> ProgramResult {
        if self.already_minted_voting_power + 1 > self.number_of_participants {
            Err(VoteError::CannotMintMoreTokens.into())
        } else {
            Ok(())   
        }
    }

    pub fn there_is_still_time(&self) -> ProgramResult {
        let date = &Clock::get().unwrap().unix_timestamp;
        if self.stop_unix_timestamp < *date + 600 {
            Err(VoteError::NotEligibleToRebalanceDueToTimestamp.into())
        } else {
            Ok(())
        }
    }

    pub fn provided_keyword_matches(&self, keyword: String) -> ProgramResult {
        let mut array_of_spaces = vec![];
        while array_of_spaces.len() < MAX_KEYWORD_LEN - keyword.len() {
            array_of_spaces.push(32);
        }

        let padded_keyword = keyword + std::str::from_utf8(&array_of_spaces).unwrap();
        if padded_keyword != self.keyword {
            Err(VoteError::KeywordsDoNotMatch.into())
        } else {
            Ok(())   
        }
    }

}
