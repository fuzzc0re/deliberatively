import { FC } from "react";

import { StyledCheckedNumberField } from "../styled/TextField";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

export const TextFieldNumberOfDays: FC = () => {
  const { numberOfDays, setNumberOfDays } = useVoteMarketFormContext();

  return (
    <StyledCheckedNumberField
      title="Market days"
      defaultHelperText="When they elapse, representatives will be able to propose alternatives."
      MIN={1} // one day
      MAX={10000} // 10000 days
      contextDefaultNumber={numberOfDays}
      setContextNumber={setNumberOfDays}
    />
  );
};
