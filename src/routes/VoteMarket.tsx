import {
  FC,
  // useState
} from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

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
}));

const VoteMarket: FC = () => {
  // const [isVoter, setIsVoter] = useState(false);
  // const [balance, setBalance] = useState(0);

  const { currentVoteMarket } = useVoteMarketContext();

  return (
    <StyledGrid
      container
      rowSpacing={{ xs: 2, sm: 3, md: 4 }}
      columnSpacing={{ xs: 2, sm: 3, md: 4 }}
      columns={{ xs: 1, sm: 4, md: 8 }}
      direction={{ xs: "column", sm: "row" }}
    >
      <StyledGrid item xs={1} sm={4} md={8}>
        <StyledTypography paragraph>Vote market: {currentVoteMarket?.address}</StyledTypography>
      </StyledGrid>
    </StyledGrid>
  );
};

export default VoteMarket;
