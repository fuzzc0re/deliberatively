import { FC, useState, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

// import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

export const TextFieldRebalancingCost: FC = () => {
  // const { setRebalancingCost } = useInitVoteMarketContext();
  const [rebalanceCost, setRebalanceCost] = useState(0.01);
  const handleRebalanceCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      let number: number;
      const input = e.target.value.replace(/[^.,1-9]/g, "");
      if (input === "") {
        number = 0.01;
      }
      number = Number(input);
      if (number < 0.01) {
        number = 0.01;
      } else if (number <= 0.5) {
        number = Math.round(number * 100) / 100;
      } else {
        number = 0.5;
      }
      setRebalanceCost(number);
      // setRebalancingCost(number);
    }
  };

  return (
    <StyledTextField
      variant="filled"
      id="rebalance_cost_textfield"
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label="Rebalancing cost"
      InputLabelProps={{
        shrink: true,
      }}
      size="small"
      helperText="Incurred from voting power redistributions"
      InputProps={{ inputProps: { min: 0.01, max: 0.5, step: 0.01 } }}
      value={rebalanceCost}
      onChange={handleRebalanceCostChange}
    />
  );
};
