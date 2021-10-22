import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "90%",
  padding: theme.spacing(3),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  letterSpacing: theme.spacing(0.07),
}));

const StyledLink = styled("a")(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  justifyContent: "center",
  textAlign: "center",
}));

export const Explanation: FC = () => {
  return (
    <StyledBox>
      <StyledTypography paragraph>
        This is a Solana-based decentralized governance platform where participants can create tokens that represent the
        voting power of their holder in a deliberative democracy setting loosely based on
        <StyledLink href="https://arxiv.org/pdf/2109.01436.pdf" target="_blank" rel="noopener noreferrer">
          {" this model"}
        </StyledLink>
        .
      </StyledTypography>

      <StyledTypography paragraph>
        The initializer assigns the token's mint authority to a smart contract that everyone can trust and whose source
        code is available on Github. The contract gives each participant 1 token, representing 1 vote. The receiver can
        divide their vote into 100 pieces and distribute it to other participants.
      </StyledTypography>

      <StyledTypography paragraph>
        After a specified number of days, the participants with the most voting power can propose one alternative each.
        The rest of the participants assign percentages of their voting power on each alternative, representing their
        preference.
      </StyledTypography>
    </StyledBox>
  );
};
