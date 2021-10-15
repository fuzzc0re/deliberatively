import { IBase } from "./Base";

import { getItem, setItem, getAllItems, removeItem } from "../utils/db";

interface IVotingPowerTransfer {
  voteMarketAddress: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
}

export interface IVoteParticipant extends IBase {
  address: string;
  voteMarketAddress: string;
  transfers: IVotingPowerTransfer[];
}

export const getVoteParticipant = async (hash: string): Promise<IVoteParticipant> => {
  try {
    const voteParticipant = await getItem("voteParticipants", hash);
    return voteParticipant as IVoteParticipant;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllVoteParticipants = async (voteMarketAddress: string): Promise<IVoteParticipant[]> => {
  try {
    const voteParticipants = (await getAllItems("voteParticipants")) as IVoteParticipant[];
    const voteParticipantsForSpecifiedVoteMarket: IVoteParticipant[] = [];

    for (let i = 0; i < voteParticipants.length; i++) {
      if (voteParticipants[i].voteMarketAddress === voteMarketAddress) {
        voteParticipantsForSpecifiedVoteMarket.push(voteParticipants[i]);
      }
    }

    return voteParticipantsForSpecifiedVoteMarket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const setVoteParticipant = async (voteParticipant: IVoteParticipant): Promise<void> => {
  try {
    await setItem("voteParticipants", voteParticipant);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteVoteParticipant = async (hash: string): Promise<void> => {
  try {
    await removeItem("voteParticipants", hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
