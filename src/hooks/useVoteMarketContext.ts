import { useContext } from "react";

import { VoteMarketContext } from "../context/VoteMarket";

// hook to access global state
// eslint-disable-next-line
export const useVoteMarketContext = () => useContext(VoteMarketContext);
// like: const { theme } = useVoteContext();
