import { FC } from "react";

import { StyledCheckedTextField } from "../styled/TextField";

import { MAX_KEYWORD_LEN } from "../../contract/constants";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

export const TextFieldKeyword: FC = () => {
  const { keyword, setKeyword } = useVoteMarketFormContext();

  return (
    <StyledCheckedTextField
      title="Participation keyword"
      defaultHelperText="Participants need to provide this in order to receive 1 vote."
      MIN_TEXT_LEN={8}
      MAX_TEXT_LEN={MAX_KEYWORD_LEN}
      contextDefaultText={keyword}
      setContextText={setKeyword}
    />
  );
};
