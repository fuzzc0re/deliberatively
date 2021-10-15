import { FC, useState, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

export const TextFieldParticipants: FC = () => {
  const { setNumberOfParticipants } = useInitVoteMarketContext();
  const [noOfParticipants, setNoOfParticipants] = useState(5);
  const handleNoOfParticipantsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      let number: number;
      const input = e.target.value.replace(/\D/g, "");
      if (input === "") {
        number = 5;
      }
      number = Number(input);
      if (number < 5) {
        number = 5;
      } else if (number <= 10000000000) {
        number = Math.round(number);
      } else {
        number = 10000000000;
      }
      setNoOfParticipants(number);
      setNumberOfParticipants(number);
    }
  };

  return (
    <StyledTextField
      variant="outlined"
      id="no_of_participants_textfield"
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label="Participants"
      InputLabelProps={{
        shrink: true,
      }}
      // size="small"
      helperText="Equals to maximum issued tokens"
      InputProps={{ inputProps: { min: 5, max: 10000000000 } }}
      value={noOfParticipants}
      onChange={handleNoOfParticipantsChange}
    />
  );
};
