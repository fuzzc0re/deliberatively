import { FC, useState, useEffect, useCallback } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { GoToProposeAlternativeButton } from "../components/buttons/GoToProposeAlternative";
import { GoToParticipateButton } from "../components/buttons/GoToParticipate";

// import { GoToParticipateButton } from "../components/buttons/GoToParticipate";
// import { GoToContributeButton } from "../components/buttons/GoToContribute";

// import { copyrightHeight, toolbarHeight } from "../utils/constants";

// import { isParticipatingVoterValidator } from "../utils/validators";

// const voter = isParticipatingVoterValidator();
// if (voter) {
//   setIsVoter(true);
//   setBalance(voter.balance);
// }

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  justifyContent: "center",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  letterSpacing: theme.spacing(0.07),
  width: "100%",
}));

const VoteMarket: FC = () => {
  const [balance, setBalance] = useState(0);
  const { currentVoteMarket, isVoteParticipant } = useVoteMarketContext();
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const getTokenBalance = useCallback(async () => {
    if (currentVoteMarket && currentVoteMarket.ownTokenAddress && publicKey) {
      try {
        const ownPublicKey = new PublicKey(currentVoteMarket.ownTokenAddress);
        const tokenAccountBalance = await connection.getTokenAccountBalance(ownPublicKey);
        if (tokenAccountBalance.value.uiAmount) {
          setBalance(tokenAccountBalance.value.uiAmount);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentVoteMarket, connection, publicKey]);

  useEffect(() => {
    if (isVoteParticipant) {
      getTokenBalance();
    }
  }, [currentVoteMarket, isVoteParticipant, publicKey, connection]);

  useEffect(() => {
    if (!connected) {
      setBalance(0);
    }
  }, [currentVoteMarket, connected]);

  return (
    <StyledGrid
      container
      rowSpacing={{ xs: 1, sm: 3, md: 3 }}
      columnSpacing={{ xs: 1, sm: 2, md: 2 }}
      columns={{ xs: 1, sm: 12, md: 12 }}
      direction={{ xs: "column", sm: "row" }}
    >
      <StyledGrid item xs={1} sm={12} md={12}>
        <StyledTypography paragraph>Vote market: {currentVoteMarket?.address}</StyledTypography>
      </StyledGrid>

      <StyledGrid item xs={1} sm={12} md={12}>
        <StyledTypography paragraph>My voting power: {balance}</StyledTypography>
      </StyledGrid>

      <StyledGrid item xs={1} sm={12} md={12}>
        {isVoteParticipant ? <GoToProposeAlternativeButton /> : <GoToParticipateButton />}
      </StyledGrid>
    </StyledGrid>
  );
};

export default VoteMarket;
