"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  ShoppingBag,
  Users,
  Package,
  Truck,
  MessageCircle,
  Settings,
  FileText,
  BarChart3,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "pink";
  description?: string;
  badge?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colorClasses = {
  primary:
    "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 border-primary-200 dark:border-primary-800",
  secondary:
    "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700",
  success:
    "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
  danger:
    "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800",
  info: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  purple:
    "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800",
  pink: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 border-pink-200 dark:border-pink-800",
};

const defaultActions: QuickAction[] = [
  {
    id: "new-order",
    label: "Nouvelle commande",
    icon: <Plus className="w-5 h-5" />,
    href: "/dashboard/admin/orders/new",
    color: "primary",
    description: "Créer une commande",
  },
  {
    id: "manage-products",
    label: "Gérer les produits",
    icon: <Package className="w-5 h-5" />,
    href: "/dashboard/admin/products",
    color: "info",
    description: "Ajouter ou modifier",
  },
  {
    id: "view-orders",
    label: "Voir les commandes",
    icon: <ShoppingBag className="w-5 h-5" />,
    href: "/dashboard/admin/orders",
    color: "success",
    description: "Liste des commandes",
  },
  {
    id: "manage-users",
    label: "Gérer les utilisateurs",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/admin/users",
    color: "secondary",
    description: "Utilisateurs actifs",
  },
];

const deliveryActions: QuickAction[] = [
  {
    id: "view-deliveries",
    label: "Mes livraisons",
    icon: <Truck className="w-5 h-5" />,
    href: "/dashboard/delivery/orders",
    color: "primary",
    description: "À livrer aujourd'hui",
  },
  {
    id: "delivery-history",
    label: "Historique",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/delivery/history",
    color: "info",
    description: "Livraisons effectuées",
  },
  {
    id: "delivery-stats",
    label: "Statistiques",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/dashboard/delivery/stats",
    color: "success",
    description: "Performance",
  },
  {
    id: "delivery-help",
    label: "Aide",
    icon: <HelpCircle className="w-5 h-5" />,
    href: "/help",
    color: "secondary",
    description: "Support",
  },
];

const advisorActions: QuickAction[] = [
  {
    id: "view-tickets",
    label: "Tickets",
    icon: <MessageCircle className="w-5 h-5" />,
    href: "/dashboard/advisor/tickets",
    color: "primary",
    description: "Tickets ouverts",
  },
  {
    id: "advisor-faq",
    label: "FAQ",
    icon: <HelpCircle className="w-5 h-5" />,
    href: "/dashboard/advisor/faq",
    color: "info",
    description: "Base de connaissances",
  },
  {
    id: "advisor-stats",
    label: "Statistiques",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/dashboard/advisor/stats",
    color: "success",
    description: "Performance",
  },
  {
    id: "advisor-help",
    label: "Aide",
    icon: <Settings className="w-5 h-5" />,
    href: "/help",
    color: "secondary",
    description: "Support",
  },
];

export default function QuickActions({
  actions = defaultActions,
  title = "Actions rapides",
  subtitle = "Accédez rapidement aux fonctionnalités principales",
  columns = 4,
  className = "",
}: QuickActionsProps) {
  const router = useRouter();

  const columnsClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const handleAction = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        <div className={cn("grid gap-3", columnsClasses[columns])}>
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border transition-all text-left",
                colorClasses[action.color || "secondary"],
                "hover:scale-[1.02] hover:shadow-md",
              )}
            >
              <div className="flex-shrink-0">{action.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{action.label}</p>
                {action.description && (
                  <p className="text-xs opacity-75 truncate">
                    {action.description}
                  </p>
                )}
              </div>
              {action.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-white/50 dark:bg-gray-700/50 rounded-full">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export const useQuickActions = (role?: string) => {
  if (role === "delivery") {
    return deliveryActions;
  }
  if (role === "advisor") {
    return advisorActions;
  }
  return defaultActions;
};
