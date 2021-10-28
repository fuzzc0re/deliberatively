import { FC, createContext, useState, useEffect, useCallback } from "react";

import { useStorageState } from "../hooks/useStorageState";

interface IVoteMarketFormContextValue {
  numberOfParticipants: number;
  maximumNumberOfRepresentatives: number;
  numberOfDays: number;
  minimumContributionRequiredFromParticipant: number;
  identifierText: string;
  keyword: string;
  participantPresentationText: string;
  setNumberOfParticipants: (valueToSet: number) => void;
  setMaximumNumberOfRepresentatives: (valueToSet: number) => void;
  setNumberOfDays: (valueToSet: number) => void;
  setMinimumContributionRequiredFromParticipant: (valueToSet: number) => void;
  setIdentifierText: (valueToSet: string) => void;
  setKeyword: (valueToSet: string) => void;
  setParticipantPresentationText: (valueToSet: string) => void;
}

const voteMarketFormContextDefaultValue: IVoteMarketFormContextValue = {
  numberOfParticipants: 10,
  maximumNumberOfRepresentatives: 2,
  numberOfDays: 1,
  minimumContributionRequiredFromParticipant: 0,
  identifierText: "",
  keyword: "",
  participantPresentationText: "",
  setNumberOfParticipants: (valuetoset: number) => {
    console.log(valuetoset);
    return;
  },
  setMaximumNumberOfRepresentatives: (valuetoset: number) => {
    console.log(valuetoset);
    return;
  },
  setNumberOfDays: (valuetoset: number) => {
    console.log(valuetoset);
    return;
  },
  setMinimumContributionRequiredFromParticipant: (valuetoset: number) => {
    console.log(valuetoset);
    return;
  },
  setIdentifierText: (valuetoset: string) => {
    console.log(valuetoset);
    return;
  },
  setKeyword: (valuetoset: string) => {
    console.log(valuetoset);
    return;
  },
  setParticipantPresentationText: (valuetoset: string) => {
    console.log(valuetoset);
    return;
  },
};

export const VoteMarketFormContext = createContext<IVoteMarketFormContextValue>(voteMarketFormContextDefaultValue);

export const VoteMarketFormContextProvider: FC = ({ children }) => {
  const [storageNumberOfParticipants, setStorageNumberOfParticipants] = useStorageState(
    "vote_market_form_number_of_participants",
    10
  );
  const [storageMaximumNumberOfRepresentatives, setStorageMaximumNumberOfRepresentatives] = useStorageState(
    "vote_market_form_maximum_number_of_representatives",
    2
  );
  const [storageNumberOfDays, setStorageNumberOfDays] = useStorageState("vote_market_form_number_of_days", 1);
  const [storageMinimumContributionRequiredFromParticipant, setStorageMinimumContributionRequiredFromParticipant] =
    useStorageState("vote_market_form_minimum_contribution_required_from_participant", 0);
  const [storageIdentifierText, setStorageIdentifierText] = useStorageState("vote_market_form_identifier_text", "");
  const [storageKeyword, setStorageKeyword] = useStorageState("vote_market_form_keyword", "");
  const [storageParticipantPresentationText, setStorageParticipantPresentationText] = useStorageState(
    "vote_market_form_participant_presentation_text",
    ""
  );

  const [numberOfParticipants, setNumberOfParticipants] = useState(storageNumberOfParticipants);
  const [maximumNumberOfRepresentatives, setMaximumNumberOfRepresentatives] = useState(
    storageMaximumNumberOfRepresentatives
  );
  const [numberOfDays, setNumberOfDays] = useState(storageNumberOfDays);
  const [minimumContributionRequiredFromParticipant, setMinimumContributionRequiredFromParticipant] = useState(
    storageMinimumContributionRequiredFromParticipant
  );
  const [identifierText, setIdentifierText] = useState(storageIdentifierText);
  const [keyword, setKeyword] = useState(storageKeyword);
  const [participantPresentationText, setParticipantPresentationText] = useState(storageParticipantPresentationText);

  const handleNumberOfParticipantsChange = useCallback(
    (valueToSet: number) => {
      setNumberOfParticipants(valueToSet);
    },
    [setNumberOfParticipants]
  );

  const handleMaximumNumberOfRepresentativesChange = useCallback(
    (valueToSet: number) => {
      setMaximumNumberOfRepresentatives(valueToSet);
    },
    [setMaximumNumberOfRepresentatives]
  );

  const handleNumberOfDaysChange = useCallback(
    (valueToSet: number) => {
      setNumberOfDays(valueToSet);
    },
    [setNumberOfDays]
  );

  const handleMinimumContributionRequiredFromParticipantChange = useCallback(
    (valueToSet: number) => {
      setMinimumContributionRequiredFromParticipant(valueToSet);
    },
    [setMinimumContributionRequiredFromParticipant]
  );

  const handleIdentifierTextChange = useCallback(
    (valueToSet: string) => {
      setIdentifierText(valueToSet);
    },
    [setIdentifierText]
  );

  const handleKeywordChange = useCallback(
    (valueToSet: string) => {
      setKeyword(valueToSet);
    },
    [setKeyword]
  );

  const handleParticipantPresentationTextChange = useCallback(
    (valueToSet: string) => {
      setParticipantPresentationText(valueToSet);
    },
    [setParticipantPresentationText]
  );

  useEffect(() => {
    setStorageNumberOfParticipants(numberOfParticipants);
  }, [numberOfParticipants]);

  useEffect(() => {
    setStorageMaximumNumberOfRepresentatives(maximumNumberOfRepresentatives);
  }, [maximumNumberOfRepresentatives]);

  useEffect(() => {
    setStorageNumberOfDays(numberOfDays);
  }, [numberOfDays]);

  useEffect(() => {
    setStorageMinimumContributionRequiredFromParticipant(minimumContributionRequiredFromParticipant);
  }, [minimumContributionRequiredFromParticipant]);

  useEffect(() => {
    setStorageIdentifierText(identifierText);
  }, [identifierText]);

  useEffect(() => {
    setStorageKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    setStorageParticipantPresentationText(participantPresentationText);
  }, [participantPresentationText]);

  return (
    <VoteMarketFormContext.Provider
      value={{
        numberOfParticipants,
        maximumNumberOfRepresentatives,
        numberOfDays,
        minimumContributionRequiredFromParticipant,
        identifierText,
        keyword,
        participantPresentationText,
        setNumberOfParticipants: handleNumberOfParticipantsChange,
        setMaximumNumberOfRepresentatives: handleMaximumNumberOfRepresentativesChange,
        setNumberOfDays: handleNumberOfDaysChange,
        setMinimumContributionRequiredFromParticipant: handleMinimumContributionRequiredFromParticipantChange,
        setIdentifierText: handleIdentifierTextChange,
        setKeyword: handleKeywordChange,
        setParticipantPresentationText: handleParticipantPresentationTextChange,
      }}
    >
      {children}
    </VoteMarketFormContext.Provider>
  );
};
