'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface DropdownItem {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'center' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
}

export const Dropdown = ({
  trigger,
  items,
  align = 'right',
  width = 'md',
  className,
  menuClassName,
  itemClassName,
  disabled = false,
  closeOnClick = true,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const alignClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  };

  const widthClasses = {
    auto: 'w-auto',
    sm: 'w-40',
    md: 'w-48',
    lg: 'w-56',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    if (item.onClick) {
      item.onClick();
    }
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <div onClick={() => !disabled && setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-lg py-1',
            alignClasses[align],
            widthClasses[width],
            menuClassName
          )}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && (
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    itemClassName
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <button
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    itemClassName
                  )}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;