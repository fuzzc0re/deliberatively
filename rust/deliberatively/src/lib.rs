#![forbid(unsafe_code)]

pub mod entrypoint;
pub mod errors;
pub mod instruction;
pub mod processor;
pub mod program_state;
mod utils;

// Export current sdk types for downstream users building with a different sdk version
pub use solana_program;

const DELIBERATIVELY_SEED: &str = "deliberatively";

solana_program::declare_id!("A1PS1vg9pR86X2NnS8EmBsb3z6mekL6myZ2XNXpGuzYp");
