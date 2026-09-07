'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  labelFormat?: (value: number, max: number) => string;
  animated?: boolean;
}

const variants = {
  default: 'bg-primary-600',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const Progress = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelPosition = 'outside',
  labelFormat = (v, m) => `${Math.round((v / m) * 100)}%`,
  animated = true,
  className,
  ...props
}: ProgressProps) => {
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = (clampedValue / max) * 100;

  const label = labelFormat(clampedValue, max);

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="relative flex items-center">
        {labelPosition === 'outside' && showLabel && (
          <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        )}
        <div className="relative flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={cn(
              'rounded-full transition-all duration-500 ease-out',
              variants[variant],
              sizes[size],
              animated && 'transition-all duration-500 ease-out'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={max}
          />
          {labelPosition === 'inside' && showLabel && (
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center text-xs font-medium text-white',
                size === 'lg' ? 'text-sm' : 'text-xs'
              )}
            >
              {label}
            </span>
          )}
        </div>
        {labelPosition === 'outside' && showLabel && (
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        )}
      </div>
    </div>
  );
};

export default Progress;