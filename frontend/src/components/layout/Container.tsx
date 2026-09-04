'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  padding?: boolean;
  paddingX?: boolean;
  paddingY?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  centered?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
  none: 'max-w-none',
};

export default function Container({
  children,
  maxWidth = 'xl',
  padding = true,
  paddingX = true,
  paddingY = false,
  className = '',
  as: Component = 'div',
  centered = true,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full',
        maxWidth !== 'none' && maxWidthClasses[maxWidth],
        centered && 'mx-auto',
        padding && 'px-4 sm:px-6 lg:px-8',
        !padding && paddingX && 'px-4 sm:px-6 lg:px-8',
        paddingY && 'py-4 sm:py-6 lg:py-8',
        className
      )}
    >
      {children}
    </Component>
  );
}