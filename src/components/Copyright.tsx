import { FC } from "react";
import { Typography, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

import { copyrightHeight } from "../utils/constants";

const StyledTypography = styled(Typography)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  height: copyrightHeight,
  fontSize: "0.85em",
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.2),
  paddingBottom: theme.spacing(0.2),
  userSelect: "none",
}));

export const Copyright: FC = () => {
  return (
    <StyledTypography variant="subtitle2" noWrap>
      {`Copyright © ${new Date().getFullYear()} `}{" "}
      <Link color="inherit" href="https://www.dkaroukis.com" target="_blank" rel="noopener">
        Dim Karoukis
      </Link>
      {" & "}
      <Link color="inherit" href="https://www.fuzznets.com" target="_blank" rel="noopener">
        Fuzznets P.C
      </Link>
      {". All rights reserved."}
    </StyledTypography>
  );
};
