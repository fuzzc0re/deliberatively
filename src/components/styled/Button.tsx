import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(1),
  minWidth: "170px",
  maxHeight: "50px",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.primary.dark,
  "&:hover,&:focus": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
