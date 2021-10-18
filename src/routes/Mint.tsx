import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextFieldParticipants } from "../components/textfields/Participants";
import { TextFieldNumberOfDays } from "../components/textfields/NumberOfDays";
import { TextFieldMaximumNumberOfRepresentatives } from "../components/textfields/MaximumNumberOfRepresentatives";

import { AirdropButton } from "../components/buttons/Airdrop";

import { MintTokenButton } from "../components/buttons/Mint";

// import { copyrightHeight, toolbarHeight } from "../utils/constants";

import { InitVoteMarketContextProvider } from "../context/InitVoteMarket";

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  justifyContent: "space-evenly",
}));

const StyledBottomGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  justifyContent: "space-evenly",
}));

const Mint: FC = () => {
  return (
    <InitVoteMarketContextProvider>
      <StyledGrid
        container
        rowSpacing={{ xs: 2, sm: 3, md: 3 }}
        columnSpacing={{ sm: 1, md: 1 }}
        columns={{ xs: 1, sm: 12, md: 12 }}
        direction={{ xs: "column", sm: "row" }}
      >
        <StyledGrid item xs={1} sm={12} md={12}>
          <Typography>
            For now the associated contract runs on Solana Devnet so make sure to configure your wallet accordingly.
          </Typography>
          <Typography>
            An airdrop button for 1 SOL on the devnet has been provided for you to test the website.
          </Typography>
        </StyledGrid>

        <StyledGrid container columnSpacing={{ sm: 1, md: 1 }}>
          <StyledGridItem item xs={1} sm={3} md={3}>
            <TextFieldParticipants />
          </StyledGridItem>

          <StyledGridItem item xs={1} sm={3} md={3}>
            <TextFieldNumberOfDays />
          </StyledGridItem>

          <StyledGridItem item xs={1} sm={3} md={3}>
            <TextFieldMaximumNumberOfRepresentatives />
          </StyledGridItem>
        </StyledGrid>

        <StyledBottomGrid item xs={1} sm={12} md={12}>
          <MintTokenButton />
          <AirdropButton />
        </StyledBottomGrid>
      </StyledGrid>
    </InitVoteMarketContextProvider>
  );
};

export default Mint;
