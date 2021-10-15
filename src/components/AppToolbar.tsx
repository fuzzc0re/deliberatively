import React, { FC, useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  //   Slide, useScrollTrigger
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

import { ConnectButton } from "./buttons/Connect";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

const StyledTypography = styled(Typography)(() => ({
  flexGrow: 1,
}));

interface ToolbarProps {
  handleDrawerToggle: (event: KeyboardEvent | MouseEvent) => void;
}

export const AppToolbar: FC<ToolbarProps> = (props: ToolbarProps) => {
  // const trigger = useScrollTrigger();
  const { handleDrawerToggle } = props;
  const [foundVerifiedVoteMarkets, setFoundVerifiedVoteMarkets] = useState(false);
  const { getAllVerifiedVoteMarkets } = useVoteMarketContext();

  const check = async () => {
    const markets = await getAllVerifiedVoteMarkets();
    if (markets) {
      setFoundVerifiedVoteMarkets(false); // true
    }
  };

  useEffect(() => {
    check();
  }, [foundVerifiedVoteMarkets, setFoundVerifiedVoteMarkets, getAllVerifiedVoteMarkets]);

  return (
    // <Slide appear={false} direction="down" in={!trigger}>
    // </Slide>
    <StyledAppBar position="fixed">
      <Toolbar variant="dense">
        <StyledMenuButton
          edge="start"
          color="inherit"
          aria-label="menu"
          size="large"
          disableRipple
          onClick={foundVerifiedVoteMarkets ? handleDrawerToggle : undefined}
        >
          <MenuIcon />
        </StyledMenuButton>
        <StyledTypography variant="h6">Deliberatively</StyledTypography>
        <ConnectButton />
      </Toolbar>
    </StyledAppBar>
  );
};
