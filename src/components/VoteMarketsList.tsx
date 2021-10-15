import { FC, useEffect } from "react";
import { List } from "@mui/material";

import { GoToVoteMarket } from "./buttons/GoToVoteMarket";

import { IVoteMarket } from "../models/VoteMarket";

import { useVoteMarketContext } from "../hooks/useVoteMarketContext";

export const VoteMarketsList: FC = () => {
  const { getAllVerifiedVoteMarkets } = useVoteMarketContext();

  let voteMarketsList: IVoteMarket[] = [];
  useEffect(() => {
    async () => {
      voteMarketsList = await getAllVerifiedVoteMarkets();
    };
  }, [getAllVerifiedVoteMarkets]);

  return (
    <List>
      {voteMarketsList.map((voteMarket: IVoteMarket) => {
        <GoToVoteMarket voteMarket={voteMarket} />;
      })}
    </List>
  );
};
