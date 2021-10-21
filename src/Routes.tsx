import { FC, Suspense, lazy } from "react";
import { withRouter, Route, Switch, useLocation } from "react-router-dom";
import { LinearProgress } from "@mui/material";

const Home = lazy(() => import("./routes/Home"));
const Mint = lazy(() => import("./routes/Mint"));
const InvalidVoteMarketAddress = lazy(() => import("./routes/InvalidVoteMarketAddress"));
const VoteMarket = lazy(() => import("./routes/VoteMarket"));
const ProposeAlternative = lazy(() => import("./routes/ProposeAlternative"));
const Participate = lazy(() => import("./routes/Participate"));
const PageNotFound = lazy(() => import("./routes/PageNotFound"));

const RoutesSwitch: FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LinearProgress variant="indeterminate" />}>
      <Switch location={location}>
        <Route exact path="/" component={Home} />
        <Route exact path="/mint" component={Mint} />
        <Route exact path="/market/invalid" component={InvalidVoteMarketAddress} />
        <Route exact path="/market/:voteMarketAddress/participate" component={Participate} />
        <Route exact path="/market/:voteMarketAddress/propose" component={ProposeAlternative} />
        <Route exact path="/market/:voteMarketAddress" component={VoteMarket} />
        <Route component={PageNotFound} />
      </Switch>
    </Suspense>
  );
};

export const Routes = withRouter(RoutesSwitch);
