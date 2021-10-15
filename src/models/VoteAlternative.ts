import { IBase } from "./Base";

import { getItem, setItem, getAllItems, removeItem } from "../utils/db";

export interface IVoteAlternative extends IBase {
  address: string;
  voteMarketAddress: string;
  proposedByAddress: string;
  votingPowerFor: number;
}

export const getVoteAlternative = async (hash: string): Promise<IVoteAlternative> => {
  try {
    const voteAlternative = await getItem("voteAlternatives", hash);
    return voteAlternative as IVoteAlternative;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllVoteAlternatives = async (voteMarketAddress: string): Promise<IVoteAlternative[]> => {
  try {
    const voteAlternatives = (await getAllItems("voteAlternatives")) as IVoteAlternative[];
    const voteAlternativesForSpecifiedVoteMarket: IVoteAlternative[] = [];

    for (let i = 0; i < voteAlternatives.length; i++) {
      if (voteAlternatives[i].voteMarketAddress === voteMarketAddress) {
        voteAlternativesForSpecifiedVoteMarket.push(voteAlternatives[i]);
      }
    }

    return voteAlternativesForSpecifiedVoteMarket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const setVoteAlternative = async (voteAlternative: IVoteAlternative): Promise<void> => {
  try {
    await setItem("voteAlternatives", voteAlternative);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteVoteAlternative = async (hash: string): Promise<void> => {
  try {
    await removeItem("voteAlternatives", hash);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
