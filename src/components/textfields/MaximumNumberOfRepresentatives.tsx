import { FC, useState, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

export const TextFieldMaximumNumberOfRepresentatives: FC = () => {
  const { numberOfParticipants, setMaximumNumberOfRepresentatives } = useInitVoteMarketContext();
  const [noOfRepresentatives, setNoOfRepresentatives] = useState(2);
  const handleNoOfRepresentativesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      let number: number;
      const input = e.target.value.replace(/\D/g, "");
      if (input === "") {
        number = 2;
      }
      number = Number(input);
      if (number < 2) {
        number = 2;
      } else if (number > numberOfParticipants) {
        number = Math.round(numberOfParticipants / 5);
      }
      setNoOfRepresentatives(number);
      setMaximumNumberOfRepresentatives(number);
    }
  };

  return (
    <StyledTextField
      variant="outlined"
      id="no_of_representatives_textfield"
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label="Maximum number of representatives"
      InputLabelProps={{
        shrink: true,
      }}
      helperText="Representatives need to have at least power > 1"
      InputProps={{ inputProps: { min: 2, max: Math.round(numberOfParticipants / 5) } }}
      value={noOfRepresentatives}
      onChange={handleNoOfRepresentativesChange}
    />
  );
};