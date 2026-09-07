'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

const variants = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    icon: Info,
    iconColor: 'text-blue-500',
  },
  default: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    icon: Info,
    iconColor: 'text-gray-500',
  },
};

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const Toast = ({
  message,
  variant = 'default',
  duration = 5000,
  onClose,
  title,
  icon,
  className = '',
  position = 'top-right',
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = variants[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full animate-slideIn',
        positionClasses[position],
        className
      )}
    >
      <div
        className={cn(
          'rounded-lg border p-4 shadow-lg flex items-start gap-3',
          config.bg,
          config.border
        )}
        role="alert"
      >
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          {icon || <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          {title && <p className={cn('font-medium', config.text)}>{title}</p>}
          <p className={cn('text-sm', config.text)}>{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 rounded p-1 transition-colors hover:bg-black/5',
            config.text
          )}
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;