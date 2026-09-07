'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
        secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        outline: 'border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300',
        dot: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] gap-0.5',
        md: 'px-2.5 py-0.5 text-xs gap-1',
        lg: 'px-3 py-1 text-sm gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  count?: number;
  maxCount?: number;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, removable, onRemove, count, maxCount = 99, children, ...props }, ref) => {
    const displayCount = count !== undefined ? (count > maxCount ? `${maxCount}+` : count) : undefined;

    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props}>
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
        {displayCount !== undefined ? displayCount : children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-0.5 rounded-full hover:bg-gray-200/50 p-0.5 transition-colors"
            aria-label="Supprimer"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { badgeVariants };
export default Badge;