import { Connection, PublicKey } from "@solana/web3.js";

import { getVoteMarket } from "../models/VoteMarket";
import { sha256 } from "./db";

export const voteMarketAddressValidator = async (connection: Connection, address: string): Promise<boolean> => {
  if (address === "") {
    return false;
  } else if (address.length > 46) {
    console.log("Address too large: " + address.length);
    return false;
  } else if (address.length < 44) {
    console.log("Address too small: " + address.length);
    return false;
  } else {
    try {
      const hash = await sha256(address);
      const existingVoteMarket = await getVoteMarket(hash);
      if (!existingVoteMarket) {
        const mintAddress = new PublicKey(address);
        const mintAccount = await connection.getAccountInfo(mintAddress);
        if (mintAccount === null) {
          console.log("Program needs to be built and deployed");
          return false;
        }
        // else if (!programInfo.executable) {
        //   console.log("Program is not executable");
        //   return false;
        // }
        console.log(`Using token mint ${mintAddress.toBase58()}`);
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
