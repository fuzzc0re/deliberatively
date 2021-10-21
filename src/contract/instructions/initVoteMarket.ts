import { Token, MintLayout, AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
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
  MAX_VOTE_MARKET_LEN,
  MAX_VOTE_PARTICIPANT_LEN,
  MAX_IDENTIFIER_TEXT_LEN,
  MAX_KEYWORD_LEN,
  // MAX_PRESENTATION_TEXT_LEN,
} from "../constants";

export interface InitVoteMarketArgs {
  identifierText: string;
  keyword: string;
  numberOfParticipants: number;
  maximumNumberOfRepresentatives: number;
  numberOfDays: number;
  minimumContributionRequiredFromParticipant: number;
  // participantPresentationText: string;
}

class InitVoteMarketInstructionData extends Struct {
  instruction = Instruction.InitVoteMarket;
  identifierText = "some identifier text";
  keyword = "some keyword";
  numberOfParticipants = 5;
  // rebalancingCost = 0.01;
  maximumNumberOfRepresentatives = 2;
  numberOfDays = 1;
  minimumContributionRequiredFromParticipant = 1000; // lamports
  // participantPresentationText = "some participant presentation text";
  constructor(fields: InitVoteMarketArgs) {
    super(fields);
    this.instruction = Instruction.InitVoteMarket;
    this.identifierText = fields.identifierText;
    this.keyword = fields.keyword;
    this.numberOfParticipants = fields.numberOfParticipants;
    // this.rebalancingCost = fields.rebalancingCost;
    this.maximumNumberOfRepresentatives = fields.maximumNumberOfRepresentatives;
    this.numberOfDays = fields.numberOfDays;
    this.minimumContributionRequiredFromParticipant = fields.minimumContributionRequiredFromParticipant;
    // this.participantPresentationText = fields.participantPresentationText;
  }
}

SOLANA_SCHEMA.set(InitVoteMarketInstructionData, {
  kind: "struct",
  fields: [
    ["instruction", "u8"],
    ["identifierText", "string"],
    ["keyword", "string"],
    ["numberOfParticipants", "u32"],
    // ["rebalancingCost", "u8"],
    ["maximumNumberOfRepresentatives", "u32"],
    ["numberOfDays", "u16"],
    ["minimumContributionRequiredFromParticipant", "u64"],
    // ["participantPresentationText", "string"],
  ],
});

interface IMintVoteMarketTransactions {
  transaction: Transaction;
  deliberativelyMintDerivedAccountPubkey: PublicKey;
  initializerMintDerivedAccountPubkey: PublicKey;
  initializerTokenAccount: Signer;
  mintAccount: Signer;
  pda: PublicKey;
}

export const initVoteMarketMintTransactions = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<IMintVoteMarketTransactions> => {
  try {
    const mintAccount = Keypair.generate();
    const mintSize = MintLayout.span;
    const mintRent = await connection.getMinimumBalanceForRentExemption(mintSize);

    // For the token holding accounts [not writable]
    const accountSize = AccountLayout.span;
    const accountRent = await connection.getMinimumBalanceForRentExemption(accountSize);

    // For the writable accounts
    const initializerTokenAccount = Keypair.generate();
    const mintDerivedProgramAccountRent = await connection.getMinimumBalanceForRentExemption(MAX_VOTE_MARKET_LEN);
    const mintDerivedParticipantAccountRent = await connection.getMinimumBalanceForRentExemption(
      MAX_VOTE_PARTICIPANT_LEN
    );

    const transaction = new Transaction();
    transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

    // PublicKey creates the mint account.
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintAccount.publicKey,
        lamports: mintRent,
        space: mintSize, // MintLayout.span but we need to only store the Pubkey of token holder.
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // PublicKey creates associated account that will hold 1 vote token.
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: initializerTokenAccount.publicKey,
        lamports: accountRent,
        space: accountSize,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Create account with seed for DELIBERATIVELY_PROGRAM_ID
    // Deliberatively will use this to write vote market data
    const deliberativelyMintDerivedAccountPubkey = await getContractPDA(mintAccount.publicKey);
    transaction.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        newAccountPubkey: deliberativelyMintDerivedAccountPubkey,
        basePubkey: mintAccount.publicKey,
        seed: "deliberatively",
        lamports: mintDerivedProgramAccountRent, // accountRent,
        space: MAX_VOTE_MARKET_LEN, // accountSize,
        programId: DELIBERATIVELY_PROGRAM_ID,
      })
    );

    // Create account with seed for initializer
    // Deliberatively will use this to write vote market participant data
    const initializerMintDerivedAccountPubkey = await getAccountPDA(mintAccount.publicKey, publicKey);
    const mintAccountPublicKeyString = mintAccount.publicKey.toString();
    transaction.add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        newAccountPubkey: initializerMintDerivedAccountPubkey,
        basePubkey: publicKey,
        seed: "deliberatively" + mintAccountPublicKeyString.slice(mintAccountPublicKeyString.length - 8),
        lamports: mintDerivedParticipantAccountRent,
        space: MAX_VOTE_PARTICIPANT_LEN,
        programId: DELIBERATIVELY_PROGRAM_ID,
      })
    );

    const pda = await PublicKey.findProgramAddress(
      [Buffer.from("deliberatively", "utf8"), mintAccount.publicKey.toBuffer()],
      DELIBERATIVELY_PROGRAM_ID
    );
    // PDA becomes mint authority.
    transaction.add(
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        2, // decimals
        pda[0], // Mint authority
        pda[0] // Freeze authority
      )
    );

    // Publickey initializes its account
    transaction.add(
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        mintAccount.publicKey,
        initializerTokenAccount.publicKey,
        publicKey
      )
    );

    return {
      transaction,
      deliberativelyMintDerivedAccountPubkey,
      initializerMintDerivedAccountPubkey,
      initializerTokenAccount,
      mintAccount,
      pda: pda[0],
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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

  const sanitizedIdentifierText = puffText(args.identifierText, MAX_IDENTIFIER_TEXT_LEN);
  const sanitizedKeyword = puffText(args.keyword, MAX_KEYWORD_LEN);
  // const sanitizerParticipantPresentationText = puffText(
  //   "Some participant presentation text",
  //   MAX_PRESENTATION_TEXT_LEN
  // );

  const newVoteMarketInstructionData = new InitVoteMarketInstructionData({
    identifierText: sanitizedIdentifierText,
    keyword: sanitizedKeyword,
    numberOfParticipants: args.numberOfParticipants,
    // rebalancingCost: args.rebalancingCost,
    maximumNumberOfRepresentatives: args.maximumNumberOfRepresentatives,
    numberOfDays: args.numberOfDays,
    minimumContributionRequiredFromParticipant: args.minimumContributionRequiredFromParticipant,
    // participantPresentationText: sanitizerParticipantPresentationText,
  });

  const instructionBuffer = newVoteMarketInstructionData.encode();

  const initMintInstruction = new TransactionInstruction({
    programId: DELIBERATIVELY_PROGRAM_ID,
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: false },
      { pubkey: mintAccount.publicKey, isSigner: false, isWritable: false },
      { pubkey: deliberativelyMintDerivedAccountPubkey, isSigner: false, isWritable: true },
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
