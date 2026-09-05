"use client";

import { useState } from "react";
import { useCart } from "@/hooks";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Truck,
  Shield,
  Clock,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CheckoutSummaryProps {
  className?: string;
  compact?: boolean;
  showDetails?: boolean;
  onToggleDetails?: () => void;
}

export default function CheckoutSummary({
  className = "",
  compact = false,
  showDetails: _showDetails = true,
  onToggleDetails,
}: CheckoutSummaryProps) {
  const {
    items,
    subtotal,
    total,
    shippingCost,
    discount,
    couponDiscount,
    couponCode,
  } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
    if (onToggleDetails) {
      onToggleDetails();
    }
  };

  if (compact) {
    return (
      <Card className={cn("w-full", className)}>
        <CardBody className="space-y-3 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Livraison</span>
            <span
              className={cn(
                "font-medium",
                shippingCost === 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-900 dark:text-white",
              )}
            >
              {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Réduction
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                -{formatPrice(discount)}
              </span>
            </div>
          )}
          {couponDiscount > 0 && couponCode && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Coupon ({couponCode})
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                -{formatPrice(couponDiscount)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-base font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-primary-600 dark:text-primary-400">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Résumé de la commande
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {items.length} article{items.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={toggleDetails}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={isExpanded ? "Réduire" : "Développer"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Articles */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-gray-500 dark:text-gray-400 w-6 text-center flex-shrink-0">
                  {item.quantity}x
                </span>
                <span className="text-gray-900 dark:text-white truncate">
                  {item.product.name}
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white flex-shrink-0 ml-2">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Détails (expandable) */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Sous-total
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Frais de livraison
              </span>
              <span
                className={cn(
                  "font-medium",
                  shippingCost === 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-900 dark:text-white",
                )}
              >
                {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Réduction
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -{formatPrice(discount)}
                </span>
              </div>
            )}
            {couponDiscount > 0 && couponCode && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Coupon ({couponCode})
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -{formatPrice(couponDiscount)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600 dark:text-primary-400">
              {formatPrice(total)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            TVA incluse
          </p>
        </div>

        {/* Garanties */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Truck className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>Livraison 24-48h</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Shield className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>Retour 14 jours</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Package className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>Suivi en temps réel</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
