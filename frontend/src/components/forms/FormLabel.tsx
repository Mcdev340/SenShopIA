"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "./FormField";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Est requis */
  required?: boolean;
  /** Est désactivé */
  disabled?: boolean;
  /** Taille du label */
  size?: "sm" | "md" | "lg" | "xl";
  /** Poids de la police */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Couleur */
  color?: "default" | "muted" | "error" | "success" | "primary";
  /** Classe supplémentaire */
  className?: string;
  /** Enfants */
  children: React.ReactNode;
}

export default function FormLabel({
  required: requiredProp,
  disabled: disabledProp,
  size = "md",
  weight = "medium",
  color = "default",
  className = "",
  children,
  ...props
}: FormLabelProps) {
  const context = useFormField();

  const required = requiredProp ?? context.required ?? false;
  const disabled = disabledProp ?? context.disabled ?? false;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorClasses = {
    default: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-500 dark:text-gray-400",
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
    primary: "text-primary-600 dark:text-primary-400",
  };

  return (
    <label
      className={cn(
        "block transition-colors duration-200",
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-0.5 text-red-500 dark:text-red-400"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  );
}
