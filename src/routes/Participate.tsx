import {
  FC,
  // useState
} from "react";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
// import { useConnection } from "@solana/wallet-adapter-react";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { ParticipateButton } from "../components/buttons/Participate";

import { copyrightHeight, toolbarHeight } from "../utils/constants";

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  justifyContent: "spaceBetween",
  width: "90vw",
  height: `calc(100vh - ${copyrightHeight}px - ${toolbarHeight}px)`,
  margin: 0,
  padding: 0,
  left: 0,
}));

const StyledDiv = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Participate: FC = () => {
  // const [isVoter, setIsVoter] = useState(false);
  // const [balance, setBalance] = useState(0);

  const { currentVoteMarket } = useVoteMarketContext();
  // const { connection } = useConnection();
  // const history = useHistory();

  return (
    <StyledPaper elevation={2}>
      <StyledDiv>{currentVoteMarket?.address}</StyledDiv>
      <StyledDiv>
        <ParticipateButton />
      </StyledDiv>
    </StyledPaper>
  );
};

export default Participate;
