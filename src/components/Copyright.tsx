import { FC } from "react";
import { Typography, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

import { copyrightHeight } from "../utils/constants";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "0.52em",
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  userSelect: "none",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: "0.52em",
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  userSelect: "none",
  maxLines: 1,
  paddingLeft: theme.spacing(0.55),
  paddingRight: theme.spacing(0.55),
}));

const StyledDiv = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  alignContent: "space-between",
  maxHeight: copyrightHeight,
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.2),
  paddingBottom: theme.spacing(0.2),
}));

export const Copyright: FC = () => {
  return (
    <StyledDiv>
      <StyledTypography variant="subtitle2" noWrap>
        {`Copyright © ${new Date().getFullYear()}  `}
      </StyledTypography>

      <StyledLink color="inherit" href="https://www.dkaroukis.com" target="_blank" rel="noopener">
        {`Dim Karoukis`}
      </StyledLink>

      <StyledTypography variant="subtitle2" noWrap>
        {`&`}
      </StyledTypography>

      <StyledLink color="inherit" href="https://www.fuzznets.com" target="_blank" rel="noopener">
        {`Fuzznets P.C`}
      </StyledLink>

      <StyledTypography variant="subtitle2" noWrap>
        {`. All rights reserved.`}
      </StyledTypography>
    </StyledDiv>
  );
};
