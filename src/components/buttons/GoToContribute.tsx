import { FC } from "react";
import { useHistory } from "react-router-dom";

import { StyledButton } from "../styled/Button";

interface GoToContributeButtonProps {
  voteMarketAddress: string;
}

export const GoToContributeButton: FC<GoToContributeButtonProps> = ({ voteMarketAddress }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/contribute/${voteMarketAddress}`);
  };

  return <StyledButton onClick={handleClick}>Contribute</StyledButton>;
};
