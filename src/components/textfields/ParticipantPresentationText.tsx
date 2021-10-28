import { FC } from "react";

import { StyledCheckedTextField } from "../styled/TextField";

import { MAX_PRESENTATION_TEXT_LEN } from "../../contract/constants";

import { useVoteMarketFormContext } from "../../hooks/useVoteMarketFormContext";

interface ParticipantPresentationTextProps {
  optional: boolean;
}

export const TextFieldParticipantPresentationText: FC<ParticipantPresentationTextProps> = ({ optional }) => {
  const { participantPresentationText, setParticipantPresentationText } = useVoteMarketFormContext();

  return (
    <StyledCheckedTextField
      title={optional ? "My presentation text (Optional)" : "My presentation text"}
      defaultHelperText="Visible by anyone with your vote market-derived address."
      MIN_TEXT_LEN={optional ? 0 : 8}
      MAX_TEXT_LEN={MAX_PRESENTATION_TEXT_LEN}
      contextDefaultText={participantPresentationText}
      setContextText={setParticipantPresentationText}
    />
  );
};
