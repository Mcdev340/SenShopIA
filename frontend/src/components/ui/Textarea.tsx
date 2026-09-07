'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  containerClassName?: string;
  labelClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      success,
      helper,
      containerClassName,
      labelClassName,
      id,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium text-gray-700 dark:text-gray-300',
              disabled && 'opacity-50',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg border transition-colors duration-200 bg-white dark:bg-gray-900',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2',
            hasError
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : hasSuccess
              ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
              : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500/20 focus:border-primary-500',
            'px-3 py-2 text-sm',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : hasSuccess ? `${textareaId}-success` : helper ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {hasError && (
          <p id={`${textareaId}-error`} className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
        {hasSuccess && !hasError && (
          <p id={`${textareaId}-success`} className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle className="h-3.5 w-3.5" />
            {success}
          </p>
        )}
        {helper && !hasError && !hasSuccess && (
          <p id={`${textareaId}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;