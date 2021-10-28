import { useContext } from "react";

import { VoteMarketFormContext } from "../context/VoteMarketForm";

// hook to access global state
// eslint-disable-next-line
export const useVoteMarketFormContext = () => useContext(VoteMarketFormContext);
// like: const { theme } = useVoteContext();
