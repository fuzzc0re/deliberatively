import { FC } from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Explanation } from "../components/Explanation";
import { GoMintSomeButton } from "../components/buttons/GoMintSome";
import { GoToGithubButton } from "../components/buttons/GoToGithub";

const StyledBottomGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  justifyContent: "space-evenly",
}));

const Home: FC = () => {
  return (
    <Grid
      container
      rowSpacing={{ xs: 2, sm: 3, md: 4 }}
      columnSpacing={{ xs: 2, sm: 3, md: 4 }}
      columns={{ xs: 1, sm: 4, md: 8 }}
      direction={{ xs: "column", sm: "row" }}
    >
      <Grid item xs={1} sm={4} md={8}>
        <Explanation />
      </Grid>

      <StyledBottomGrid item xs={1} sm={4} md={8}>
        <GoMintSomeButton />
        <GoToGithubButton />
      </StyledBottomGrid>
    </Grid>
  );
};

export default Home;
