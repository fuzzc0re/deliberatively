import { FC } from "react";
import { useHistory } from "react-router-dom";

import { useVoteMarketContext } from "../../hooks/useVoteMarketContext";

import { StyledButton } from "../styled/Button";

export const GoToProposeAlternativeButton: FC = () => {
  const history = useHistory();
  const { currentVoteMarket } = useVoteMarketContext();

  const handleClick = () => {
    if (currentVoteMarket) {
      history.push(`/market/${currentVoteMarket.address}/propose`);
    }
  };

  return <StyledButton onClick={handleClick}>Propose Alternative</StyledButton>;
};
