'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

const variants = {
  default: {
    bg: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    selected: 'bg-gray-200 dark:bg-gray-700',
  },
  primary: {
    bg: 'bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-900/50',
    text: 'text-primary-700 dark:text-primary-300',
    border: 'border-primary-200 dark:border-primary-800',
    selected: 'bg-primary-200 dark:bg-primary-900/50',
  },
  success: {
    bg: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    selected: 'bg-green-200 dark:bg-green-900/50',
  },
  danger: {
    bg: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    selected: 'bg-red-200 dark:bg-red-900/50',
  },
  warning: {
    bg: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    selected: 'bg-yellow-200 dark:bg-yellow-900/50',
  },
  info: {
    bg: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    selected: 'bg-blue-200 dark:bg-blue-900/50',
  },
  outline: {
    bg: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    selected: 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800',
  },
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-1.5 text-base gap-2',
};

export const Chip = ({
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  avatar,
  icon,
  clickable = false,
  selected = false,
  disabled = false,
  className,
  children,
  ...props
}: ChipProps) => {
  const config = variants[variant];
  const sizeClasses = sizes[size];

  const handleClick = () => {
    if (clickable && !disabled && props.onClick) {
      props.onClick(props as any);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200',
        config.bg,
        config.text,
        config.border,
        sizeClasses,
        selected && config.selected,
        clickable && 'cursor-pointer hover:scale-[1.02]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      {...props}
    >
      {avatar && <span className="flex-shrink-0 -ml-1">{avatar}</span>}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            'flex-shrink-0 rounded-full hover:bg-black/10 p-0.5 transition-colors',
            disabled && 'cursor-not-allowed'
          )}
          aria-label="Supprimer"
          disabled={disabled}
        >
          <X className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
        </button>
      )}
    </div>
  );
};

export default Chip;