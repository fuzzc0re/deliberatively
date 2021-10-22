import { FC, useState, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

export const TextFieldNumberOfDays: FC = () => {
  const { setNumberOfDays } = useInitVoteMarketContext();
  const [noOfDays, setNoOfDays] = useState(1);
  const handleNoOfDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      let number: number;
      const input = e.target.value.replace(/\D/g, "");
      if (input === "") {
        number = 1;
      }
      number = Number(input);
      if (number < 1) {
        number = 1;
      } else if (number <= 10000) {
        number = Math.round(number);
      } else {
        number = 10000;
      }
      setNoOfDays(number);
      setNumberOfDays(number);
    }
  };

  return (
    <StyledTextField
      variant="outlined"
      focused
      fullWidth
      color="secondary"
      id="no_of_days_textfield"
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label="Number of days"
      InputLabelProps={{
        shrink: true,
      }}
      helperText="Representatives can start proposing alternatives after this has elapsed."
      InputProps={{ inputProps: { min: 1, max: 10000 } }}
      value={noOfDays}
      onChange={handleNoOfDaysChange}
    />
  );
};
