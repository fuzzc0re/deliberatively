import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Signer,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  Struct,
  SOLANA_SCHEMA,
} from "@solana/web3.js";

import { initVoteMarketMintTransactions } from "../utils";

import { DELIBERATIVELY_PROGRAM_ID, Instruction } from "../constants";

export interface InitVoteMarketArgs {
  /// Number of participants == number of minted tokens
  numberOfParticipants: number;
  /// With each transaction, the participant burns a percentage of voting power.
  /// From 1 to 100.
  // rebalancingCost: number;
  /// The participants that have accumulated the most voting power and therefore can propose alternatives.
  maximumNumberOfRepresentatives: number;
  /// Date of the request + number_of_days gives us the unix timestamp of end date.
  numberOfDays: number;
  /// If > 0 then a participant needs to lock this amount of tokens to the vote market.
  minimumContributionRequiredFromParticipant: number;
}

class InitVoteMarketInstructionData extends Struct {
  instruction = Instruction.InitVoteMarket;
  numberOfParticipants = 5;
  // rebalancingCost = 0.01;
  maximumNumberOfRepresentatives = 2;
  numberOfDays = 1;
  minimumContributionRequiredFromParticipant = 1000; // lamports
  constructor(fields: InitVoteMarketArgs) {
    super(fields);
    this.instruction = Instruction.InitVoteMarket;
    this.numberOfParticipants = fields.numberOfParticipants;
    // this.rebalancingCost = fields.rebalancingCost;
    this.maximumNumberOfRepresentatives = fields.maximumNumberOfRepresentatives;
    this.numberOfDays = fields.numberOfDays;
    this.minimumContributionRequiredFromParticipant = fields.minimumContributionRequiredFromParticipant;
  }
}

SOLANA_SCHEMA.set(InitVoteMarketInstructionData, {
  kind: "struct",
  fields: [
    ["instruction", "u8"],
    ["numberOfParticipants", "u32"],
    // ["rebalancingCost", "u8"],
    ["maximumNumberOfRepresentatives", "u32"],
    ["numberOfDays", "u16"],
    ["minimumContributionRequiredFromParticipant", "u32"],
  ],
});

interface IInitVoteMarketReturn {
  mintAccountPublicKey: PublicKey;
  initializerTokenAccountPublicKey: PublicKey;
  pda: PublicKey;
}

export const initVoteMarket = async (
  connection: Connection,
  publicKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  args: InitVoteMarketArgs
): Promise<IInitVoteMarketReturn> => {
  const {
    transaction,
    deliberativelyMintDerivedAccountPubkey,
    initializerMintDerivedAccountPubkey,
    initializerTokenAccount,
    mintAccount,
    pda,
  } = await initVoteMarketMintTransactions(connection, publicKey);

  // const { sanitizedIdentifierText, sanitizedKeyword } = sanitizeInitVoteMarketStringInputs(
  //   args.identifierText,
  //   args.keyword
  // );

  const newVoteMarketInstructionData = new InitVoteMarketInstructionData({
    numberOfParticipants: args.numberOfParticipants,
    // rebalancingCost: args.rebalancingCost,
    maximumNumberOfRepresentatives: args.maximumNumberOfRepresentatives,
    numberOfDays: args.numberOfDays,
    minimumContributionRequiredFromParticipant: args.minimumContributionRequiredFromParticipant,
  });

  const instructionBuffer = newVoteMarketInstructionData.encode();

  const initMintInstruction = new TransactionInstruction({
    programId: DELIBERATIVELY_PROGRAM_ID,
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: false },
      { pubkey: mintAccount.publicKey, isSigner: false, isWritable: false },
      { pubkey: deliberativelyMintDerivedAccountPubkey, isSigner: false, isWritable: true },
      // { pubkey: tokenHolderAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: initializerMintDerivedAccountPubkey, isSigner: false, isWritable: true },
      { pubkey: initializerTokenAccount.publicKey, isSigner: false, isWritable: false },
      { pubkey: pda, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: instructionBuffer,
  });

  transaction.add(initMintInstruction);

  transaction.feePayer = publicKey;
  const signers: Signer[] = [mintAccount, initializerTokenAccount];
  transaction.partialSign(...signers);

  const instructionTransactionSignature = await sendTransaction(transaction, connection);
  await connection.confirmTransaction(instructionTransactionSignature, "processed");

  return {
    mintAccountPublicKey: mintAccount.publicKey,
    initializerTokenAccountPublicKey: initializerTokenAccount.publicKey,
    pda: pda,
  };
};
