import { FC, useState, KeyboardEvent, MouseEvent } from "react";
import { BrowserRouter } from "react-router-dom";

import { VoteMarketContextProvider } from "./context/VoteMarket";

import { AppToolbar } from "./components/AppToolbar";
import { AppDrawer } from "./components/AppDrawer";
import { Copyright } from "./components/Copyright";
import { Container } from "./components/Container";

import { Routes } from "./Routes";

export const App: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = (e: KeyboardEvent | MouseEvent) => {
    if (e.type === "keydown" && ((e as KeyboardEvent).key === "Tab" || (e as KeyboardEvent).key === "Shift")) {
      return;
    }

    setDrawerOpen(!drawerOpen);
  };

  return (
    <BrowserRouter>
      <VoteMarketContextProvider>
        <AppToolbar handleDrawerToggle={handleDrawerToggle} />
        <AppDrawer drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
        <Container>
          <Routes />
        </Container>
        <Copyright />
      </VoteMarketContextProvider>
    </BrowserRouter>
  );
};
