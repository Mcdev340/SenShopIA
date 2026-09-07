'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  gap?: string | number;
  animate?: boolean;
}

export const Skeleton = ({
  className,
  variant = 'rounded',
  width,
  height,
  count = 1,
  gap,
  animate = true,
  ...props
}: SkeletonProps) => {
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const renderSkeleton = () => (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variants[variant],
        animate && 'animate-pulse',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      {...props}
    />
  );

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div
      className="flex flex-col"
      style={{ gap: typeof gap === 'number' ? `${gap}px` : gap }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Skeleton;