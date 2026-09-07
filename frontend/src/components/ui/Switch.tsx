'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

export const Switch = ({
  className,
  checked = false,
  onCheckedChange,
  label,
  size = 'md',
  error,
  disabled,
  ...props
}: SwitchProps) => {
  const sizes = {
    sm: {
      container: 'h-5 w-9',
      thumb: 'h-3 w-3',
      translate: 'translate-x-4',
    },
    md: {
      container: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: 'translate-x-5',
    },
    lg: {
      container: 'h-7 w-13',
      thumb: 'h-5 w-5',
      translate: 'translate-x-6',
    },
  };

  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', disabled && 'cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full transition-colors',
          sizes[size].container,
          checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600',
          error && 'border-2 border-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none inline-block transform rounded-full bg-white shadow-lg transition-transform',
            sizes[size].thumb,
            checked ? sizes[size].translate : 'translate-x-0.5'
          )}
        />
      </button>
      {label && (
        <span className={cn('text-sm', disabled && 'opacity-50', error && 'text-red-500')}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;