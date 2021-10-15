import { FC } from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextFieldParticipants } from "../components/textfields/Participants";
import { TextFieldNumberOfDays } from "../components/textfields/NumberOfDays";
import { TextFieldMaximumNumberOfRepresentatives } from "../components/textfields/MaximumNumberOfRepresentatives";

import { MintTokenButton } from "../components/buttons/Mint";

// import { copyrightHeight, toolbarHeight } from "../utils/constants";

import { InitVoteMarketContextProvider } from "../context/InitVoteMarket";

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
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
        rowSpacing={{ xs: 2, sm: 3, md: 4 }}
        columnSpacing={{ xs: 2, sm: 3, md: 4 }}
        columns={{ xs: 1, sm: 4, md: 8 }}
        direction={{ xs: "column", sm: "row" }}
      >
        <StyledGrid item xs={1} sm={4} md={8}>
          <TextFieldParticipants />
        </StyledGrid>

        <StyledGrid item xs={1} sm={4} md={8}>
          <TextFieldNumberOfDays />
        </StyledGrid>

        <StyledGrid item xs={1} sm={4} md={8}>
          <TextFieldMaximumNumberOfRepresentatives />
        </StyledGrid>

        <StyledBottomGrid item xs={1} sm={4} md={8}>
          <MintTokenButton />
        </StyledBottomGrid>
      </StyledGrid>
    </InitVoteMarketContextProvider>
  );
};

export default Mint;
