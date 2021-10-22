import { FC, useState, useCallback, useMemo, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

import { MAX_IDENTIFIER_TEXT_LEN } from "../../contract/constants";

export const TextFieldMarketIdentifierText: FC = () => {
  const { setIdentifierText } = useInitVoteMarketContext();
  const [text, setText] = useState("");
  const [hasError, setHasError] = useState(false);

  const toggleError = useCallback(() => {
    setHasError(!hasError);
  }, [hasError, setHasError]);

  // const pbkdf = (keyword: string) => {
  //   return crypto.subtle.importKey("raw", keyword, "PBKDF2", false, ["deriveKey"]);
  // };

  const checkIdentifierText = useCallback(
    (text: string) => {
      const count = text.length;
      if (count < 8 || count > MAX_IDENTIFIER_TEXT_LEN) {
        if (!hasError) {
          throw new Error("Bad vote market identifier text");
        }
      } else if (hasError) {
        toggleError();
      }
    },
    [hasError]
  );

  const handleIdentifierTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e && e.target && e.target.value) {
        try {
          checkIdentifierText(e.target.value);
          setText(e.target.value);
          setIdentifierText(e.target.value);
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
    [setText, setIdentifierText, hasError]
  );

  const helperText = useMemo(() => {
    if (hasError) {
      return `Needs to be between 8 and ${MAX_IDENTIFIER_TEXT_LEN} characters.`;
    } else {
      if (text.length > 8) {
        return `Remaining characters: ${text.length}/${MAX_IDENTIFIER_TEXT_LEN}.`;
      } else {
        return "Everyone who has the vote market address will be able to see this.";
      }
    }
  }, [hasError, text]);

  return (
    <StyledTextField
      variant="outlined"
      focused
      color="secondary"
      fullWidth
      id="identifier_text_textfield"
      type="string"
      label="Vote market title"
      error={hasError}
      InputLabelProps={{
        shrink: true,
      }}
      helperText={helperText}
      value={text}
      onChange={handleIdentifierTextChange}
    />
  );
};
