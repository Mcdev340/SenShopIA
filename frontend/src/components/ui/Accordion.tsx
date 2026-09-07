'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============ CONTEXT ============

interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (value: string) => void;
  variant: 'default' | 'bordered' | 'separated';
  size: 'sm' | 'md' | 'lg';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
};

// ============ TYPES ============

interface AccordionProps {
  children: React.ReactNode;
  defaultValue?: string[];
  type?: 'single' | 'multiple';
  variant?: 'default' | 'bordered' | 'separated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

// ============ ACCORDION ============

export const Accordion = ({
  children,
  defaultValue = [],
  type = 'multiple',
  variant = 'default',
  size = 'md',
  className = '',
}: AccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultValue);

  const toggleItem = useCallback((value: string) => {
    if (type === 'single') {
      setExpandedItems(prev => prev[0] === value ? [] : [value]);
    } else {
      setExpandedItems(prev =>
        prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
      );
    }
  }, [type]);

  const sizeClasses = {
    sm: {
      trigger: 'py-2 text-sm',
      content: 'text-sm pb-2',
      chevron: 'h-3 w-3',
    },
    md: {
      trigger: 'py-3 text-base',
      content: 'text-base pb-3',
      chevron: 'h-4 w-4',
    },
    lg: {
      trigger: 'py-4 text-lg',
      content: 'text-lg pb-4',
      chevron: 'h-5 w-5',
    },
  };

  const variantClasses = {
    default: 'space-y-1',
    bordered: 'border rounded-lg divide-y divide-gray-200 dark:divide-gray-700',
    separated: 'space-y-2',
  };

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem, variant, size }}>
      <div className={cn('w-full', variantClasses[variant], className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// ============ ACCORDION ITEM ============

export const AccordionItem = ({
  value,
  children,
  className = '',
  disabled = false,
}: AccordionItemProps) => {
  const { variant } = useAccordion();

  const variantClasses = {
    default: '',
    bordered: 'border-0 rounded-none',
    separated: 'border rounded-lg overflow-hidden',
  };

  return (
    <div
      className={cn(
        'transition-all',
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      data-state={disabled ? 'disabled' : undefined}
    >
      {children}
    </div>
  );
};

// ============ ACCORDION TRIGGER ============

export const AccordionTrigger = ({
  children,
  className = '',
  icon,
  iconPosition = 'right',
}: AccordionTriggerProps) => {
  const { expandedItems, toggleItem, size } = useAccordion();
  const context = useContext(AccordionContext);
  const value = (React.useContext as any)._currentValue?.value;

  const isExpanded = expandedItems.includes(value);

  const sizeClasses = {
    sm: { trigger: 'py-2 text-sm', chevron: 'h-3 w-3' },
    md: { trigger: 'py-3 text-base', chevron: 'h-4 w-4' },
    lg: { trigger: 'py-4 text-lg', chevron: 'h-5 w-5' },
  };

  const handleClick = () => {
    if (!disabled) {
      toggleItem(value);
    }
  };

  // Récupérer la valeur du contexte parent
  const parentContext = useContext(AccordionContext);
  const itemValue = React.useRef(value);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center justify-between rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800',
        sizeClasses[size].trigger,
        isExpanded && 'font-medium',
        className
      )}
      aria-expanded={isExpanded}
    >
      <span className="flex items-center gap-2">
        {iconPosition === 'left' && (icon || <ChevronDown className={cn('transition-transform duration-200', sizeClasses[size].chevron, isExpanded && 'rotate-180')} />)}
        {children}
        {iconPosition === 'right' && (icon || <ChevronDown className={cn('transition-transform duration-200', sizeClasses[size].chevron, isExpanded && 'rotate-180')} />)}
      </span>
    </button>
  );
};

// ============ ACCORDION CONTENT ============

export const AccordionContent = ({
  children,
  className = '',
}: AccordionContentProps) => {
  const { expandedItems, size } = useAccordion();
  const context = useContext(AccordionContext);
  const value = (React.useContext as any)._currentValue?.value;

  const isExpanded = expandedItems.includes(value);

  const sizeClasses = {
    sm: 'text-sm pb-2',
    md: 'text-base pb-3',
    lg: 'text-lg pb-4',
  };

  if (!isExpanded) return null;

  return (
    <div
      className={cn(
        'animate-slideIn text-gray-600 dark:text-gray-400',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Accordion;