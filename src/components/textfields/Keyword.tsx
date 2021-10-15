import { FC, useState, useMemo, ChangeEvent } from "react";

import { StyledTextField } from "../styled/TextField";

// import { useInitVoteMarketContext } from "../../hooks/useInitVoteMarketContext";

export const TextFieldKeyword: FC = () => {
  // const { setKeyword } = useInitVoteMarketContext();
  const [secretKeyword, setSecretKeyword] = useState("");
  const [hasError, setHasError] = useState(false);

  const toggleError = () => {
    setHasError(!hasError);
  };

  // const pbkdf = (keyword: string) => {
  //   return crypto.subtle.importKey("raw", keyword, "PBKDF2", false, ["deriveKey"]);
  // };

  const checkKeyword = (keyword: string) => {
    const keywordCount = keyword.length;
    if (keywordCount < 8 || keywordCount > 36) {
      if (!hasError) {
        throw new Error("Bad keyword");
      }
    } else if (hasError) {
      toggleError();
    }
  };

  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.value) {
      try {
        checkKeyword(e.target.value);
        setSecretKeyword(e.target.value);
        // setKeyword(e.target.value);
      } catch {
        if (!hasError) {
          toggleError();
        }
      }
    } else {
      setSecretKeyword("");
      if (hasError) {
        toggleError();
      }
    }
  };

  const helperText = useMemo(() => {
    if (hasError) {
      return "Needs to be between 8 and 128 characters";
    } else {
      return "Voters can use this to receive vote tokens";
    }
  }, [hasError]);

  return (
    <StyledTextField
      variant="filled"
      id="keyword_textfield"
      type="string"
      label="Keyword"
      error={hasError}
      InputLabelProps={{
        shrink: true,
      }}
      size="small"
      helperText={helperText}
      value={secretKeyword}
      onChange={handleKeywordChange}
    />
  );
};
