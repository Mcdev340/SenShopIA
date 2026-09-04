'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, User, Search, Menu, X, Home } from 'lucide-react';
import { useCart, useUI } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  variant?: 'default' | 'checkout' | 'simple' | 'dashboard';
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  actions?: React.ReactNode;
}

export default function Header({
  variant = 'default',
  showBackButton = false,
  backUrl,
  title,
  subtitle,
  className = '',
  actions,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = useCart();
  const { toggleMobileMenu, mobileMenuOpen } = useUI();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  // Version dashboard
  if (variant === 'dashboard') {
    return (
      <header className={cn(
        'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
        className
      )}>
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  aria-label="Retour"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title || 'Dashboard'}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {actions}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Version checkout
  if (variant === 'checkout') {
    return (
      <header className={cn(
        'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4',
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  aria-label="Retour"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">ShopSense</span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">AI</span>
              </Link>
              {title && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {actions}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="p-2">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                      {itemCount > 9 ? '9+' : itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Version simple
  if (variant === 'simple') {
    return (
      <header className={cn(
        'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">ShopSense</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              {actions}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Version par défaut
  return (
    <header className={cn(
      'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">ShopSense</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI</span>
            </Link>
            {title && (
              <>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
              </>
            )}
            {subtitle && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">
                {subtitle}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {actions}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => router.push('/search')}
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm" className="p-2" aria-label="Panier">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                    {itemCount > 9 ? '9+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}