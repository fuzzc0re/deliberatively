import { FC, KeyboardEvent, MouseEvent } from "react";
import { SwipeableDrawer } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextFieldSearch } from "./textfields/Search";
import { SearchButton } from "./buttons/Search";
import { VoteMarketsList } from "./VoteMarketsList";

import { drawerWidth } from "../utils/constants";

const StyledDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  width: drawerWidth + 8,
  textAlign: "center",
  scrollbarWidth: "none",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

interface DrawerProps {
  drawerOpen: boolean;
  handleDrawerToggle: (event: KeyboardEvent | MouseEvent) => void;
}

export const AppDrawer: FC<DrawerProps> = (props: DrawerProps) => {
  const { drawerOpen, handleDrawerToggle } = props;

  return (
    <StyledDrawer
      anchor="left"
      variant="temporary"
      disableSwipeToOpen={true}
      swipeAreaWidth={0}
      open={drawerOpen}
      onOpen={handleDrawerToggle}
      onClose={handleDrawerToggle}
    >
      <TextFieldSearch />
      <SearchButton />
      <VoteMarketsList />
    </StyledDrawer>
  );
};
