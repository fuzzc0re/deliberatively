import { createLocalStorageStateHook } from "use-local-storage-state";

export const useMaximumNumberOfParticipants = createLocalStorageStateHook<number>("maximum_number_of_participants", 10);
export const useMaximumNumberOfRepresentatives = createLocalStorageStateHook<number>(
  "maximum_number_of_representatives",
  2
);
export const useNumberOfDays = createLocalStorageStateHook<number>("number_of_days", 1);
export const useMinimumContributionRequiredFromParticipant = createLocalStorageStateHook<number>(
  "minimum_contribution_required_from_participant",
  0
);

export const useVoteMarketIdentifierText = createLocalStorageStateHook<string>("vote_market_identifier_text", "");
export const useKeyword = createLocalStorageStateHook<string>("vote_market_keyword", "");
export const useParticipantPresentationText = createLocalStorageStateHook<string>(
  "vote_market_participant_presentation_text",
  ""
);
