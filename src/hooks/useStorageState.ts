//
// Copyright (c) 2021 Fuzznets. All rights reserved.
//

import { useState, useEffect, useCallback } from "react";

export const useStorageState = <T>(key: string, defaultValue: T): [T, (valueToSet: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.log(err);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
      } catch (err) {
        console.log(err);
      }
    },
    [setStoredValue]
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [storedValue]);

  return [storedValue, setValue];
};
