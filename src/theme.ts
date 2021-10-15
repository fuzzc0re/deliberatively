import { createTheme, ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#f9f9f9",
      contrastText: "#111",
      dark: "#666666",
    },
    secondary: {
      main: "#ad57da",
    },
    error: {
      main: "#af0c00",
    },
    warning: {
      main: "#ecb158",
    },
    text: {
      primary: "#121212",
      secondary: "f9f9f9",
    },
    success: {
      main: "#1d7d22",
    },
    background: {
      paper: "#f9f9f9",
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Nunito", "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    button: {
      textTransform: "none",
    },
    h3: {
      fontSize: "2.3rem",
    },
  },
};

export const theme = createTheme(themeOptions);
