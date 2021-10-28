import { Connection, PublicKey } from "@solana/web3.js";

import { getVoteMarket } from "../models/VoteMarket";

import { sha256 } from "./db";

// import { convertBase64URLToKeypair } from "../contract/utils";

export const voteMarketAddressValidator = async (connection: Connection, address: string): Promise<boolean> => {
  if (address === "") {
    return false;
  } else if (address.length > 50 || address.length < 32) {
    return false;
  } else {
    try {
      // const mintKeypair = convertBase64URLToKeypair(address);
      const hash = await sha256(address);
      const existingVoteMarket = await getVoteMarket(hash);
      if (!existingVoteMarket) {
        const mintAccountPublicKey = new PublicKey(address);
        const mintAccount = await connection.getAccountInfo(mintAccountPublicKey);
        if (mintAccount === null) {
          console.log("Program needs to be built and deployed");
          return false;
        }
        console.log(`Using token mint ${mintAccountPublicKey.toBase58()}`);
        return true;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};

// export const voteExists = async (connection: Connection, programId: PublicKey) => {
//   const programInfo = await connection.getAccountInfo(programId);
//   if (programInfo === null) {
//     console.log("Program needs to be built and deployed");
//     return false;
//   } else if (!programInfo.executable) {
//     console.log("Program is not executable");
//     return false;
//   }
//   console.log(`Using program ${programId.toBase58()}`);
//   return true;
// };
//
interface ReturnForShitFunction {
  isVoter: boolean;
  balance: number;
}
export const isParticipatingVoterValidator = (): ReturnForShitFunction => {
  return {
    isVoter: true,
    balance: 100,
  };
};
