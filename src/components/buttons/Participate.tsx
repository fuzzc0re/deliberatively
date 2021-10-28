import { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import { participateVoteMarket } from "../../contract/instructions/participateVoteMarket";

import { IVoteMarket, getOrSetVoteMarket, updateVoteMarket } from "../../models/VoteMarket";

import { StyledButton } from "../styled/Button";

// import {
//   // useKeyword,
//   useParticipantPresentationText,
// } from "../../hooks/useInitVoteMarket";
import { useVoteMarketContext } from "../../hooks/useVoteMarketContext";
import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";
// import { convertKeyPairToBase64URL } from "../../contract/utils";

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const ParticipateButton: FC = () => {
  const { keyword, participantPresentationText } = useVoteMarketFormContext();
  const { currentVoteMarket } = useVoteMarketContext();

  const { connection } = useConnection();
  const { connected, wallet, publicKey, sendTransaction } = useWallet();

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const history = useHistory();

  const handleClick = async () => {
    setButtonDisabled(true);
    try {
      if (!connected || !wallet || !publicKey) {
        setButtonDisabled(false);
        throw new Error("Your wallet is not connected!");
      }

      if (!currentVoteMarket) {
        setButtonDisabled(false);
        throw new Error("Current vote market address is not valid");
      }

      const mintAccountPublicKey = new PublicKey(currentVoteMarket.address);

      const { participantTokenAccountPublicKey } = await participateVoteMarket(
        connection,
        publicKey,
        mintAccountPublicKey,
        // signTransaction,
        sendTransaction,
        { keyword, participantPresentationText }
      );

      const updatedVoteMarket: IVoteMarket = await getOrSetVoteMarket(connection, mintAccountPublicKey.toString());
      updatedVoteMarket.ownTokenAddress = participantTokenAccountPublicKey.toString();
      await updateVoteMarket(updatedVoteMarket);

      setButtonDisabled(false);
      history.push(`/market/${mintAccountPublicKey.toString()}`);
    } catch (error) {
      setButtonDisabled(false);
      console.log(error);
    }
  };

  return (
    <StyledButton disabled={buttonDisabled} disableRipple onClick={handleClick}>
      {buttonDisabled ? <StyledCircularProgress size={30} thickness={2.5} /> : "Submit"}
    </StyledButton>
  );
};
