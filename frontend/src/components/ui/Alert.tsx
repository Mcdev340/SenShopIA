'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'default';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  default: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    title: 'text-gray-800 dark:text-gray-200',
    iconColor: 'text-gray-500 dark:text-gray-400',
    icon: Info,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    title: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500 dark:text-blue-400',
    icon: Info,
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    title: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-500 dark:text-green-400',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-300',
    title: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    icon: AlertTriangle,
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    title: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-500 dark:text-red-400',
    icon: AlertCircle,
  },
};

const sizes = {
  sm: {
    container: 'p-3 text-sm',
    title: 'text-sm',
    icon: 'h-4 w-4',
  },
  md: {
    container: 'p-4 text-base',
    title: 'text-base',
    icon: 'h-5 w-5',
  },
  lg: {
    container: 'p-5 text-lg',
    title: 'text-lg',
    icon: 'h-6 w-6',
  },
};

export const Alert = ({
  variant = 'default',
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  size = 'md',
  className,
  ...props
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  const config = variants[variant];
  const Icon = config.icon;
  const sizeConfig = sizes[size];

  return (
    <div
      className={cn(
        'relative rounded-lg border flex items-start gap-3',
        config.bg,
        config.border,
        sizeConfig.container,
        className
      )}
      role="alert"
      {...props}
    >
      <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
        {icon || <Icon className={sizeConfig.icon} />}
      </div>
      <div className="flex-1 min-w-0">
        {title && <p className={cn('font-medium', config.title, sizeConfig.title)}>{title}</p>}
        <div className={cn('text-sm', config.text)}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 rounded p-1 transition-colors hover:bg-black/5',
            config.text
          )}
          aria-label="Fermer"
        >
          <X className={sizeConfig.icon} />
        </button>
      )}
    </div>
  );
};

export default Alert;