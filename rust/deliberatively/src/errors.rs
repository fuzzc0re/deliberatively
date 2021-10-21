use num_derive::FromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    msg,
    program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

#[derive(Error, Eq, FromPrimitive, PartialEq, Debug, Clone)]
pub enum VoteError {
    #[error("Invalid instruction")]
    InvalidInstruction,
    #[error("Account has Incorrect Owner")]
    IncorrectOwner,
    #[error("No rent exempt")]
    NotRentExempt,
    #[error("Not empty account")]
    NotEmptyAccount,
    #[error("Derived address does not match")]
    DerivedAddressDoesNotMatch,
    #[error("Account is not token program")]
    AccountIsNotTokenProgram,
    #[error("Account is not associated token account program")]
    AccountIsNotAssociatedTokenAccountProgram,
    #[error("Invalid program derived address")]
    InvalidProgramDerivedAddress,
    #[error("Program is not mint authority")]
    ProgramIsNotMintAuthority,
    #[error("Vote identifier text is too large")]
    LargeIdentifierText,
    #[error("Vote keyword text is too large")]
    LargeKeywordText,
    #[error("Vote number of days is too large")]
    LargeNumberOfDays,
    #[error("Large participant presentation text")]
    LargePresentationText,
    #[error("Keyword mismatch")]
    KeywordsDoNotMatch,
    #[error("Cannot mint any more tokens")]
    CannotMintMoreTokens,
    #[error("Representative has already proposed an alternative")]
    RepresentativeHasAlreadyProposedAlternative,
    #[error("Amount overflow")]
    AmountOverflow,
    #[error("Expected account mismatch")]
    ExpectedAmountMismatch,
    #[error("Data type mismatch")]
    DataTypeMismatch,
    #[error("Token transfer failed")]
    TokenTransferFailed,
    #[error("No rebalance due to timestamp")]
    NotEligibleToRebalanceDueToTimestamp,
    #[error("No rebalance due to less balance")]
    NotEligibleToRebalanceDueToBalance,
}

impl From<VoteError> for ProgramError {
    fn from(e: VoteError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum MetadataError {
    #[error("Data type mismatch")]
    DataTypeMismatch,
}

impl PrintProgramError for MetadataError {
    fn print<E>(&self) {
        msg!(&self.to_string());
    }
}

impl From<MetadataError> for ProgramError {
    fn from(e: MetadataError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for MetadataError {
    fn type_of() -> &'static str {
        "Metadata Error"
    }
}
