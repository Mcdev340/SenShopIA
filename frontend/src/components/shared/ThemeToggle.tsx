'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useUI } from '@/hooks';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  /** Variante du toggle */
  variant?: 'default' | 'icon' | 'dropdown' | 'switch' | 'minimal';
  /** Taille */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Classes supplémentaires */
  className?: string;
  /** Afficher le libellé */
  showLabel?: boolean;
  /** Afficher le texte */
  showText?: boolean;
}

export default function ThemeToggle({
  variant = 'default',
  size = 'md',
  className = '',
  showLabel = false,
  showText = true,
}: ThemeToggleProps) {
  const { theme, setTheme, isDarkMode, toggleTheme } = useUI();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    xs: {
      icon: 'w-3 h-3',
      button: 'p-1',
      text: 'text-xs',
    },
    sm: {
      icon: 'w-4 h-4',
      button: 'p-1.5',
      text: 'text-sm',
    },
    md: {
      icon: 'w-5 h-5',
      button: 'p-2',
      text: 'text-base',
    },
    lg: {
      icon: 'w-6 h-6',
      button: 'p-2.5',
      text: 'text-lg',
    },
  };

  const themes = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'system', label: 'Système', icon: Monitor },
  ];

  // Version minimal
  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
          sizeClasses[size].button,
          className
        )}
        aria-label="Basculer le thème"
      >
        {mounted ? (
          isDarkMode ? (
            <Moon className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
          ) : (
            <Sun className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
          )
        ) : (
          <Sun className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
        )}
      </button>
    );
  }

  // Version switch
  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          isDarkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600',
          className
        )}
        role="switch"
        aria-checked={isDarkMode}
      >
        <span className="sr-only">Basculer le thème</span>
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          )}
        />
        {showLabel && (
          <span className={cn('ml-2 text-sm', sizeClasses[size].text)}>
            {mounted ? (isDarkMode ? 'Sombre' : 'Clair') : 'Clair'}
          </span>
        )}
      </button>
    );
  }

  // Version icon
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
          sizeClasses[size].button,
          className
        )}
        aria-label="Basculer le thème"
      >
        {mounted ? (
          isDarkMode ? (
            <Moon className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
          ) : (
            <Sun className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
          )
        ) : (
          <Sun className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
        )}
        {showText && (
          <span className={cn('text-gray-700 dark:text-gray-300', sizeClasses[size].text)}>
            {mounted ? (isDarkMode ? 'Sombre' : 'Clair') : 'Clair'}
          </span>
        )}
      </button>
    );
  }

  // Version dropdown
  if (variant === 'dropdown') {
    const [isOpen, setIsOpen] = useState(false);

    const currentTheme = themes.find(t => t.value === theme) || themes[0];
    const CurrentIcon = currentTheme.icon;

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
            sizeClasses[size].button,
            className
          )}
          aria-label="Changer le thème"
        >
          <CurrentIcon className={cn(sizeClasses[size].icon, 'text-gray-700 dark:text-gray-300')} />
          {showText && (
            <span className={cn('text-gray-700 dark:text-gray-300', sizeClasses[size].text)}>
              {currentTheme.label}
            </span>
          )}
          <ChevronDown className={cn('text-gray-400', sizeClasses[size].icon)} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value as 'light' | 'dark' | 'system');
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </span>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Version par défaut
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.value;
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value as 'light' | 'dark' | 'system')}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
              sizeClasses[size].button
            )}
            aria-label={`Thème ${t.label}`}
          >
            <Icon className={cn(sizeClasses[size].icon)} />
            {showLabel && <span>{t.label}</span>}
          </button>
        );
      })}
    </div>
  );
}