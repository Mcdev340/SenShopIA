'use client';

import React from 'react';
import { ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      success,
      helper,
      options,
      placeholder,
      size = 'md',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;

    const sizes = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-lg border pr-10 transition-colors duration-200 bg-white dark:bg-gray-900',
              'focus:outline-none focus:ring-2',
              hasError
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : hasSuccess
                ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
                : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500/20 focus:border-primary-500',
              sizes[size],
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        {hasError && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
        {hasSuccess && !hasError && (
          <p className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle className="h-3.5 w-3.5" />
            {success}
          </p>
        )}
        {helper && !hasError && !hasSuccess && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;