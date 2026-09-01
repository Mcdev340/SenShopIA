import { useMemo, useState } from "react";

export function useValidation<T extends Record<string, any>>(
  values: T,
  validate: (values: T) => Partial<Record<keyof T, string>>,
) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => validate(values), [values, validate]);

  const setTouchedField = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [String(field)]: true }));
  };

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  return {
    errors,
    touched,
    setTouchedField,
    isValid,
  };
}
