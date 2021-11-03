import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { StyledTextField } from "../components/styled/TextField";
import { GoToProposeAlternativeButton } from "../components/buttons/GoToProposeAlternative";
import { GoToParticipateButton } from "../components/buttons/GoToParticipate";

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
  const { currentVoteMarket, balance, isVoteParticipant, myPresentationText, setMyPresentationText } =
    useVoteMarketContext();

  return (
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
        <StyledTypography>
          Share the url with anyone who you think should participate in this vote market.
        </StyledTypography>
      </StyledGrid>

      {!isVoteParticipant && (
        <StyledGrid item xs={1} sm={12} md={12}>
          <StyledTypography>
            If you want to participate then you need to provide the vote market keyword and a text presenting yourself
            to the other market participants.
          </StyledTypography>
        </StyledGrid>
      )}

      {isVoteParticipant && (
        <StyledGrid item xs={1} sm={12} md={12}>
          <StyledTypography>My presentation text:</StyledTypography>
          <StyledTextField multiline maxRows={2} value={myPresentationText} onChange={setMyPresentationText} />
          <StyledTypography>70/80</StyledTypography>
        </StyledGrid>
      )}
      {isVoteParticipant && (
        <StyledGrid item xs={1} sm={12} md={12}>
          <StyledTypography paragraph>My voting power: {balance}</StyledTypography>
        </StyledGrid>
      )}

      <StyledGrid item xs={1} sm={12} md={12}>
        {isVoteParticipant ? <GoToProposeAlternativeButton /> : <GoToParticipateButton />}
      </StyledGrid>
    </StyledGrid>
  );
};

export default VoteMarket;
