import { useEffect, useRef } from "react";

export function useThrottle<T>(value: T, delay = 300): T {
  const lastValueRef = useRef<T>(value);
  const lastUpdatedRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdatedRef.current >= delay) {
      lastValueRef.current = value;
      lastUpdatedRef.current = now;
    }
  }, [value, delay]);

  return lastValueRef.current;
}
