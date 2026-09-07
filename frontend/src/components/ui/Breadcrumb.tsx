'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
}

export const Breadcrumb = ({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHome = true,
  homeHref = '/',
  className,
  ...props
}: BreadcrumbProps) => {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)} aria-label="Fil d'Ariane" {...props}>
      {showHome && (
        <>
          <Link href={homeHref} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          {items.length > 0 && <span className="text-gray-400">{separator}</span>}
        </>
      )}
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  'flex items-center gap-1',
                  isLast ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {item.icon}
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-gray-400">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;