import { FC } from "react";

import { StyledCheckedNumberField } from "../styled/TextField";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

export const TextFieldParticipants: FC = () => {
  const { numberOfParticipants, setNumberOfParticipants } = useVoteMarketFormContext();

  return (
    <StyledCheckedNumberField
      title="Maximum participants"
      defaultHelperText="Equals to the maximum number of mintable votes."
      MIN={10}
      MAX={1000000000} // one billion
      contextDefaultNumber={numberOfParticipants}
      setContextNumber={setNumberOfParticipants}
    />
  );
};
