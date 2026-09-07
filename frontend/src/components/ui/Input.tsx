'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      helper,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      containerClassName,
      labelClassName,
      type = 'text',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const hasError = !!error;
    const hasSuccess = !!success;

    const inputClasses = cn(
      'w-full rounded-lg border transition-colors duration-200 bg-white dark:bg-gray-900',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2',
      hasError
        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
        : hasSuccess
        ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
        : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500/20 focus:border-primary-500',
      leftIcon ? 'pl-10' : 'pl-4',
      (rightIcon || showPasswordToggle) ? 'pr-10' : 'pr-4',
      disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
      'h-10 text-sm',
      className
    );

    const inputElement = (
      <input
        id={inputId}
        ref={ref}
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        className={inputClasses}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${inputId}-error` : hasSuccess ? `${inputId}-success` : helper ? `${inputId}-helper` : undefined
        }
        {...props}
      />
    );

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700 dark:text-gray-300',
              disabled && 'opacity-50',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          {inputElement}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {hasError && (
          <p id={`${inputId}-error`} className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
        {hasSuccess && !hasError && (
          <p id={`${inputId}-success`} className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle className="h-3.5 w-3.5" />
            {success}
          </p>
        )}
        {helper && !hasError && !hasSuccess && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;