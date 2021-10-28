import { FC } from "react";

import { StyledCheckedNumberField } from "../styled/TextField";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

export const TextFieldMaximumNumberOfRepresentatives: FC = () => {
  const { numberOfParticipants, maximumNumberOfRepresentatives, setMaximumNumberOfRepresentatives } =
    useVoteMarketFormContext();

  return (
    <StyledCheckedNumberField
      title="Maximum representatives"
      defaultHelperText="Representatives need to have more than 1 vote. Maximum value is 20% of participants."
      MIN={2}
      MAX={Math.round(numberOfParticipants / 5)}
      contextDefaultNumber={maximumNumberOfRepresentatives}
      setContextNumber={setMaximumNumberOfRepresentatives}
    />
  );
};
