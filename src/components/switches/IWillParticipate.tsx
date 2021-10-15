import { FC, useState } from "react";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";
// import { styled, alpha } from "@mui/material/styles";

export const IWillParticipateSwitch: FC = () => {
  const [participating, setParticipating] = useState(true);
  const handleParticipationChange = () => {
    setParticipating(!participating);
  };

  return (
    <FormGroup>
      <FormControlLabel
        label="I will be participating"
        control={
          <Switch
            checked={participating}
            onChange={handleParticipationChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />
    </FormGroup>
  );
};
