import type { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
}

// Correction: la case à cocher accepte désormais id, label, required et l'enregistrement du formulaire.
export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label>
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}

export default Checkbox;
