import { FC, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextFieldMarketIdentifierText } from "../components/textfields/MarketIdentifierText";
import { TextFieldKeyword } from "../components/textfields/Keyword";
import { TextFieldParticipantPresentationText } from "../components/textfields/ParticipantPresentationText";
import { TextFieldParticipants } from "../components/textfields/Participants";
import { TextFieldNumberOfDays } from "../components/textfields/NumberOfDays";
import { TextFieldMaximumNumberOfRepresentatives } from "../components/textfields/MaximumNumberOfRepresentatives";

import { AirdropButton } from "../components/buttons/Airdrop";
import { MintTokenButton } from "../components/buttons/Mint";

// import { copyrightHeight, toolbarHeight } from "../utils/constants";

import { InitVoteMarketContextProvider } from "../context/InitVoteMarket";

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledGridItem = styled(Grid)(() => ({
  textAlign: "center",
  justifyContent: "space-evenly",
}));

const Mint: FC = () => {
  const [canInitializeMint, setCanInitializeMint] = useState(false);

  return (
    <InitVoteMarketContextProvider>
      <StyledGrid
        container
        rowSpacing={{ xs: 5, sm: 7 }}
        columnSpacing={{ sm: 9 }}
        columns={{ xs: 1, sm: 9, md: 9 }}
        direction={{ xs: "column", sm: "row" }}
      >
        <StyledGrid item xs={1} sm={9} md={9}>
          <Typography paragraph>
            For now the associated contract runs on the Solana Devnet so make sure to configure your wallet's network
            accordingly. An airdrop button for 1 SOL on the devnet has been provided for you to test the website.
          </Typography>
          <Typography paragraph>
            Please fill out the following fields in order to create a new vote market token. When you are done, press
            the mint button and make sure to have enough SOL for the transaction.
          </Typography>
        </StyledGrid>

        <StyledGridItem item xs={1} sm={3} md={3}>
          <TextFieldMarketIdentifierText />
        </StyledGridItem>

        <StyledGridItem item xs={1} sm={3} md={3}>
          <TextFieldKeyword />
        </StyledGridItem>

        <StyledGridItem item xs={1} sm={3} md={3}>
          <TextFieldParticipantPresentationText optional />
        </StyledGridItem>

        <StyledGridItem item xs={1} sm={3} md={3}>
          <TextFieldParticipants />
        </StyledGridItem>

        <StyledGridItem item xs={1} sm={3} md={3}>
          <TextFieldNumberOfDays />
        </StyledGridItem>

        <StyledGridItem item xs={1} sm={3} md={3}>
          <TextFieldMaximumNumberOfRepresentatives />
        </StyledGridItem>

        <StyledGridItem item xs={1} sm={9} md={9}>
          <MintTokenButton />
          <AirdropButton />
        </StyledGridItem>
      </StyledGrid>
    </InitVoteMarketContextProvider>
  );
};

export default Mint;
