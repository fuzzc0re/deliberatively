import { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, Signer, Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { DELIBERATIVELY_PROGRAM_ID } from "./constants";

export const checkProgram = async (connection: Connection): Promise<void> => {
  const programInfo = await connection.getAccountInfo(DELIBERATIVELY_PROGRAM_ID);
  if (programInfo === null) {
    throw new Error("Program does not exist in specified address");
  } else if (!programInfo.executable) {
    throw new Error("Program is not executable");
  }
};

export const calculateCost = async (connection: Connection, SIZE: number): Promise<number> => {
  let cost = 0;
  const { feeCalculator } = await connection.getRecentBlockhash();

  // Calculate the cost to fund the account
  cost += await connection.getMinimumBalanceForRentExemption(SIZE);

  // Calculate the cost of sending transactions
  cost += feeCalculator.lamportsPerSignature * 100; // wag

  return cost;
};

export const fundsRequired = async (connection: Connection, publicKey: PublicKey, SIZE: number): Promise<number> => {
  const cost = await calculateCost(connection, SIZE);
  const balance = await connection.getBalance(publicKey);

  if (cost > balance) {
    return cost - balance;
  } else {
    return 0;
  }
};

export const getContractPDA = async (mintAccountPublicKey: PublicKey): Promise<PublicKey> => {
  const deliberativelyMintDerivedAccountPubkey = await PublicKey.createWithSeed(
    mintAccountPublicKey,
    "deliberatively",
    DELIBERATIVELY_PROGRAM_ID
  );

  return deliberativelyMintDerivedAccountPubkey;
};

export const getAccountPDA = async (mintAccountPublicKey: PublicKey, ownPublicKey: PublicKey): Promise<PublicKey> => {
  const mintAccountPublicKeyString = mintAccountPublicKey.toString();
  const initializerMintDerivedAccountPubkey = await PublicKey.createWithSeed(
    ownPublicKey,
    "deliberatively" + mintAccountPublicKeyString.slice(mintAccountPublicKeyString.length - 8),
    DELIBERATIVELY_PROGRAM_ID
  );

  return initializerMintDerivedAccountPubkey;
};

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
    const balance = await connection.getBalance(publicKey);
    console.log("Address " + publicKey.toBase58() + " has balance " + balance);

    if (balance < LAMPORTS_PER_SOL) {
      console.log("Airdrop to the rescue since balance < 1 SOL");
      const airdropSignature = await connection.requestAirdrop(publicKey, 10 * LAMPORTS_PER_SOL); // 1 SOL
      await connection.confirmTransaction(airdropSignature);
      const newBalance = await connection.getBalance(publicKey);
      console.log("New balance for address " + publicKey.toBase58() + " is " + newBalance);
    }

    const mintAccount = Keypair.generate();
    const initializerTokenAccount = Keypair.generate();

    const mintSize = MintLayout.span;
    const accountSize = AccountLayout.span;

    // TODO ask solana/web3.js for custom account size

    const mintRent = await connection.getMinimumBalanceForRentExemption(mintSize);
    const accountRent = await connection.getMinimumBalanceForRentExemption(accountSize);

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
        space: accountSize, // AccountLayout.span but we need that space specifically
        programId: TOKEN_PROGRAM_ID,
        // programId: DELIBERATIVELY_PROGRAM_ID,
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
        lamports: accountRent,
        space: accountSize,
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
        lamports: accountRent,
        space: accountSize,
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

// const findBufferLength = (s: string) => {
//   const buffer = Buffer.from(s, "utf8");
//   return buffer.length;
// };

// interface SanitizedVoteMarketStringInputs {
//   sanitizedIdentifierText: string;
//   sanitizedKeyword: string;
// }

// export const sanitizeInitVoteMarketStringInputs = (
//   identifierText: string,
//   keyword: string
// ): SanitizedVoteMarketStringInputs => {
//   const identifierBufferLength = findBufferLength(identifierText);
//   let it = identifierText;
//   if (identifierBufferLength < 24) {
//     for (let i = 0; i < 24; i++) {
//       it += "0";
//       if (findBufferLength(it) === 24) {
//         break;
//       }
//     }
//   } else if (identifierBufferLength > 24) {
//     throw new Error("Larger than 24");
//   }
//
//   const keywordBufferLength = findBufferLength(keyword);
//   let kw = keyword;
//   if (keywordBufferLength < 36) {
//     for (let j = 0; j < 36; j++) {
//       kw += "0";
//       if (findBufferLength(kw) === 36) {
//         break;
//       }
//     }
//   } else if (keywordBufferLength > 36) {
//     throw new Error("Larger than 36");
//   }
//
//   return { sanitizedIdentifierText: it, sanitizedKeyword: kw };
// };
