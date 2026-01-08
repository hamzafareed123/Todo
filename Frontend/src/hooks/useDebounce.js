import { useRef, useCallback, useEffect } from "react";

export const useDebounce = (callback, delay = 400) => {
  const timeout = useRef(null);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  return useCallback(
    (...args) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      

      timeout.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
