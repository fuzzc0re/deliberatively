import { FC, Suspense, lazy } from "react";
import { withRouter, Route, Switch, useLocation } from "react-router-dom";
import { LinearProgress } from "@mui/material";
// import { createBrowserHistory } from "history";

const Home = lazy(() => import("./routes/Home"));
const Mint = lazy(() => import("./routes/Mint"));
const InvalidVoteMarketAddress = lazy(() => import("./routes/InvalidVoteMarketAddress"));
const VoteMarket = lazy(() => import("./routes/VoteMarket"));
// const Participate = lazy(() => import("./routes/Participate"));
// const Contribute = lazy(() => import("./routes/Contribute"));
const PageNotFound = lazy(() => import("./routes/PageNotFound"));

const RoutesSwitch: FC = () => {
  const location = useLocation();
  // const history = createBrowserHistory();

  return (
    <Suspense fallback={<LinearProgress variant="indeterminate" />}>
      <Switch location={location}>
        {/*<Router history={history}>*/}
        <Route exact path="/" component={Home} />
        <Route exact path="/mint" component={Mint} />
        <Route exact path="/market/:voteMarketAddress" component={VoteMarket} />
        {/*<Route exact path="/participate/:voteMarketAddress" component={Participate} />
           <Route exact path="/contribute/:voteMarketAddress" component={Contribute} />*/}
        <Route exact path="/invalid-vote-market-address" component={InvalidVoteMarketAddress} />
        <Route component={PageNotFound} />
        {/*</Router>*/}
      </Switch>
    </Suspense>
  );
};

export const Routes = withRouter(RoutesSwitch);
