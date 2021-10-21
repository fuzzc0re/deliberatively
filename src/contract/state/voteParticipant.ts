import { Connection, PublicKey } from "@solana/web3.js";

import { Key, MAX_PRESENTATION_TEXT_LEN, MAX_PUBLIC_KEY_LEN } from "../constants";

interface VoteParticipantState {
  key: Key;
  voteMarketPublicKey: PublicKey;
  voteMarketParticipantPublicKey: PublicKey;
  presentationText: string;
  hasProvidedKeyword: boolean;
  isRepresentative: boolean;
  alternative: PublicKey;
}

export const decodeVoteParticipantState = async (
  connection: Connection,
  ownTokenAccountPDA: PublicKey
): Promise<VoteParticipantState> => {
  const account = await connection.getParsedAccountInfo(ownTokenAccountPDA);

  const accountValueData = account?.value?.data.valueOf() as Uint8Array;
  const key = accountValueData[0];

  const stop1 = 1 + MAX_PUBLIC_KEY_LEN;
  const voteMarketPKData = accountValueData.subarray(1, stop1);
  // const voteMarketPKData = accountValueData.subarray(1, 33);
  const voteMarketPublicKey = new PublicKey(voteMarketPKData);

  const stop2 = stop1 + MAX_PUBLIC_KEY_LEN;
  const voteMarketParticipantPKData = accountValueData.subarray(stop1, stop2);
  // const voteMarketParticipantPKData = accountValueData.subarray(33, 65);
  const voteMarketParticipantPublicKey = new PublicKey(voteMarketParticipantPKData);

  // 65-68 is shit unused data
  const stop3 = 4 + stop2;
  const stop4 = stop3 + MAX_PRESENTATION_TEXT_LEN;
  const presentationData = accountValueData.subarray(stop3, stop4);
  // const presentationData = accountValueData.subarray(69, 149);
  const dec = new TextDecoder();
  const presentationText = dec.decode(presentationData);

  const hasProvidedKeywordData = accountValueData[stop4];
  // const hasProvidedKeywordData = accountValueData[149];

  const stop5 = stop4 + 1;
  const isRepresentativeData = accountValueData[stop5];
  // const isRepresentativeData = accountValueData[150];

  const stop6 = stop5 + 1;
  const stop7 = stop5 + MAX_PUBLIC_KEY_LEN;
  const alternativeData = accountValueData.subarray(stop6, stop7);
  // const alternativeData = accountValueData.subarray(151, 183);
  const alternative = new PublicKey(alternativeData);

  return {
    key,
    voteMarketPublicKey,
    voteMarketParticipantPublicKey,
    presentationText,
    hasProvidedKeyword: hasProvidedKeywordData === 1,
    isRepresentative: isRepresentativeData === 1,
    alternative,
  };
};
