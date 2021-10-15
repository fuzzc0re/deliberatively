import { render } from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";

import { AppContainer } from "./AppContainer";

import { theme } from "./theme";

render(
  <ThemeProvider theme={theme}>
    <AppContainer />
  </ThemeProvider>,
  document.getElementById("app")
);
