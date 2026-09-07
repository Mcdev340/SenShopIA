'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'success' | 'danger' | 'warning';
  variant?: 'default' | 'dots' | 'pulse';
  text?: string;
}

const sizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colors = {
  primary: 'text-primary-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  gray: 'text-gray-400',
  success: 'text-green-500',
  danger: 'text-red-500',
  warning: 'text-yellow-500',
};

export const Spinner = ({
  size = 'md',
  color = 'primary',
  variant = 'default',
  text,
  className,
  ...props
}: SpinnerProps) => {
  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1', className)} {...props}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-bounce',
              sizes[size],
              colors[color]
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
        {text && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center gap-3', className)} {...props}>
        <div className={cn('relative', sizes[size])}>
          <div className={cn('absolute inset-0 rounded-full animate-ping', colors[color], 'opacity-75')} />
          <div className={cn('relative rounded-full', colors[color], 'bg-current', sizes[size])} />
        </div>
        {text && <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <Loader2 className={cn('animate-spin', sizes[size], colors[color])} />
      {text && <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>}
    </div>
  );
};

export default Spinner;