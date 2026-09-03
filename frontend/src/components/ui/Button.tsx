import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
}

// Correction: le bouton accepte maintenant les props utilisées par les formulaires d'authentification.
export function Button({
  children,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${size} ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
