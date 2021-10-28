import { Connection, PublicKey } from "@solana/web3.js";

import { IBase } from "./Base";
import { IVoteParticipant, getAllVoteParticipants, deleteVoteParticipant } from "./VoteParticipant";
import { IVoteAlternative, getAllVoteAlternatives, deleteVoteAlternative } from "./VoteAlternative";

import { sha256, getItem, getAllItems, setItem, updateItem, removeItem } from "../utils/db";

import {
  // convertBase64URLToKeypair,
  getContractPDA,
} from "../contract/utils";
import { decodeVoteMarketState } from "../contract/state/VoteMarket";

export interface IVoteMarket extends IBase {
  // token mint Pubkey
  address: string;
  identifierText: string;
  numberOfParticipants: number;
  // rebalancingCost: number;
  maxRepresentatives: number;
  // in unix timestamp
  startDate: number;
  // after that only representatives can propose vote alternatives
  stopDate: number;
  minimumContributionRequiredFromParticipant: number;
  pda: string;
  ownTokenAddress?: string;
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

export const getOrSetVoteMarket = async (connection: Connection, address: string): Promise<IVoteMarket> => {
  try {
    const hash = await sha256(address);
    const existingVoteMarket = await getVoteMarket(hash);
    if (!existingVoteMarket) {
      // const mintKeypair = convertBase64URLToKeypair(address);
      const mintAccountPublicKey = new PublicKey(address);
      const pda = await getContractPDA(mintAccountPublicKey);
      const voteMarketState = await decodeVoteMarketState(connection, pda);
      const newVoteMarket: IVoteMarket = {
        hash,
        address,
        identifierText: voteMarketState.identifierText,
        numberOfParticipants: voteMarketState.numberOfParticipants,
        // rebalancingCost: 0.01,
        maxRepresentatives: voteMarketState.maximumNumberOfRepresentatives,
        minimumContributionRequiredFromParticipant: voteMarketState.minimumContributionRequiredFromParticipant,
        startDate: voteMarketState.startUnixTimestamp,
        stopDate: voteMarketState.stopUnixTimestamp,
        pda: pda.toString(),
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

export const updateVoteMarket = async (voteMarket: IVoteMarket): Promise<void> => {
  try {
    await updateItem("voteMarkets", voteMarket);
  } catch (error) {
    console.log(error);
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
