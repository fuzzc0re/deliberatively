import { FC, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { initVoteMarket, InitVoteMarketArgs } from "../../contract/instructions/initVoteMarket";

import { IVoteMarket, setVoteMarket } from "../../models/VoteMarket";
import { sha256 } from "../../utils/db";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

import { StyledButton } from "../styled/Button";

export const MintTokenButton: FC = () => {
  const {
    identifierText,
    keyword,
    numberOfParticipants,
    // rebalancingCost,
    numberOfDays,
    maximumNumberOfRepresentatives,
    minimumContributionRequiredFromParticipant,
    // participantPresentationText,
  } = useInitVoteMarketContext();
  const { connection } = useConnection();
  const { connected, wallet, publicKey, sendTransaction } = useWallet();
  const history = useHistory();

  const args: InitVoteMarketArgs = useMemo(
    () => ({
      identifierText,
      keyword,
      numberOfParticipants,
      // rebalancingCost,
      numberOfDays,
      maximumNumberOfRepresentatives,
      minimumContributionRequiredFromParticipant,
      // participantPresentationText,
    }),
    [
      identifierText,
      keyword,
      numberOfParticipants,
      // rebalancingCost,
      numberOfDays,
      maximumNumberOfRepresentatives,
      minimumContributionRequiredFromParticipant,
      // participantPresentationText,
    ]
  );

  const handleClick = useCallback(async () => {
    if (!connected || !wallet || !publicKey) {
      console.log("No wallet found");
      return;
    }

    try {
      const { mintAccountPublicKey, initializerTokenAccountPublicKey, pda } = await initVoteMarket(
        connection,
        publicKey,
        // signTransaction,
        sendTransaction,
        args
      );

      const hash = await sha256(mintAccountPublicKey.toString());

      // if this succeeds then
      const newVoteMarket: IVoteMarket = {
        address: mintAccountPublicKey.toString(),
        hash,
        numberOfParticipants,
        minimumContributionRequiredFromParticipant,
        maxRepresentatives: maximumNumberOfRepresentatives,
        startDate: Date.now(),
        stopDate: Date.now() + 1000 * 60 * 60 * 24 * numberOfDays,
        pda: pda.toString(),
        ownTokenAddress: initializerTokenAccountPublicKey.toString(),
        participants: [],
        alternatives: [],
      };
      await setVoteMarket(newVoteMarket);
      history.push(`/market/${mintAccountPublicKey.toString()}`);
    } catch (error) {
      console.log(error);
    }
  }, [connected, wallet, publicKey]);

  return (
    <StyledButton disableRipple onClick={handleClick}>
      MINT
    </StyledButton>
  );
};
