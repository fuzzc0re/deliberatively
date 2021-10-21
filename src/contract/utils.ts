import { Connection, PublicKey } from "@solana/web3.js";

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

const findBufferLength = (s: string) => {
  const buffer = Buffer.from(s, "utf8");
  return buffer.length;
};

export const puffText = (text: string, FINAL_LEN: number): string => {
  const textBufferLength = findBufferLength(text);
  if (textBufferLength < FINAL_LEN) {
    let t = text;
    for (let i = 0; i < FINAL_LEN; i++) {
      t += " ";
      if (findBufferLength(t) === FINAL_LEN) {
        break;
      }
    }

    return t;
  } else if (textBufferLength > FINAL_LEN) {
    throw new Error("Larger than " + FINAL_LEN);
  } else {
    return text;
  }
};
