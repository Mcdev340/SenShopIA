'use client';

import { Loader2, RefreshCw, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  /** Taille du spinner */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Couleur du spinner */
  color?: 'primary' | 'secondary' | 'white' | 'gray' | 'success' | 'danger' | 'warning';
  /** Texte à afficher */
  text?: string;
  /** Texte alternatif */
  altText?: string;
  /** Variante d'affichage */
  variant?: 'default' | 'overlay' | 'inline' | 'fullscreen' | 'skeleton';
  /** Classes supplémentaires */
  className?: string;
  /** Overlay transparent */
  transparent?: boolean;
  /** Type de spinner */
  spinnerType?: 'loader' | 'refresh' | 'clock' | 'dots';
  /** Nombre de dots pour le type 'dots' */
  dotsCount?: number;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const colorClasses = {
  primary: 'text-primary-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  gray: 'text-gray-400',
  success: 'text-green-500',
  danger: 'text-red-500',
  warning: 'text-yellow-500',
};

const SpinnerIcon = {
  loader: Loader2,
  refresh: RefreshCw,
  clock: Clock,
  dots: Circle,
};

export default function Loading({
  size = 'md',
  color = 'primary',
  text,
  altText = 'Chargement en cours...',
  variant = 'default',
  className = '',
  transparent = false,
  spinnerType = 'loader',
  dotsCount = 3,
}: LoadingProps) {
  const Icon = SpinnerIcon[spinnerType];

  // Version skeleton
  if (variant === 'skeleton') {
    return (
      <div className={cn('w-full animate-pulse', className)}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    );
  }

  // Version inline
  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-2', className)}>
        {spinnerType === 'dots' ? (
          <span className="inline-flex gap-1">
            {Array.from({ length: dotsCount }).map((_, i) => (
              <Circle
                key={i}
                className={cn(
                  'animate-bounce',
                  sizeClasses[size],
                  colorClasses[color]
                )}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </span>
        ) : (
          <Icon className={cn('animate-spin', sizeClasses[size], colorClasses[color])} />
        )}
        {text && <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>}
        <span className="sr-only">{altText}</span>
      </span>
    );
  }

  // Version overlay
  if (variant === 'overlay') {
    return (
      <div className={cn(
        'absolute inset-0 flex items-center justify-center z-10',
        transparent ? 'bg-transparent' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
        className
      )}>
        <div className="flex flex-col items-center gap-3">
          {spinnerType === 'dots' ? (
            <span className="inline-flex gap-2">
              {Array.from({ length: dotsCount }).map((_, i) => (
                <Circle
                  key={i}
                  className={cn(
                    'animate-bounce',
                    sizeClasses[size],
                    colorClasses[color]
                  )}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
          ) : (
            <Icon className={cn('animate-spin', sizeClasses[size], colorClasses[color])} />
          )}
          {text && <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>}
          <span className="sr-only">{altText}</span>
        </div>
      </div>
    );
  }

  // Version fullscreen
  if (variant === 'fullscreen') {
    return (
      <div className={cn(
        'fixed inset-0 flex items-center justify-center z-50',
        transparent ? 'bg-transparent' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
        className
      )}>
        <div className="flex flex-col items-center gap-4">
          {spinnerType === 'dots' ? (
            <span className="inline-flex gap-3">
              {Array.from({ length: dotsCount }).map((_, i) => (
                <Circle
                  key={i}
                  className={cn(
                    'animate-bounce',
                    sizeClasses[size],
                    colorClasses[color]
                  )}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
          ) : (
            <Icon className={cn('animate-spin', sizeClasses[size], colorClasses[color])} />
          )}
          {text && <p className="text-gray-500 dark:text-gray-400">{text}</p>}
          <span className="sr-only">{altText}</span>
        </div>
      </div>
    );
  }

  // Version par défaut
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      {spinnerType === 'dots' ? (
        <span className="inline-flex gap-2">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <Circle
              key={i}
              className={cn(
                'animate-bounce',
                sizeClasses[size],
                colorClasses[color]
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      ) : (
        <Icon className={cn('animate-spin', sizeClasses[size], colorClasses[color])} />
      )}
      {text && <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{text}</p>}
      <span className="sr-only">{altText}</span>
    </div>
  );
}