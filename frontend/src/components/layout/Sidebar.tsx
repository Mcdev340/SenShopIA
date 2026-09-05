"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  BarChart3,
  Tag,
  Bell,
  UserCog,
  ClipboardList,
  FileText,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  isMobile?: boolean;
  userRole?: string;
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen = true,
  isMobile = false,
  userRole = "client",
  className = "",
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isCollapsed] = useState(false);

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
      {
        label: "Notifications",
        icon: Bell,
        href: "/dashboard/admin/notifications",
        roles: ["admin"],
        badge: "8",
      },
      {
        label: "Rapports",
        icon: FileText,
        href: "/dashboard/admin/reports",
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
        icon: ClipboardList,
        href: "/dashboard/delivery/history",
        roles: ["delivery"],
      },
      {
        label: "Statistiques",
        icon: TrendingUp,
        href: "/dashboard/delivery/stats",
        roles: ["delivery"],
      },
      {
        label: "Planning",
        icon: Calendar,
        href: "/dashboard/delivery/schedule",
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
      {
        label: "Satisfaction",
        icon: Star,
        href: "/dashboard/advisor/satisfaction",
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
    return allNav.filter((item) => item.roles.includes(userRole));
  };

  const navigation = getNavigation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fermer sur mobile quand on clique sur un lien
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Si mobile et fermé, ne pas afficher
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          isMobile ? "w-72" : isCollapsed ? "w-20" : "w-64",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
          className,
        )}
        role="navigation"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800",
            isCollapsed && !isMobile && "justify-center",
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {isCollapsed && !isMobile ? "S" : "ShopSense"}
            </span>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                AI
              </span>
            )}
          </Link>
        </div>

        {/* User info */}
        {!isCollapsed && (
          <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName || user?.username || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userRole === "admin"
                  ? "Administrateur"
                  : userRole === "delivery"
                    ? "Livreur"
                    : userRole === "advisor"
                      ? "Conseiller"
                      : "Client"}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                  isItemActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
                title={isCollapsed && !isMobile ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isItemActive
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
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
              isCollapsed && !isMobile && "justify-center",
            )}
            title={isCollapsed && !isMobile ? "Déconnexion" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!isCollapsed || isMobile) && (
              <span className="text-sm font-medium">Déconnexion</span>
            )}
          </button>

          {!isCollapsed && (
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              v1.0.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
