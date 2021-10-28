import { Token, AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  Signer,
  Struct,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SOLANA_SCHEMA,
} from "@solana/web3.js";

import { getContractPDA, getAccountPDA, puffText } from "../utils";

import {
  DELIBERATIVELY_PROGRAM_ID,
  Instruction,
  MAX_VOTE_PARTICIPANT_LEN,
  MAX_KEYWORD_LEN,
  MAX_PRESENTATION_TEXT_LEN,
} from "../constants";

export interface ParticipateVoteMarketArgs {
  keyword: string;
  participantPresentationText: string;
}

class ParticipateVoteMarketInstructionData extends Struct {
  instruction = Instruction.ParticipateVoteMarket;
  keyword = "some keyword";
  participantPresentationText = "some participant presentation text";
  constructor(fields: ParticipateVoteMarketArgs) {
    super(fields);
    this.instruction = Instruction.ParticipateVoteMarket;
    this.keyword = fields.keyword;
    this.participantPresentationText = fields.participantPresentationText;
  }
}

SOLANA_SCHEMA.set(ParticipateVoteMarketInstructionData, {
  kind: "struct",
  fields: [
    ["instruction", "u8"],
    ["keyword", "string"],
    ["participantPresentationText", "string"],
  ],
});

interface IParticipateVoteMarketTransactions {
  transaction: Transaction;
  deliberativelyMintDerivedAccountPubkey: PublicKey;
  participantMintDerivedAccountPubkey: PublicKey;
  participantTokenAccount: Signer;
  pda: PublicKey;
}

export const participateVoteMarketMintTransactions = async (
  connection: Connection,
  publicKey: PublicKey,
  mintAccountPublicKey: PublicKey
): Promise<IParticipateVoteMarketTransactions> => {
  try {
    // For the token holding accounts [not writable]
    const accountSize = AccountLayout.span;
    const accountRent = await connection.getMinimumBalanceForRentExemption(accountSize);

    // For the participant
    const participantTokenAccount = Keypair.generate();
    const mintDerivedParticipantAccountRent = await connection.getMinimumBalanceForRentExemption(
      MAX_VOTE_PARTICIPANT_LEN
    );

    const transaction = new Transaction();
    transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

    // PublicKey creates associated account that will hold 1 vote token.
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: participantTokenAccount.publicKey,
        lamports: accountRent,
        space: accountSize,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Create account with seed for DELIBERATIVELY_PROGRAM_ID
    // Deliberatively will use this to write vote market data
    const deliberativelyMintDerivedAccountPubkey = await getContractPDA(mintAccountPublicKey);

    // Create account with seed for initializer
    // Deliberatively will use this to write vote market participant data
    const participantMintDerivedAccountPubkey = await getAccountPDA(mintAccountPublicKey, publicKey);
    const mintAccountPublicKeyString = mintAccountPublicKey.toString();
    transaction.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        newAccountPubkey: participantMintDerivedAccountPubkey,
        basePubkey: publicKey,
        seed: "deliberatively" + mintAccountPublicKeyString.slice(mintAccountPublicKeyString.length - 8),
        lamports: mintDerivedParticipantAccountRent,
        space: MAX_VOTE_PARTICIPANT_LEN,
        programId: DELIBERATIVELY_PROGRAM_ID,
      })
    );

    const pda = await PublicKey.findProgramAddress(
      [Buffer.from("deliberatively", "utf8"), mintAccountPublicKey.toBuffer()],
      DELIBERATIVELY_PROGRAM_ID
    );

    // Publickey initializes its account
    transaction.add(
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        mintAccountPublicKey,
        participantTokenAccount.publicKey,
        publicKey
      )
    );

    return {
      transaction,
      deliberativelyMintDerivedAccountPubkey,
      participantMintDerivedAccountPubkey,
      participantTokenAccount,
      pda: pda[0],
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

interface IParticipateVoteMarketReturn {
  participantTokenAccountPublicKey: PublicKey;
  pda: PublicKey;
}

export const participateVoteMarket = async (
  connection: Connection,
  publicKey: PublicKey,
  mintAccountPublicKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  args: ParticipateVoteMarketArgs
): Promise<IParticipateVoteMarketReturn> => {
  const {
    transaction,
    deliberativelyMintDerivedAccountPubkey,
    participantMintDerivedAccountPubkey,
    participantTokenAccount,
    pda,
  } = await participateVoteMarketMintTransactions(connection, publicKey, mintAccountPublicKey);

  if (args.keyword.length < 8 || args.keyword.length > MAX_KEYWORD_LEN) {
    throw new Error("Market keyword is either too small or too large.");
  }

  const sanitizerParticipantPresentationText = puffText(
    args.participantPresentationText !== "" ? args.participantPresentationText : "Hello, I am using Deliberatively!",
    MAX_PRESENTATION_TEXT_LEN
  );

  const newVoteMarketInstructionData = new ParticipateVoteMarketInstructionData({
    keyword: args.keyword,
    participantPresentationText: sanitizerParticipantPresentationText,
  });

  const instructionBuffer = newVoteMarketInstructionData.encode();

  const participateInstruction = new TransactionInstruction({
    programId: DELIBERATIVELY_PROGRAM_ID,
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: false },
      { pubkey: mintAccountPublicKey, isSigner: false, isWritable: true },
      { pubkey: deliberativelyMintDerivedAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: participantMintDerivedAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: participantTokenAccount.publicKey, isSigner: false, isWritable: false },
      { pubkey: pda, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: instructionBuffer,
  });

  transaction.add(participateInstruction);

  transaction.feePayer = publicKey;
  const signers: Signer[] = [participantTokenAccount];
  transaction.partialSign(...signers);

  const instructionTransactionSignature = await sendTransaction(transaction, connection);
  await connection.confirmTransaction(instructionTransactionSignature, "processed");

  return {
    participantTokenAccountPublicKey: participantTokenAccount.publicKey,
    pda,
  };
};
