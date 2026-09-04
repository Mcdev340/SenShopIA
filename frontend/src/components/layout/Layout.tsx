'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Container } from './Container';
import { useUI, useAuth } from '@/hooks';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  hideSidebar?: boolean;
  hideHeader?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  requireAuth?: boolean;
  roles?: string[];
}

export default function Layout({
  children,
  className = '',
  hideNavbar = false,
  hideFooter = false,
  hideSidebar = false,
  hideHeader = false,
  maxWidth = 'xl',
  padding = true,
  requireAuth = false,
  roles = [],
}: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, sidebarOpen, setSidebarOpen } = useUI();
  const { isAuthenticated, user, loading } = useAuth();

  // Vérification d'authentification
  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
    if (!loading && requireAuth && isAuthenticated && roles.length > 0) {
      const hasRole = roles.includes(user?.role || '');
      if (!hasRole) {
        router.push('/dashboard');
      }
    }
  }, [loading, requireAuth, isAuthenticated, user, router, pathname, roles]);

  // Déterminer le type de page
  const isAuthPage = pathname?.startsWith('/login') || 
                     pathname?.startsWith('/register') || 
                     pathname?.startsWith('/reset-password') ||
                     pathname?.startsWith('/verify-email') ||
                     pathname?.startsWith('/forgot-password');
  
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/admin') || 
                          pathname?.startsWith('/delivery') ||
                          pathname?.startsWith('/advisor');
  
  const isCheckoutPage = pathname?.startsWith('/checkout');
  const isCartPage = pathname?.startsWith('/cart');

  // Fermer le sidebar sur mobile quand la route change
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile, sidebarOpen, setSidebarOpen]);

  // Si page d'authentification -> layout minimal
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {!hideHeader && <Header variant="simple" />}
        <main className="flex-1 flex items-center justify-center py-8 px-4">
          {children}
        </main>
        {!hideFooter && <Footer variant="simple" />}
      </div>
    );
  }

  // Si page de checkout -> layout simplifié
  if (isCheckoutPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {!hideHeader && <Header variant="checkout" title="Paiement" showBackButton />}
        <main className={cn('flex-1', padding && 'py-8')}>
          <Container maxWidth="lg">
            {children}
          </Container>
        </main>
        {!hideFooter && <Footer variant="simple" />}
      </div>
    );
  }

  // Si page de panier -> layout simplifié
  if (isCartPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {!hideNavbar && <Navbar />}
        <main className={cn('flex-1', padding && 'py-8')}>
          <Container maxWidth="xl">
            {children}
          </Container>
        </main>
        {!hideFooter && <Footer />}
      </div>
    );
  }

  // Layout dashboard
  if (isDashboardPage && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {!hideNavbar && <Navbar variant="dashboard" />}
        <div className="flex">
          {!hideSidebar && (
            <Sidebar 
              isOpen={sidebarOpen} 
              isMobile={isMobile} 
              userRole={user?.role}
            />
          )}
          <main className={cn(
            'flex-1 transition-all duration-300',
            !hideSidebar && 'ml-0 md:ml-64',
            padding && 'p-4 md:p-6'
          )}>
            {children}
          </main>
        </div>
        {!hideFooter && <Footer variant="dashboard" />}
      </div>
    );
  }

  // Layout standard
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {!hideNavbar && <Navbar />}
      <main className={cn(
        'flex-1',
        padding && 'py-8'
      )}>
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}