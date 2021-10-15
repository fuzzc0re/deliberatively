import { FC } from "react";
import { styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";

import { StyledButton } from "../styled/Button";

const StyledLink = styled("a")(() => ({
  color: "#f9f9f9",
  textDecoration: "none",
  justifyContent: "center",
  textAlign: "center",
}));

export const GoToGithubButton: FC = () => {
  return (
    <StyledButton>
      <StyledLink href="https://github.com/fuzzc0re/deliberatively" target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
      </StyledLink>
    </StyledButton>
  );
};
