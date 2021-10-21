import { FC, createContext, useState } from "react";

import { InitVoteMarketArgs } from "../contract/instructions/initVoteMarket";

interface IInitVoteMarketContext extends InitVoteMarketArgs {
  setIdentifierText: (text: string) => void;
  setKeyword: (keyword: string) => void;
  setNumberOfParticipants: (participants: number) => void;
  // setRebalancingCost: (cost: number) => void;
  setMaximumNumberOfRepresentatives: (representatives: number) => void;
  setNumberOfDays: (days: number) => void;
  setMinimumContributionRequiredFromParticipant: (contribution: number) => void;
  // setParticipantPresentationText: (text: string) => void;
}

const initVoteMarketContextDefaults: IInitVoteMarketContext = {
  identifierText: "",
  keyword: "secret",
  numberOfParticipants: 5,
  // rebalancingCost: 0.01,
  maximumNumberOfRepresentatives: 2,
  numberOfDays: 1,
  minimumContributionRequiredFromParticipant: 0.1,
  // participantPresentationText: "Some participant presentation text",
  setIdentifierText: (text: string) => {
    console.log(text);
    return;
  },
  setKeyword: (keyword: string) => {
    console.log(keyword);
    return;
  },
  setNumberOfParticipants: (participants: number) => {
    console.log(participants);
    return;
  },
  // setRebalancingCost: (cost: number) => {
  //   console.log(cost);
  //   return;
  // },
  setMaximumNumberOfRepresentatives: (representatives: number) => {
    console.log(representatives);
    return;
  },
  setNumberOfDays: (days: number) => {
    console.log(days);
    return;
  },
  setMinimumContributionRequiredFromParticipant: (contribution: number) => {
    console.log(contribution);
    return;
  },
  // setParticipantPresentationText: (text: string) => {
  //   console.log(text);
  //   return;
  // },
};

export const InitVoteMarketContext = createContext<IInitVoteMarketContext>(initVoteMarketContextDefaults);

export const InitVoteMarketContextProvider: FC = ({ children }) => {
  const [identifierText, setIdentifierText] = useState("Some identifier text");
  const [keyword, setKeyword] = useState("secret");
  const [numberOfParticipants, setNumberOfParticipants] = useState(10);
  // const [rebalancingCost, setRebalancingCost] = useState(0.01);
  const [maximumNumberOfRepresentatives, setMaximumNumberOfRepresentatives] = useState(2);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [minimumContributionRequiredFromParticipant, setMinimumContributionRequiredFromParticipant] = useState(0.1);
  // const [participantPresentationText, setParticipantPresentationText] = useState("Some participant presentation text");

  return (
    <InitVoteMarketContext.Provider
      value={{
        identifierText,
        keyword,
        numberOfParticipants,
        // rebalancingCost,
        maximumNumberOfRepresentatives,
        numberOfDays,
        minimumContributionRequiredFromParticipant,
        // participantPresentationText,
        setIdentifierText,
        setKeyword,
        setNumberOfParticipants,
        // setRebalancingCost,
        setMaximumNumberOfRepresentatives,
        setNumberOfDays,
        setMinimumContributionRequiredFromParticipant,
        // setParticipantPresentationText,
      }}
    >
      {children}
    </InitVoteMarketContext.Provider>
  );
};
