import { FC, useState, useCallback, useMemo, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

import { MAX_PRESENTATION_TEXT_LEN } from "../../contract/constants";

interface ParticipantPresentationTextProps {
  optional: boolean;
}

export const TextFieldParticipantPresentationText: FC<ParticipantPresentationTextProps> = ({ optional }) => {
  const { setParticipantPresentationText } = useInitVoteMarketContext();
  const [text, setText] = useState("");
  const [hasError, setHasError] = useState(false);

  const toggleError = useCallback(() => {
    setHasError(!hasError);
  }, [hasError, setHasError]);

  const checkIdentifierText = useCallback(
    (text: string) => {
      const count = text.length;
      if (count < 8 || count > MAX_PRESENTATION_TEXT_LEN) {
        if (!hasError) {
          throw new Error("Bad vote market participant presentation text");
        }
      } else if (hasError) {
        toggleError();
      }
    },
    [hasError]
  );

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e && e.target && e.target.value) {
        try {
          checkIdentifierText(e.target.value);
          setText(e.target.value);
          setParticipantPresentationText(e.target.value);
        } catch {
          if (!hasError) {
            toggleError();
          }
        }
      } else {
        setText("");
        if (hasError) {
          toggleError();
        }
      }
    },
    [setText, setParticipantPresentationText, hasError]
  );

  const helperText = useMemo(() => {
    if (hasError) {
      return `Needs to be between 8 and ${MAX_PRESENTATION_TEXT_LEN} characters.`;
    } else {
      if (text.length > 8) {
        return `Remaining characters: ${text.length}/${MAX_PRESENTATION_TEXT_LEN}.`;
      } else {
        return "Everyone with your market-derived address will be able to see this.";
      }
    }
  }, [hasError, text]);

  const labelText = useMemo(() => {
    if (optional) {
      return "Participant presentation text (Optional)";
    } else {
      return "Participant presentation text";
    }
  }, [optional]);

  return (
    <StyledTextField
      variant="outlined"
      focused
      color="secondary"
      fullWidth
      id="presentation_text_textfield"
      type="string"
      label={labelText}
      error={hasError}
      InputLabelProps={{
        shrink: true,
      }}
      helperText={helperText}
      value={text}
      onChange={handleTextChange}
    />
  );
};
