import { PublicKey } from "@solana/web3.js";

export const DELIBERATIVELY_PROGRAM_ID = new PublicKey("A1PS1vg9pR86X2NnS8EmBsb3z6mekL6myZ2XNXpGuzYp");
// export const DELIBERATIVELY_PROGRAM_ID = new PublicKey("J164ritNEDnxdh4QRAusxccyob77QhFaLxgZ1zwDXUom");
export const DELIBERATIVELY_SEED: Buffer[] = [Buffer.from("deliberatively", "utf8")];

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export enum Key {
  Uninitialized,
  VoteMarket,
  VoteParticipant,
  VoteAlternative,
}

export enum Instruction {
  InitVoteMarket = 0,
  ParticipateVoteMarket = 1,
}

export const MAX_IDENTIFIER_TEXT_LEN = 80; // for VoteMarketState
export const MAX_KEYWORD_LEN = 50; // same
export const MAX_PUBLIC_KEY_LEN = 32;
export const MAX_PRESENTATION_TEXT_LEN = 80; // for VoteParticipantState

export const MAX_VOTE_MARKET_LEN =
  1 + // enum [key]
  MAX_IDENTIFIER_TEXT_LEN +
  MAX_KEYWORD_LEN +
  MAX_PUBLIC_KEY_LEN + // Pubkey [associated mint public key]
  4 + // u32 [number of participants]
  4 + // u32 [already minted voting power]
  // 1 + // u8 [rebalancing cost]
  4 + // u32 [maximum number of representatives]
  8 + // i64 [start timestamp]
  8 + // i64 [end timestamp = start timestamp + number of days]
  8 + // u64 [minimum contribution required]
  8;

export const MAX_VOTE_PARTICIPANT_LEN =
  1 + // enum [key]
  MAX_PUBLIC_KEY_LEN + // Pubkey [vote market token mint account address]
  MAX_PUBLIC_KEY_LEN + // Pubkey [mint associated token holding address of participant]
  MAX_PRESENTATION_TEXT_LEN + // String
  1 + // bool [has provided keyword]
  1 + // bool [is representative]
  MAX_PUBLIC_KEY_LEN + // Pubkey [address of proposed alternative] (possibly null)
  4;
