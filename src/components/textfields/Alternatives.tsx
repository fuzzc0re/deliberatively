import { FC, useState, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

export const TextFieldAlternatives: FC = () => {
  const [noOfAlternatives, setNoOfAlternatives] = useState(2);
  const handleNoOfAlternativesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      let number: number;
      const input = e.target.value.replace(/\D/g, "");
      if (input === "") {
        number = 2;
      }
      number = Number(input);
      if (number < 2) {
        number = 2;
      } else if (number <= 100) {
        number = Math.round(number);
      } else {
        number = 100;
      }
      setNoOfAlternatives(number);
    }
  };

  return (
    <StyledTextField
      variant="filled"
      id="no_of_alternatives_textfield"
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label="Alternatives"
      InputLabelProps={{
        shrink: true,
      }}
      size="small"
      helperText="Choices of voters"
      InputProps={{ inputProps: { min: 2, max: 100 } }}
      value={noOfAlternatives}
      onChange={handleNoOfAlternativesChange}
    />
  );
};
