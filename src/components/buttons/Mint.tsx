import { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import { initVoteMarket, InitVoteMarketArgs } from "../../contract/instructions/initVoteMarket";

import { IVoteMarket, setVoteMarket } from "../../models/VoteMarket";
import { sha256 } from "../../utils/db";

import { StyledButton } from "../styled/Button";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const MintTokenButton: FC = () => {
  const {
    identifierText,
    keyword,
    numberOfDays,
    numberOfParticipants,
    maximumNumberOfRepresentatives,
    minimumContributionRequiredFromParticipant,
    participantPresentationText,
  } = useVoteMarketFormContext();

  const { connection } = useConnection();
  const { connected, wallet, publicKey, sendTransaction } = useWallet();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const history = useHistory();

  const args: InitVoteMarketArgs = {
    identifierText,
    keyword,
    numberOfParticipants,
    // rebalancingCost,
    numberOfDays,
    maximumNumberOfRepresentatives,
    minimumContributionRequiredFromParticipant,
    participantPresentationText,
  };

  const handleClick = async () => {
    setButtonDisabled(true);
    try {
      if (!connected || !wallet || !publicKey) {
        setButtonDisabled(false);
        throw new Error("Your wallet is not connected!");
      }

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
        hash,
        address: mintAccountPublicKey.toString(),
        identifierText,
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
  };

  return (
    <StyledButton disabled={buttonDisabled} disableRipple onClick={handleClick}>
      {buttonDisabled ? <StyledCircularProgress size={30} thickness={2.5} /> : "MINT"}
    </StyledButton>
  );
};
