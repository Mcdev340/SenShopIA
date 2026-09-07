'use client';

import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readOnly?: boolean;
  allowHalf?: boolean;
  showValue?: boolean;
  showMax?: boolean;
  className?: string;
  disabled?: boolean;
  onHover?: (value: number) => void;
}

const sizes = {
  sm: { star: 'h-3 w-3', text: 'text-xs' },
  md: { star: 'h-4 w-4', text: 'text-sm' },
  lg: { star: 'h-5 w-5', text: 'text-base' },
  xl: { star: 'h-6 w-6', text: 'text-lg' },
};

export const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  allowHalf = false,
  showValue = true,
  showMax = true,
  className,
  disabled = false,
  onHover,
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [internalValue, setInternalValue] = useState(value);

  const currentValue = value || internalValue;

  const handleMouseEnter = (index: number) => {
    if (readOnly || disabled) return;
    setHoverValue(index);
    if (onHover) {
      onHover(index);
    }
  };

  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverValue(null);
    if (onHover) {
      onHover(0);
    }
  };

  const handleClick = (index: number) => {
    if (readOnly || disabled) return;
    const newValue = allowHalf && index - 0.5 > currentValue ? index - 0.5 : index;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const getStarValue = (index: number) => {
    const displayValue = hoverValue !== null ? hoverValue : currentValue;
    if (index <= displayValue) return 1;
    if (allowHalf && index - 0.5 <= displayValue) return 0.5;
    return 0;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
        role="group"
        aria-label="Évaluation"
      >
        {Array.from({ length: max }, (_, i) => {
          const index = i + 1;
          const starValue = getStarValue(index);

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              className={cn(
                'p-0.5 transition-colors focus:outline-none',
                (readOnly || disabled) && 'cursor-default',
                !readOnly && !disabled && 'cursor-pointer hover:scale-110'
              )}
              disabled={readOnly || disabled}
              aria-label={`Noter ${index} étoiles`}
            >
              {starValue === 1 ? (
                <Star className={cn(sizes[size].star, 'fill-yellow-400 text-yellow-400')} />
              ) : starValue === 0.5 ? (
                <StarHalf className={cn(sizes[size].star, 'fill-yellow-400 text-yellow-400')} />
              ) : (
                <Star className={cn(sizes[size].star, 'text-gray-300 dark:text-gray-600')} />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-medium text-gray-700 dark:text-gray-300', sizes[size].text)}>
          {currentValue.toFixed(1)}
        </span>
      )}
      {showMax && (
        <span className={cn('text-gray-400 dark:text-gray-500', sizes[size].text)}>
          / {max}
        </span>
      )}
    </div>
  );
};

export default Rating;