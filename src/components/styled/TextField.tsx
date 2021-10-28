import { FC, useState, useEffect, useCallback, useMemo, ChangeEvent } from "react";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

import { uuidv4 } from "../../utils/functions";

export const StyledTextField = styled(TextField)(() => ({
  userSelect: "none",
  // padding: theme.spacing(3),
}));

interface StyledCheckedTextFieldProps {
  title: string;
  defaultHelperText: string;
  MIN_TEXT_LEN: number;
  MAX_TEXT_LEN: number;
  contextDefaultText: string;
  setContextText: (valueToSet: string) => void;
}

export const StyledCheckedTextField: FC<StyledCheckedTextFieldProps> = ({
  title,
  defaultHelperText,
  MIN_TEXT_LEN,
  MAX_TEXT_LEN,
  contextDefaultText,
  setContextText,
}) => {
  const [text, setText] = useState(contextDefaultText);
  const [hasError, setHasError] = useState(false);
  const [helperText, setHelperText] = useState(defaultHelperText);

  const uuid = useMemo(() => {
    return uuidv4();
  }, []);

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      setContextText(e.target.value);
    },
    [setText, setContextText]
  );

  useEffect(() => {
    const len = text.length;
    if (len === 0) {
      setHasError(false);
      setHelperText(defaultHelperText);
    } else if (len < MIN_TEXT_LEN) {
      setHasError(true);
      setHelperText(`Must be more than ${MIN_TEXT_LEN} characters long. Current count: ${len}.`);
    } else if (len > MAX_TEXT_LEN) {
      setHasError(true);
      setHelperText(`Must be less than ${MAX_TEXT_LEN} characters long. Current count: ${len}`);
    } else {
      setHasError(false);
      setHelperText(`Remaining characters: ${len}/${MAX_TEXT_LEN}.`);
    }
  }, [text, setHasError, setHelperText]);

  return (
    <StyledTextField
      variant="outlined"
      focused
      color="secondary"
      fullWidth
      maxRows={2}
      minRows={2}
      multiline
      id={`${uuid}_textfield`}
      type="string"
      label={title}
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

interface StyledCheckedNumberFieldProps {
  title: string;
  defaultHelperText: string;
  MIN: number;
  MAX: number;
  contextDefaultNumber: number;
  setContextNumber: (valuetoSet: number) => void;
}

export const StyledCheckedNumberField: FC<StyledCheckedNumberFieldProps> = ({
  title,
  defaultHelperText,
  MIN,
  MAX,
  contextDefaultNumber,
  setContextNumber,
}) => {
  const [num, setNum] = useState(contextDefaultNumber);
  const [hasError, setHasError] = useState(false);
  const [helperText, setHelperText] = useState(defaultHelperText);

  const uuid = useMemo(() => {
    return uuidv4();
  }, []);

  const handleNumChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e && e.target) {
        try {
          let number: number;
          const input = e.target.value.replace(/\D/g, "");
          if (input === "") {
            number = MIN;
          }
          number = Number(input);
          if (number < MIN) {
            number = MIN;
          } else if (number > MAX) {
            setHasError(true);
            // number = Math.round(numberOfParticipants / 5);
          }
          setNum(number);
          setContextNumber(number);
        } catch {
          setHasError(true);
          setHelperText("An unexpected error occured in the number field.");
        }
      }
    },
    [setNum, setHasError, setHelperText, setContextNumber]
  );

  useEffect(() => {
    if (num === MIN) {
      setHasError(false);
      setHelperText(defaultHelperText);
    } else if (num < MIN) {
      setHasError(true);
      setHelperText(`Must be set to more than ${MIN}.`);
    } else if (num > MAX) {
      setHasError(true);
      setHelperText(`Must be set to less than ${MAX}.`);
    } else {
      setHasError(false);
      setHelperText(`Maximum limit is ${MAX}.`);
    }
  }, [num, setHasError, setHelperText]);

  return (
    <StyledTextField
      variant="outlined"
      focused
      fullWidth
      // minRows={2}
      // maxRows={2}
      // multiline
      color="secondary"
      id={`${uuid}_textfield`}
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      label={title}
      InputLabelProps={{
        shrink: true,
      }}
      error={hasError}
      helperText={helperText}
      InputProps={{ inputProps: { min: MIN } }}
      value={num}
      onChange={handleNumChange}
    />
  );
};
