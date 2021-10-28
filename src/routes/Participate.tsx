import { FC, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { VoteMarketFormContextProvider } from "../context/VoteMarketForm";

import { TextFieldParticipantPresentationText } from "../components/textfields/ParticipantPresentationText";
import { TextFieldKeyword } from "../components/textfields/Keyword";
import { ParticipateButton } from "../components/buttons/Participate";
import { AirdropButton } from "../components/buttons/Airdrop";

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

const Participate: FC = () => {
  const history = useHistory();
  const { currentVoteMarket, isVoteParticipant } = useVoteMarketContext();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && isVoteParticipant) {
      history.replace(`/market/${currentVoteMarket?.address}`);
    }
  }, [connected, isVoteParticipant, currentVoteMarket]);

  return (
    <VoteMarketFormContextProvider>
      <StyledGrid
        container
        rowSpacing={{ xs: 1, sm: 2, md: 2 }}
        columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        columns={{ xs: 1, sm: 12, md: 12 }}
        direction={{ xs: "column", sm: "row" }}
      >
        <StyledGrid item xs={1} sm={12} md={12}>
          <StyledTypography>Vote market: {currentVoteMarket?.address}</StyledTypography>
          <StyledTypography>Title: {currentVoteMarket?.identifierText}</StyledTypography>
        </StyledGrid>

        <StyledGrid item xs={1} sm={4} md={4}>
          <TextFieldParticipantPresentationText optional={false} />
        </StyledGrid>

        <StyledGrid item xs={1} sm={4} md={4}>
          <TextFieldKeyword />
        </StyledGrid>

        <StyledGrid item xs={1} sm={12} md={12}>
          <ParticipateButton />
          <AirdropButton />
        </StyledGrid>
      </StyledGrid>
    </VoteMarketFormContextProvider>
  );
};

export default Participate;
