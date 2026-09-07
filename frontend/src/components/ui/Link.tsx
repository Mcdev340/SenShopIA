'use client';

import React from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'default' | 'primary' | 'muted' | 'underline';
  external?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Link = ({
  href,
  variant = 'default',
  external = false,
  disabled = false,
  className,
  children,
  ...props
}: LinkProps) => {
  const variants = {
    default: 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors',
    primary: 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors',
    muted: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors',
    underline: 'text-primary-600 underline-offset-2 hover:underline dark:text-primary-400 transition-colors',
  };

  if (disabled) {
    return (
      <span className={cn('cursor-not-allowed opacity-50', variants[variant], className)}>
        {children}
      </span>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={cn(variants[variant], className)} {...props}>
      {children}
    </NextLink>
  );
};

export default Link;