'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

export const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'md',
  label,
  labelPosition = 'center',
  className,
  ...props
}: DividerProps) => {
  const thicknessClasses = {
    sm: orientation === 'horizontal' ? 'h-px' : 'w-px',
    md: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    lg: orientation === 'horizontal' ? 'h-1' : 'w-1',
  };

  const variantClasses = {
    solid: 'border-none bg-gray-200 dark:bg-gray-700',
    dashed: 'border-t-2 border-dashed border-gray-300 dark:border-gray-600',
    dotted: 'border-t-2 border-dotted border-gray-300 dark:border-gray-600',
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn(thicknessClasses[thickness], variantClasses[variant], 'h-full min-h-8')} />
      </div>
    );
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {labelPosition === 'left' && (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</span>
            <div className={cn('flex-1', thicknessClasses[thickness], variantClasses[variant])} />
          </>
        )}
        {labelPosition === 'center' && (
          <>
            <div className={cn('flex-1', thicknessClasses[thickness], variantClasses[variant])} />
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</span>
            <div className={cn('flex-1', thicknessClasses[thickness], variantClasses[variant])} />
          </>
        )}
        {labelPosition === 'right' && (
          <>
            <div className={cn('flex-1', thicknessClasses[thickness], variantClasses[variant])} />
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{label}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(thicknessClasses[thickness], variantClasses[variant])} {...props} />
    </div>
  );
};

export default Divider;