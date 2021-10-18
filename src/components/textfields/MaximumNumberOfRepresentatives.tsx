import { FC, useState, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

export const TextFieldMaximumNumberOfRepresentatives: FC = () => {
  const { numberOfParticipants, setMaximumNumberOfRepresentatives } = useInitVoteMarketContext();
  const [noOfRepresentatives, setNoOfRepresentatives] = useState(2);
  const [hasError, setHasError] = useState(false);
  const handleNoOfRepresentativesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      let number: number;
      const input = e.target.value.replace(/\D/g, "");
      if (hasError) {
        setHasError(false);
      }
      if (input === "") {
        number = 2;
      }
      number = Number(input);
      if (number < 2) {
        number = 2;
      } else if (number > numberOfParticipants / 5) {
        setHasError(true);
        // number = Math.round(numberOfParticipants / 5);
      }
      setNoOfRepresentatives(number);
      setMaximumNumberOfRepresentatives(number);
    }
  };

  return (
    <StyledTextField
      variant="outlined"
      focused
      color="secondary"
      id="no_of_representatives_textfield"
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label="Maximum number of representatives"
      InputLabelProps={{
        shrink: true,
      }}
      error={hasError}
      helperText={
        hasError
          ? "Representatives can be at most a 5th of participants."
          : "Representatives need to have at least more than 1 tokens"
      }
      InputProps={{ inputProps: { min: 2 } }}
      value={noOfRepresentatives}
      onChange={handleNoOfRepresentativesChange}
    />
  );
};
