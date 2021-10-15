import { useContext } from "react";

import { InitVoteMarketContext } from "../context/InitVoteMarket";

// hook to access global state
// eslint-disable-next-line
export const useInitVoteMarketContext = () => useContext(InitVoteMarketContext);
// like: const { theme } = useVoteContext();
