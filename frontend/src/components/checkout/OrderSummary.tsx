"use client";

import { useCart } from "@/hooks";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Package, Truck, Shield, Clock, CreditCard, Tag } from "lucide-react";

interface OrderSummaryProps {
  className?: string;
  compact?: boolean;
  showShipping?: boolean;
  showDiscount?: boolean;
  showCoupon?: boolean;
  showItems?: boolean;
  showGuarantees?: boolean;
}

export default function OrderSummary({
  className = "",
  compact = false,
  showShipping = true,
  showDiscount = true,
  showCoupon = true,
  showItems = true,
  showGuarantees = true,
}: OrderSummaryProps) {
  const {
    items,
    subtotal,
    total,
    shippingCost,
    discount,
    couponDiscount,
    couponCode,
  } = useCart();

  const orderItems = [
    { label: "Sous-total", value: subtotal },
    ...(showShipping ? [{ label: "Livraison", value: shippingCost }] : []),
    ...(showDiscount && discount > 0
      ? [{ label: "Réduction", value: -discount }]
      : []),
    ...(showCoupon && couponDiscount > 0
      ? [{ label: "Coupon", value: -couponDiscount }]
      : []),
  ];

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="space-y-2">
          {orderItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
              <span
                className={cn(
                  "font-medium",
                  item.value < 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-900 dark:text-white",
                )}
              >
                {item.value >= 0
                  ? formatPrice(item.value)
                  : `-${formatPrice(Math.abs(item.value))}`}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-base font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600 dark:text-primary-400">
              {formatPrice(total)}
            </span>
          </div>
          {couponCode && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Coupon {couponCode} appliqué
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Récapitulatif de la commande
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {items.length} article{items.length > 1 ? "s" : ""}
        </p>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Articles */}
        {showItems && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-center flex-shrink-0">
                    {item.quantity}x
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white truncate">
                    {item.product.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white flex-shrink-0 ml-2">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Totaux */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
          {orderItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
              <span
                className={cn(
                  "font-medium",
                  item.value < 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-900 dark:text-white",
                )}
              >
                {item.value >= 0
                  ? formatPrice(item.value)
                  : `-${formatPrice(Math.abs(item.value))}`}
              </span>
            </div>
          ))}
        </div>

        {/* Total final */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900 dark:text-white">Total à payer</span>
            <span className="text-primary-600 dark:text-primary-400">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              TVA incluse
            </p>
            {couponCode && (
              <span className="text-xs text-green-600 dark:text-green-400">
                <Tag className="w-3 h-3 inline mr-0.5" />
                Coupon {couponCode} (-{formatPrice(couponDiscount)})
              </span>
            )}
          </div>
        </div>

        {/* Garanties */}
        {showGuarantees && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
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
              <CreditCard className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>Paiement flexible</span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
