import { ListItem } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(3),
  minWidth: "150px",
  maxHeight: "50px",
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.light,
}));
