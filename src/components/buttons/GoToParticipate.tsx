import { FC } from "react";
import { useHistory } from "react-router-dom";

import { StyledButton } from "../styled/Button";

interface GoToParticipateButtonProps {
  voteMarketAddress: string;
}

export const GoToParticipateButton: FC<GoToParticipateButtonProps> = ({ voteMarketAddress }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/participate/${voteMarketAddress}`);
  };

  return <StyledButton onClick={handleClick}>Participate</StyledButton>;
};
