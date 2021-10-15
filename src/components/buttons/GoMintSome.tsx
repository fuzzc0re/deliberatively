import { FC } from "react";
import { useHistory } from "react-router-dom";

import { StyledButton } from "../styled/Button";

export const GoMintSomeButton: FC = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/mint/`);
  };

  return <StyledButton onClick={handleClick}>GO MINT SOME</StyledButton>;
};
