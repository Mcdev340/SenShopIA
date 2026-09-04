'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  User, 
  LogOut, 
  LogIn,
  UserPlus,
  Package,
  MessageCircle,
  LayoutDashboard,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Home,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { useAuth, useCart, useUI, useNotifications } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

interface NavbarProps {
  variant?: 'default' | 'dashboard' | 'simple';
  className?: string;
}

export default function Navbar({ variant = 'default', className = '' }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, loadCart } = useCart();
  const { unreadCount, loadUnreadCount } = useNotifications();
  const { theme, toggleTheme, isMobile, mobileMenuOpen, toggleMobileMenu } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          await Promise.all([
            loadCart(),
            loadUnreadCount(),
          ]);
        }
      } catch (error) {
        console.error('Error loading navbar data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, loadCart, loadUnreadCount]);

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Produits', href: '/products', icon: Package },
    { name: 'Catégories', href: '/categories', icon: null },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Version simple
  if (variant === 'simple') {
    return (
      <nav className={cn(
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
              <ThemeToggle />
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
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Version dashboard
  if (variant === 'dashboard') {
    return (
      <nav className={cn(
        'sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-shadow',
        isScrolled && 'shadow-md',
        className
      )}>
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">ShopSense</span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">AI</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => router.push('/search')}
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 relative"
                onClick={() => router.push('/notifications')}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
              <ThemeToggle />
              <Dropdown
                trigger={
                  <Button variant="ghost" className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar
                      src={user?.avatar || undefined}
                      alt={user?.username || 'User'}
                      size="sm"
                    />
                    <span className="text-sm hidden lg:inline text-gray-700 dark:text-gray-300">
                      {user?.firstName || user?.username}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                }
                align="end"
                items={[
                  {
                    label: 'Profil',
                    href: '/profile',
                    icon: User,
                  },
                  {
                    label: 'Commandes',
                    href: '/orders',
                    icon: Package,
                  },
                  {
                    label: 'Messages',
                    href: '/chat',
                    icon: MessageCircle,
                  },
                  {
                    label: 'Paramètres',
                    href: '/settings',
                    icon: Settings,
                  },
                  {
                    label: 'Aide',
                    href: '/help',
                    icon: HelpCircle,
                  },
                  {
                    label: 'Déconnexion',
                    onClick: handleLogout,
                    icon: LogOut,
                    className: 'text-red-600 hover:text-red-700',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Version par défaut
  return (
    <nav className={cn(
      'sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-shadow',
      isScrolled && 'shadow-md',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">ShopSense</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400',
                  isActive(item.href)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => router.push('/search')}
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
              onClick={() => router.push('/notifications')}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
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

            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <Button variant="ghost" className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar
                      src={user?.avatar || undefined}
                      alt={user?.username || 'User'}
                      size="sm"
                    />
                    <span className="text-sm hidden lg:inline text-gray-700 dark:text-gray-300">
                      {user?.firstName || user?.username}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                }
                align="end"
                items={[
                  {
                    label: 'Profil',
                    href: '/profile',
                    icon: User,
                  },
                  ...(user?.role === 'admin' || user?.role === 'delivery' || user?.role === 'advisor' ? [
                    {
                      label: 'Dashboard',
                      href: `/dashboard/${user?.role}`,
                      icon: LayoutDashboard,
                    },
                  ] : []),
                  {
                    label: 'Commandes',
                    href: '/orders',
                    icon: Package,
                  },
                  {
                    label: 'Messages',
                    href: '/chat',
                    icon: MessageCircle,
                  },
                  {
                    label: 'Paramètres',
                    href: '/settings',
                    icon: Settings,
                  },
                  {
                    label: 'Déconnexion',
                    onClick: handleLogout,
                    icon: LogOut,
                    className: 'text-red-600 hover:text-red-700',
                  },
                ]}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscription
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="flex items-center space-x-2 md:hidden">
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
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                onClick={toggleMobileMenu}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    <User className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    <Package className="w-5 h-5" />
                    <span>Commandes</span>
                  </Link>
                  <Link
                    href="/chat"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Se connecter</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>S'inscrire</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}