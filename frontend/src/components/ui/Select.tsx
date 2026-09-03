import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: string;
}

// Correction: le select prend en charge les options et les props transmises par react-hook-form.
export function Select({ options = [], error: _error, ...props }: SelectProps) {
  return (
    <select {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
