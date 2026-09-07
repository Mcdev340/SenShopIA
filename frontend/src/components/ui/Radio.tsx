"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: React.ReactNode;
  error?: boolean;
  success?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      success,
      indeterminate,
      disabled,
      checked,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    const handleRef = (el: HTMLInputElement) => {
      inputRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    const checkboxClasses = cn(
      "h-4 w-4 rounded border-2 transition-colors flex items-center justify-center",
      disabled && "opacity-50 cursor-not-allowed",
      error && "border-red-500 focus:ring-red-500",
      success && "border-green-500 focus:ring-green-500",
      !error &&
        !success &&
        "border-gray-300 dark:border-gray-600 focus:ring-primary-500",
      checked || indeterminate
        ? "bg-primary-600 border-primary-600"
        : "bg-white dark:bg-gray-900",
    );

    return (
      <label
        className={cn(
          "flex items-center gap-2 cursor-pointer",
          disabled && "cursor-not-allowed",
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            ref={handleRef}
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div className={checkboxClasses}>
            {indeterminate ? (
              <div className="h-0.5 w-2.5 bg-white" />
            ) : checked ? (
              <Check className="h-3 w-3 text-white" />
            ) : null}
          </div>
        </div>
        {label && (
          <span
            className={cn(
              "text-sm",
              disabled && "opacity-50",
              error && "text-red-500",
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
