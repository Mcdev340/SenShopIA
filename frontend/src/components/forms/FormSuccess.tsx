'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, ThumbsUp } from 'lucide-react';
import { useFormField } from './FormField';

interface FormSuccessProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Taille du succès */
  size?: 'sm' | 'md' | 'lg';
  /** Afficher l'icône */
  showIcon?: boolean;
  /** Type d'icône */
  iconType?: 'check' | 'thumbsup';
  /** Animation d'entrée */
  animate?: boolean;
  /** Classe supplémentaire */
  className?: string;
  /** Enfants */
  children: React.ReactNode;
}

export default function FormSuccess({
  size = 'sm',
  showIcon = true,
  iconType = 'check',
  animate = true,
  className = '',
  children,
  ...props
}: FormSuccessProps) {
  const context = useFormField();
  const [isVisible, setIsVisible] = useState(false);

  // Ne pas afficher si pas de message
  if (!children) {
    return null;
  }

  // Ne pas afficher si erreur
  if (context.hasError) {
    return null;
  }

  // Ne pas afficher si pas valide
  const shouldShow = context.isValid && context.isTouched;

  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const Icon = iconType === 'thumbsup' ? ThumbsUp : CheckCircle;

  return (
    <p
      className={cn(
        'text-green-600 dark:text-green-400 flex items-start gap-1.5 transition-all duration-200',
        sizeClasses[size],
        animate && 'animate-slideIn',
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {showIcon && (
        <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </p>
  );
}