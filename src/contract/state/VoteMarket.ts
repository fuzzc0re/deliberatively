import { Connection, PublicKey } from "@solana/web3.js";

import { Key, MAX_IDENTIFIER_TEXT_LEN, MAX_KEYWORD_LEN, MAX_PUBLIC_KEY_LEN } from "../constants";

interface VoteMarketState {
  key: Key;
  identifierText: string;
  keyword: string;
  voteMarketPublicKey: PublicKey;
  numberOfParticipants: number;
  alreadyMintedVotingPower: number;
  maximumNumberOfRepresentatives: number;
  startUnixTimestamp: number;
  stopUnixTimestamp: number;
  minimumContributionRequiredFromParticipant: number;
}

export const converter = (data: Uint8Array): number => {
  let value = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    value = value * 256 + data[i];
  }

  return value;
};

export const decodeVoteMarketState = async (connection: Connection, pda: PublicKey): Promise<VoteMarketState> => {
  const account = await connection.getParsedAccountInfo(pda);

  const accountValueData = account?.value?.data.valueOf() as Uint8Array;
  const key = accountValueData[0];

  const stop1 = 1 + 4;
  const stop2 = stop1 + MAX_IDENTIFIER_TEXT_LEN;
  const identifierTextData = accountValueData.subarray(stop1, stop2);
  const dec = new TextDecoder();
  const identifierText = dec.decode(identifierTextData);

  const stop3 = stop2 + 4;
  const stop4 = stop3 + MAX_KEYWORD_LEN;
  const keywordData = accountValueData.subarray(stop3, stop4);
  const keyword = dec.decode(keywordData);

  const stop5 = stop4 + MAX_PUBLIC_KEY_LEN;
  const voteMarketPKData = accountValueData.subarray(stop4, stop5);
  const voteMarketPublicKey = new PublicKey(voteMarketPKData);

  const stop6 = stop5 + 4; // u32
  const numberOfParticipantsData = accountValueData.subarray(stop5, stop6);
  const numberOfParticipants = converter(numberOfParticipantsData);

  const stop7 = stop6 + 4; // u32
  const alreadyMintedVotingPowerData = accountValueData.subarray(stop6, stop7);
  const alreadyMintedVotingPower = converter(alreadyMintedVotingPowerData);

  const stop8 = stop7 + 4; // u32
  const maximumNumberOfRepresentativesData = accountValueData.subarray(stop7, stop8);
  const maximumNumberOfRepresentatives = converter(maximumNumberOfRepresentativesData);

  const stop9 = stop8 + 8; // i64
  const startUnixTimestampData = accountValueData.subarray(stop8, stop9);
  const startUnixTimestamp = converter(startUnixTimestampData);

  const stop10 = stop9 + 8; // i64
  const stopUnixTimestampData = accountValueData.subarray(stop9, stop10);
  const stopUnixTimestamp = converter(stopUnixTimestampData);

  const stop11 = stop10 + 8; // u64
  const minimumContributionRequiredFromParticipantData = accountValueData.subarray(stop10, stop11);
  const minimumContributionRequiredFromParticipant = converter(minimumContributionRequiredFromParticipantData);

  return {
    key,
    identifierText,
    keyword,
    voteMarketPublicKey,
    numberOfParticipants,
    alreadyMintedVotingPower,
    maximumNumberOfRepresentatives,
    startUnixTimestamp,
    stopUnixTimestamp,
    minimumContributionRequiredFromParticipant,
  };
};
