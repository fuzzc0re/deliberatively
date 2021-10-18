import { FC, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { GoToProposeAlternativeButton } from "../components/buttons/GoToProposeAlternative";

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
}));

const ProposeAlternative: FC = () => {
  const history = useHistory();
  const { currentVoteMarket, isVoteParticipant } = useVoteMarketContext();
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected || !isVoteParticipant) {
      history.replace(`/market/${currentVoteMarket?.address}`);
    }
  }, [currentVoteMarket, connected, isVoteParticipant]);

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
        <GoToProposeAlternativeButton />
      </StyledGrid>
    </StyledGrid>
  );
};

export default ProposeAlternative;
