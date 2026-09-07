'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ComponentProps<typeof NextImage> {
  fallback?: React.ReactNode;
  placeholderColor?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'landscape';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const aspectRatios = {
  auto: 'aspect-auto',
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
};

export const Image = ({
  className,
  fallback,
  placeholderColor = 'bg-gray-200 dark:bg-gray-700',
  aspectRatio = 'auto',
  objectFit = 'cover',
  alt = 'Image',
  onError,
  ...props
}: ImageProps) => {
  const [error, setError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    if (onError) {
      onError(e);
    }
  };

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn('relative overflow-hidden', placeholderColor, aspectRatio !== 'auto' && aspectRatios[aspectRatio], className)}>
      <NextImage
        className={cn('transition-opacity duration-300', objectFit === 'cover' && 'object-cover')}
        style={{ objectFit }}
        alt={alt}
        onError={handleError}
        {...props}
        fill={props.fill ?? true}
      />
    </div>
  );
};

export default Image;