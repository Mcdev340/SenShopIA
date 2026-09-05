"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  RefreshCw,
  Printer,
  Share2,
  Loader2,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Order, OrderStatus as OrderStatusType } from "@/types/order";
import { formatPrice, formatDate, formatRelativeTime, cn } from "@/lib/utils";
import { useToast } from "@/hooks";
import type { LucideIcon } from "lucide-react";

const BadgeComponent = Badge as any;

interface OrderCardProps {
  order: Order;
  variant?: "default" | "compact" | "minimal";
  showActions?: boolean;
  showDetails?: boolean;
  className?: string;
  onView?: (order: Order) => void;
  onTrack?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onReorder?: (order: Order) => void;
  onShare?: (order: Order) => void;
  onPrint?: (order: Order) => void;
}

const statusIcons: Record<OrderStatusType, LucideIcon> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Loader2,
  shipped: Truck,
  in_transit: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  returned: AlertCircle,
  refunded: CreditCard,
};

const statusColors: Record<OrderStatusType, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  confirmed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  processing:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  shipped:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  in_transit:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  returned:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  refunded:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

const statusLabels: Record<OrderStatusType, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En traitement",
  shipped: "Expédiée",
  in_transit: "En transit",
  delivered: "Livrée",
  cancelled: "Annulée",
  returned: "Retournée",
  refunded: "Remboursée",
};

export default function OrderCard({
  order,
  variant = "default",
  showActions = true,
  showDetails = true,
  className = "",
  onView,
  onTrack,
  onCancel,
  onReorder,
  onShare,
  onPrint,
}: OrderCardProps) {
  const router = useRouter();
  const { success } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColor = statusColors[order.status] || statusColors.pending;
  const statusLabel = statusLabels[order.status] || "En attente";

  const handleView = useCallback(() => {
    if (onView) {
      onView(order);
    } else {
      router.push(`/orders/${order.id}`);
    }
  }, [order, onView, router]);

  const handleTrack = useCallback(() => {
    if (onTrack) {
      onTrack(order);
    } else if (order.trackingNumber) {
      router.push(`/tracking/${order.trackingNumber}`);
    }
  }, [order, onTrack, router]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      onCancel(order);
    }
  }, [order, onCancel]);

  const handleReorder = useCallback(async () => {
    if (onReorder) {
      onReorder(order);
    }
  }, [order, onReorder]);

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(order);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/orders/${order.id}`,
      );
      success("Lien copié dans le presse-papier");
    }
  }, [order, onShare, success]);

  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint(order);
    } else {
      window.print();
    }
  }, [order, onPrint]);

  const getStatusBadge = () => {
    const Icon = statusIcons[order.status] || Package;
    const isProcessing = order.status === "processing";

    return (
      <BadgeComponent
        className={cn("flex items-center space-x-1 border", statusColor)}
      >
        {isProcessing ? (
          <Icon className="w-3 h-3 animate-spin" />
        ) : (
          <Icon className="w-3 h-3" />
        )}
        <span>{statusLabel}</span>
      </BadgeComponent>
    );
  };

  // Version minimal
  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          className,
        )}
        onClick={handleView}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              #{order.id.slice(-8)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {order.items.length} article{order.items.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          {getStatusBadge()}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>
    );
  }

  // Version compact
  if (variant === "compact") {
    return (
      <Card className={cn("w-full", className)}>
        <CardBody className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  #{order.id.slice(-6)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {order.user?.username || "Client"}
                </p>
                <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {order.items.length} article
                    {order.items.length > 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(order.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              {getStatusBadge()}
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Version par défaut
  return (
    <Card className={cn("w-full hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                #{order.id.slice(-6)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Commande du {formatDate(order.createdAt)}
              </p>
              <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {order.user?.username || "Client"}
                </span>
                {order.user?.email && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <Mail className="w-3 h-3 flex-shrink-0 hidden sm:inline" />
                    <span className="hidden sm:inline truncate">
                      {order.user.email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            {getStatusBadge()}
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Articles
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {order.items.length} article{order.items.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 min-w-0">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 min-w-0">
            <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Paiement
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {order.paymentMethod || "Non renseigné"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 min-w-0">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Livraison
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {order.shippingAddress?.city || "Non renseignée"}
              </p>
            </div>
          </div>
        </div>

        {/* Détails expansibles */}
        {showDetails && (
          <>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {isExpanded ? "Masquer les détails" : "Voir les détails"}
              </span>
            </button>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {/* Articles */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Articles commandés
                  </p>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <span className="text-gray-600 dark:text-gray-400 truncate">
                        {item.quantity}x {item.product?.name || "Produit"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white flex-shrink-0 ml-2">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Adresse */}
                {order.shippingAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse de livraison
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.shippingAddress.street}
                      <br />
                      {order.shippingAddress.postalCode}{" "}
                      {order.shippingAddress.city}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                    {order.shippingAddress.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1 mt-1">
                        <Phone className="w-3 h-3" />
                        <span>{order.shippingAddress.phone}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardBody>

      {showActions && (
        <CardFooter className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleView}>
            <Eye className="w-4 h-4 mr-2" />
            Détails
          </Button>
          {order.trackingNumber && (
            <Button variant="outline" size="sm" onClick={handleTrack}>
              <Truck className="w-4 h-4 mr-2" />
              Suivre
            </Button>
          )}
          {(order.status === "pending" || order.status === "confirmed") && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              onClick={handleCancel}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          )}
          {order.status === "delivered" && (
            <Button variant="outline" size="sm" onClick={handleReorder}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-commander
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
