"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  Truck,
  MessageCircle,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  BarChart3,
  Tag,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth, useUI, useNotifications } from "@/hooks";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const AvatarComponent = Avatar as any;
const BadgeComponent = Badge as any;
const DropdownComponent = Dropdown as any;

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  requireAuth?: boolean;
  roles?: string[];
}

export default function DashboardLayout({
  children,
  className = "",
  title = "Tableau de bord",
  subtitle = "Bienvenue sur votre espace personnel",
  actions,
  requireAuth = true,
  roles = [],
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { isMobile } = useUI();
  const { unreadCount } = useNotifications();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Vérification d'authentification
  useEffect(() => {
    if (!authLoading && requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
    if (!authLoading && requireAuth && isAuthenticated && roles.length > 0) {
      const hasRole = roles.includes(user?.role || "");
      if (!hasRole) {
        router.push("/");
      }
    }
  }, [
    authLoading,
    requireAuth,
    isAuthenticated,
    user,
    router,
    pathname,
    roles,
  ]);

  // Navigation selon le rôle
  const getNavigation = () => {
    const baseNav = [
      {
        label: "Tableau de bord",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: ["admin", "delivery", "advisor", "client"],
      },
    ];

    const adminNav = [
      {
        label: "Commandes",
        icon: ShoppingBag,
        href: "/dashboard/admin/orders",
        roles: ["admin"],
        badge: "12",
      },
      {
        label: "Produits",
        icon: Package,
        href: "/dashboard/admin/products",
        roles: ["admin"],
        badge: "156",
      },
      {
        label: "Utilisateurs",
        icon: Users,
        href: "/dashboard/admin/users",
        roles: ["admin"],
        badge: "1.2k",
      },
      {
        label: "Paiements",
        icon: CreditCard,
        href: "/dashboard/admin/payments",
        roles: ["admin"],
      },
      {
        label: "Livraisons",
        icon: Truck,
        href: "/dashboard/admin/deliveries",
        roles: ["admin"],
        badge: "5",
      },
      {
        label: "Support",
        icon: MessageCircle,
        href: "/dashboard/admin/support",
        roles: ["admin"],
        badge: "3",
      },
      {
        label: "Analytics",
        icon: BarChart3,
        href: "/dashboard/admin/analytics",
        roles: ["admin"],
      },
      {
        label: "Catégories",
        icon: Tag,
        href: "/dashboard/admin/categories",
        roles: ["admin"],
      },
    ];

    const deliveryNav = [
      {
        label: "Mes livraisons",
        icon: Truck,
        href: "/dashboard/delivery/orders",
        roles: ["delivery"],
        badge: "3",
      },
      {
        label: "Historique",
        icon: ShoppingBag,
        href: "/dashboard/delivery/history",
        roles: ["delivery"],
      },
      {
        label: "Statistiques",
        icon: BarChart3,
        href: "/dashboard/delivery/stats",
        roles: ["delivery"],
      },
    ];

    const advisorNav = [
      {
        label: "Tickets",
        icon: MessageCircle,
        href: "/dashboard/advisor/tickets",
        roles: ["advisor"],
        badge: "7",
      },
      {
        label: "FAQ",
        icon: HelpCircle,
        href: "/dashboard/advisor/faq",
        roles: ["advisor"],
      },
      {
        label: "Statistiques",
        icon: BarChart3,
        href: "/dashboard/advisor/stats",
        roles: ["advisor"],
      },
    ];

    const commonNav = [
      {
        label: "Profil",
        icon: UserCog,
        href: "/profile",
        roles: ["admin", "delivery", "advisor", "client"],
      },
      {
        label: "Paramètres",
        icon: Settings,
        href: "/settings",
        roles: ["admin", "delivery", "advisor", "client"],
      },
      {
        label: "Aide",
        icon: HelpCircle,
        href: "/help",
        roles: ["admin", "delivery", "advisor", "client"],
      },
    ];

    const allNav = [
      ...baseNav,
      ...adminNav,
      ...deliveryNav,
      ...advisorNav,
      ...commonNav,
    ];
    return allNav.filter((item) => item.roles.includes(user?.role || "client"));
  };

  const navigation = getNavigation();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Overlay pour mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ShopSense
                </span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  AI
                </span>
              </div>
            </div>

            {/* Center */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="p-2 relative"
                onClick={() => router.push("/notifications")}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <BadgeComponent className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </BadgeComponent>
                )}
              </Button>
              <ThemeToggle />
              <DropdownComponent
                trigger={
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <AvatarComponent
                      src={user?.avatar || undefined}
                      alt={user?.username || "User"}
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
                    label: "Profil",
                    href: "/profile",
                    icon: User,
                  },
                  {
                    label: "Paramètres",
                    href: "/settings",
                    icon: Settings,
                  },
                  {
                    label: "Aide",
                    href: "/help",
                    icon: HelpCircle,
                  },
                  {
                    label: "Déconnexion",
                    onClick: handleLogout,
                    icon: LogOut,
                    className: "text-red-600 hover:text-red-700",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay Mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          isMobile ? "w-72" : isCollapsed ? "w-20" : "w-64",
          isMobile && !isMobileMenuOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800",
            isCollapsed && !isMobile && "justify-center",
          )}
        >
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {isCollapsed && !isMobile ? "S" : "ShopSense"}
          </span>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              AI
            </span>
          )}
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <AvatarComponent
              src={user?.avatar || undefined}
              alt={user?.username || "User"}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName || user?.username || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                {user?.role || "client"}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group cursor-pointer",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isCollapsed && !isMobile && "justify-center",
                )}
                title={isCollapsed && !isMobile ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                />
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm font-medium flex-1">
                    {item.label}
                  </span>
                )}
                {(!isCollapsed || isMobile) &&
                  "badge" in item &&
                  typeof item.badge === "string" &&
                  item.badge && (
                    <BadgeComponent
                      variant={isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.badge}
                    </BadgeComponent>
                  )}
              </a>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-3 border-t border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
              isCollapsed && !isMobile && "justify-center",
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!isCollapsed || isMobile) && (
              <span className="text-sm font-medium">Déconnexion</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300",
          isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64",
          "p-4 md:p-6",
        )}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
          {actions && (
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {actions}
            </div>
          )}
        </div>

        <div className={className}>{children}</div>
      </main>
    </div>
  );
}
