import { FC, useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useConnection } from "@solana/wallet-adapter-react";
import { ContributeButton } from "../components/buttons/Contribute";

import { copyrightHeight, toolbarHeight } from "../utils/constants";

import { voteMarketAddressValidator, isParticipatingVoterValidator } from "../utils/validators";
import { randomKeys } from "../utils/test_data";

interface IParams {
  voteMarketAddress: string;
}

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

const Contribute: FC = () => {
  const [isVoter, setIsVoter] = useState(false);
  const [balance, setBalance] = useState(0);

  const { connection } = useConnection();
  const { voteMarketAddress } = useParams<IParams>();
  const history = useHistory();

  const checkAddressValidity = useCallback(async () => {
    console.log(voteMarketAddress);
    console.log(randomKeys);
    const validated = await voteMarketAddressValidator(connection, voteMarketAddress);
    if (validated) {
      console.log(validated);
      const voter = isParticipatingVoterValidator();
      if (voter) {
        setIsVoter(true);
        console.log(isVoter);
        setBalance(voter.balance);
        console.log(balance);
      }
    } else {
      history.replace("/invalid-vote-market-address");
    }
  }, [voteMarketAddress]);

  useEffect(() => {
    checkAddressValidity();
  }, [connection, voteMarketAddress, setIsVoter]);

  return (
    <StyledPaper elevation={2}>
      <StyledDiv>{voteMarketAddress}</StyledDiv>
      <StyledDiv>
        <ContributeButton />
      </StyledDiv>
    </StyledPaper>
  );
};

export default Contribute;
