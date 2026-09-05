"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  Package,
} from "lucide-react";
import { cn, formatPrice, formatRelativeTime } from "@/lib/utils";

const BadgeComponent = Badge as any;

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  date: Date;
  paymentMethod?: string;
  shippingAddress?: string;
}

interface RecentOrdersProps {
  orders: Order[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
  showStatus?: boolean;
  className?: string;
  loading?: boolean;
  onViewAll?: () => void;
  onOrderClick?: (order: Order) => void;
}

const statusConfig = {
  pending: {
    label: "En attente",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
    border: "border-yellow-200 dark:border-yellow-800",
  },
  processing: {
    label: "En traitement",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Loader2,
    border: "border-blue-200 dark:border-blue-800",
  },
  shipped: {
    label: "Expédiée",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Truck,
    border: "border-purple-200 dark:border-purple-800",
  },
  delivered: {
    label: "Livrée",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
    border: "border-green-200 dark:border-green-800",
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
    border: "border-red-200 dark:border-red-800",
  },
};

export default function RecentOrders({
  orders,
  title = "Commandes récentes",
  subtitle = "Dernières commandes passées",
  limit = 5,
  showViewAll = true,
  showStatus = true,
  className = "",
  loading = false,
  onViewAll,
  onOrderClick,
}: RecentOrdersProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const displayOrders = expanded ? orders : orders.slice(0, limit);

  const getStatusBadge = (status: Order["status"]) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <BadgeComponent
        className={cn(
          "flex items-center space-x-1",
          config.color,
          config.border,
        )}
      >
        {status === "processing" ? (
          <Icon className="w-3 h-3 animate-spin" />
        ) : (
          <Icon className="w-3 h-3" />
        )}
        <span>{config.label}</span>
      </BadgeComponent>
    );
  };

  const handleOrderClick = (order: Order) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else {
      router.push(`/dashboard/admin/orders/${order.id}`);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push("/dashboard/admin/orders");
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
          <div className="flex items-center space-x-2">
            {orders.length > limit && (
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Réduire
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Voir plus ({orders.length - limit})
                  </>
                )}
              </Button>
            )}
            {showViewAll && (
              <Button
                variant="outline"
                size="sm"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                onClick={handleViewAll}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          // Skeleton loading
          <div className="space-y-4">
            {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucune commande récente
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                {/* Info commande */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      #{order.id.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.customer}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {order.items} article{order.items > 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(order.date)}</span>
                      {order.paymentMethod && (
                        <>
                          <span>•</span>
                          <span>{order.paymentMethod}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statut et prix */}
                <div className="flex items-center justify-between sm:justify-end space-x-4 mt-2 sm:mt-0">
                  <div className="flex items-center space-x-3">
                    {showStatus && getStatusBadge(order.status)}
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex-shrink-0"
                    aria-label="Voir la commande"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(order);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export const useDefaultOrders = () => {
  const orders: Order[] = [
    {
      id: "ORD-1234",
      customer: "Jean Dupont",
      customerEmail: "jean@example.com",
      total: 125000,
      status: "delivered",
      items: 3,
      date: new Date(Date.now() - 1000 * 60 * 30),
      paymentMethod: "Carte bancaire",
      shippingAddress: "Dakar, Sénégal",
    },
    {
      id: "ORD-1235",
      customer: "Marie Diop",
      customerEmail: "marie@example.com",
      total: 75000,
      status: "processing",
      items: 2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      paymentMethod: "Orange Money",
    },
    {
      id: "ORD-1236",
      customer: "Oumar Fall",
      customerEmail: "oumar@example.com",
      total: 250000,
      status: "shipped",
      items: 5,
      date: new Date(Date.now() - 1000 * 60 * 60 * 5),
      paymentMethod: "Virement bancaire",
    },
    {
      id: "ORD-1237",
      customer: "Aminata Sow",
      customerEmail: "aminata@example.com",
      total: 45000,
      status: "pending",
      items: 1,
      date: new Date(Date.now() - 1000 * 60 * 60 * 12),
      paymentMethod: "Paiement à la livraison",
    },
    {
      id: "ORD-1238",
      customer: "Moussa Kane",
      customerEmail: "moussa@example.com",
      total: 180000,
      status: "cancelled",
      items: 4,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      paymentMethod: "Carte bancaire",
    },
  ];

  return orders;
};
