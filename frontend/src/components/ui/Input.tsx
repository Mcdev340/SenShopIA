import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// Correction: l'input expose les attributs natifs et la prop error attendue par react-hook-form.
export function Input({ error: _error, ...props }: InputProps) {
  return <input {...props} />;
}

export default Input;
