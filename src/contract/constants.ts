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
}
