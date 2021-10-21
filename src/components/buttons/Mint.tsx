import { FC, useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import { initVoteMarket, InitVoteMarketArgs } from "../../contract/instructions/initVoteMarket";

import { IVoteMarket, setVoteMarket } from "../../models/VoteMarket";
import { sha256 } from "../../utils/db";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

import { StyledButton } from "../styled/Button";

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  width: theme.spacing(0.05),
  height: theme.spacing(0.05),
  color: theme.palette.primary.contrastText,
}));

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
  const [buttonDisabled, setButtonDisabled] = useState(false);
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
    setButtonDisabled(true);
    if (!connected || !wallet || !publicKey) {
      console.log("No wallet found");
      setButtonDisabled(false);
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
      setButtonDisabled(false);
      history.push(`/market/${mintAccountPublicKey.toString()}`);
    } catch (error) {
      setButtonDisabled(false);
      console.log(error);
    }
  }, [connected, wallet, publicKey]);

  return (
    <StyledButton disabled={buttonDisabled} disableRipple onClick={handleClick}>
      {buttonDisabled ? <StyledCircularProgress /> : "MINT"}
    </StyledButton>
  );
};
