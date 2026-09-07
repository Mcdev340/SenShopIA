'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body'
    | 'body-sm'
    | 'body-lg'
    | 'caption'
    | 'overline'
    | 'subtitle1'
    | 'subtitle2';
  component?: keyof JSX.IntrinsicElements;
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'danger' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5;
}

const variants = {
  h1: { tag: 'h1', className: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight' },
  h2: { tag: 'h2', className: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight' },
  h3: { tag: 'h3', className: 'text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight' },
  h4: { tag: 'h4', className: 'text-xl md:text-2xl lg:text-3xl font-semibold' },
  h5: { tag: 'h5', className: 'text-lg md:text-xl lg:text-2xl font-semibold' },
  h6: { tag: 'h6', className: 'text-base md:text-lg lg:text-xl font-semibold' },
  body: { tag: 'p', className: 'text-base' },
  'body-sm': { tag: 'p', className: 'text-sm' },
  'body-lg': { tag: 'p', className: 'text-lg' },
  caption: { tag: 'span', className: 'text-xs text-gray-500 dark:text-gray-400' },
  overline: { tag: 'span', className: 'text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400' },
  subtitle1: { tag: 'p', className: 'text-base font-medium' },
  subtitle2: { tag: 'p', className: 'text-sm font-medium' },
};

const colors = {
  default: 'text-gray-900 dark:text-white',
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-gray-600 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  danger: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const weights = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const aligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Typography = ({
  variant = 'body',
  component,
  color = 'default',
  align = 'left',
  weight,
  truncate = false,
  lineClamp,
  className,
  children,
  ...props
}: TypographyProps) => {
  const variantConfig = variants[variant];
  const Component = component || variantConfig.tag;

  const lineClampClasses = lineClamp ? `line-clamp-${lineClamp}` : '';

  return (
    <Component
      className={cn(
        variantConfig.className,
        colors[color],
        aligns[align],
        weight && weights[weight],
        truncate && 'truncate',
        lineClampClasses,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;