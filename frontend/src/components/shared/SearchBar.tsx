'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2, Mic, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  /** Valeur de la recherche */
  value?: string;
  /** Placeholder */
  placeholder?: string;
  /** En cours de recherche */
  isLoading?: boolean;
  /** Afficher le bouton de recherche */
  showButton?: boolean;
  /** Afficher le microphone */
  showVoice?: boolean;
  /** Afficher le bouton d'effacement */
  showClear?: boolean;
  /** Afficher le bouton de filtres */
  showFilters?: boolean;
  /** Auto-focus */
  autoFocus?: boolean;
  /** Délai de debounce (ms) */
  debounce?: number;
  /** Callback de recherche */
  onSearch: (value: string) => void;
  /** Callback de changement */
  onChange?: (value: string) => void;
  /** Callback de focus */
  onFocus?: () => void;
  /** Callback de blur */
  onBlur?: () => void;
  /** Callback de la touche Entrée */
  onEnter?: (value: string) => void;
  /** Callback du microphone */
  onVoice?: () => void;
  /** Callback des filtres */
  onFilters?: () => void;
  /** Classes supplémentaires */
  className?: string;
  /** Variante */
  variant?: 'default' | 'rounded' | 'underline' | 'outlined';
  /** Taille */
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchBar({
  value: externalValue = '',
  placeholder = 'Rechercher...',
  isLoading = false,
  showButton = false,
  showVoice = false,
  showClear = true,
  showFilters = false,
  autoFocus = false,
  debounce = 300,
  onSearch,
  onChange,
  onFocus,
  onBlur,
  onEnter,
  onVoice,
  onFilters,
  className = '',
  variant = 'default',
  size = 'md',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(externalValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;

  const handleSearch = useCallback((searchValue: string) => {
    onSearch(searchValue);
    setIsDebouncing(false);
  }, [onSearch]);

  // Debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (debounce > 0 && value) {
      setIsDebouncing(true);
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(value);
      }, debounce);
    } else if (value) {
      handleSearch(value);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [value, debounce, handleSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (externalValue === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    if (externalValue === undefined) {
      setInternalValue('');
    }
    if (onChange) {
      onChange('');
    }
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onEnter) {
        onEnter(value);
      } else {
        onSearch(value);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const variantClasses = {
    default: 'border rounded-lg',
    rounded: 'border rounded-full px-4',
    underline: 'border-0 border-b rounded-none',
    outlined: 'border-2 rounded-lg',
  };

  const sizeClasses = {
    sm: {
      input: 'text-sm py-1.5',
      button: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      input: 'text-base py-2',
      button: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      input: 'text-lg py-3',
      button: 'px-6 py-3 text-lg',
      icon: 'w-6 h-6',
    },
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <div
        className={cn(
          'relative flex items-center w-full transition-all',
          variantClasses[variant],
          isFocused && 'ring-2 ring-primary-500 border-primary-500',
          'border-gray-300 dark:border-gray-600',
          className
        )}
      >
        <Search className={cn(
          'absolute left-3 text-gray-400 pointer-events-none',
          sizeClasses[size].icon
        )} />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'w-full border-0 bg-transparent pl-10 focus:ring-0 focus:outline-none',
            sizeClasses[size].input,
            variant === 'underline' && 'rounded-none'
          )}
          autoFocus={autoFocus}
          aria-label={placeholder}
        />
        <div className="flex items-center gap-1 pr-2">
          {isLoading && (
            <Loader2 className={cn(
              'animate-spin text-gray-400',
              sizeClasses[size].icon
            )} />
          )}
          {showVoice && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoice}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Recherche vocale"
            >
              <Mic className={cn(sizeClasses[size].icon)} />
            </Button>
          )}
          {showClear && value && (
            <button
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className={cn(sizeClasses[size].icon)} />
            </button>
          )}
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFilters}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Filtres"
            >
              <Filter className={cn(sizeClasses[size].icon)} />
            </Button>
          )}
          {showButton && (
            <Button
              size="sm"
              onClick={() => handleSearch(value)}
              disabled={isLoading}
              className={cn(
                'ml-1 flex-shrink-0',
                sizeClasses[size].button,
                variant === 'rounded' && 'rounded-full'
              )}
            >
              {isLoading ? (
                <Loader2 className={cn('animate-spin', sizeClasses[size].icon)} />
              ) : (
                'Rechercher'
              )}
            </Button>
          )}
        </div>
        {isDebouncing && (
          <span className="absolute -bottom-6 left-0 text-xs text-gray-400">
            Recherche en cours...
          </span>
        )}
      </div>
    </div>
  );
}