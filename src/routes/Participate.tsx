import { FC, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { ParticipateButton } from "../components/buttons/Participate";

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
  // const [isVoter, setIsVoter] = useState(false);
  // const [balance, setBalance] = useState(0);

  const history = useHistory();
  const { currentVoteMarket, isVoteParticipant } = useVoteMarketContext();
  const { connected } = useWallet();
  // const { connection } = useConnection();
  // const history = useHistory();
  //
  useEffect(() => {
    if (connected && isVoteParticipant && currentVoteMarket) {
      history.replace(`/market/${currentVoteMarket.address}`);
    }
  }, [currentVoteMarket, isVoteParticipant, connected]);

  return (
    <StyledGrid
      container
      rowSpacing={{ xs: 1, sm: 3, md: 3 }}
      columnSpacing={{ xs: 1, sm: 2, md: 2 }}
      columns={{ xs: 1, sm: 12, md: 12 }}
      direction={{ xs: "column", sm: "row" }}
    >
      <StyledGrid item xs={1} sm={12} md={12}>
        <StyledTypography paragraph>Participate in {currentVoteMarket?.address}</StyledTypography>
      </StyledGrid>

      <StyledGrid item xs={1} sm={12} md={12}>
        <ParticipateButton />
      </StyledGrid>
    </StyledGrid>
  );
};

export default Participate;