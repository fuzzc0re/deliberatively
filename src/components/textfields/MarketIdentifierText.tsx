import { FC } from "react";

import { StyledCheckedTextField } from "../styled/TextField";

import { MAX_IDENTIFIER_TEXT_LEN } from "../../contract/constants";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

export const TextFieldMarketIdentifierText: FC = () => {
  const { identifierText, setIdentifierText } = useVoteMarketFormContext();

  return (
    <StyledCheckedTextField
      title="Vote market title"
      defaultHelperText="Anyone with the vote market address will be able to see this."
      MIN_TEXT_LEN={8}
      MAX_TEXT_LEN={MAX_IDENTIFIER_TEXT_LEN}
      contextDefaultText={identifierText}
      setContextText={setIdentifierText}
    />
  );
};
