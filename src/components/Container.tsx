import { FC } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { copyrightHeight, toolbarHeight } from "../utils/constants";

const StyledContainer = styled(Box)(({ theme }) => ({
  marginTop: `${toolbarHeight}px`,
  marginLeft: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: `calc(100vh - ${copyrightHeight}px - ${toolbarHeight}px)`,
  justifyContent: "center",
  backgroundColor: theme.palette.primary.light,
}));

export const Container: FC = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};
