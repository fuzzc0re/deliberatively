import { IBase } from "./Base";
import { IVoteParticipant, getAllVoteParticipants, deleteVoteParticipant } from "./VoteParticipant";
import { IVoteAlternative, getAllVoteAlternatives, deleteVoteAlternative } from "./VoteAlternative";

import { sha256, getItem, setItem, getAllItems, removeItem } from "../utils/db";
import { PublicKey } from "@solana/web3.js";

export interface IVoteMarket extends IBase {
  // token mint Pubkey
  address: string;
  numberOfParticipants: number;
  // rebalancingCost: number;
  maxRepresentatives: number;
  // in unix timestamp
  startDate: number;
  // after that only representatives can propose vote alternatives
  stopDate: number;
  minimumContributionRequiredFromParticipant: number;
  pda: string;
  ownTokenAddress: string;
  participants: IVoteParticipant[];
  alternatives: IVoteAlternative[];
}

export const getVoteMarket = async (hash: string): Promise<IVoteMarket> => {
  try {
    const voteMarket = await getItem("voteMarkets", hash);
    return voteMarket as IVoteMarket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllVoteMarkets = async (): Promise<IVoteMarket[]> => {
  try {
    const voteMarkets = await getAllItems("voteMarkets");
    return voteMarkets as IVoteMarket[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const setVoteMarket = async (voteMarket: IVoteMarket): Promise<void> => {
  try {
    await setItem("voteMarkets", voteMarket);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrSetVoteMarket = async (address: string): Promise<IVoteMarket> => {
  try {
    const hash = await sha256(address);
    const existingVoteMarket = await getVoteMarket(hash);
    if (!existingVoteMarket) {
      const newVoteMarket: IVoteMarket = {
        hash,
        address,
        numberOfParticipants: 10,
        // rebalancingCost: 0.01,
        maxRepresentatives: 3,
        minimumContributionRequiredFromParticipant: 1,
        startDate: Date.now(),
        stopDate: Date.now() + 1000 * 60 * 60 * 30,
        ownTokenAddress: new PublicKey("").toString(),
        pda: new PublicKey("").toString(),
        participants: [],
        alternatives: [],
      };
      await setVoteMarket(newVoteMarket);
      return newVoteMarket;
    } else {
      return existingVoteMarket;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// also deletes associated vote participants and alternatives
export const deleteVoteMarket = async (hash: string): Promise<void> => {
  try {
    const voteMarket = await getVoteMarket(hash);
    const voteMarketAddress = voteMarket.address;
    await removeItem("voteMarkets", hash);
    const associatedVoteParticipants = await getAllVoteParticipants(voteMarketAddress);
    for (let i = 0; i < associatedVoteParticipants.length; i++) {
      await deleteVoteParticipant(associatedVoteParticipants[i].hash);
    }
    const associatedVoteAlternatives = await getAllVoteAlternatives(voteMarketAddress);
    for (let i = 0; i < associatedVoteAlternatives.length; i++) {
      await deleteVoteAlternative(associatedVoteAlternatives[i].hash);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
