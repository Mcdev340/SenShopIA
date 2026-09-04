'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice, cn } from '@/lib/utils';
import { Loader2, Tag, X, Shield, Truck, CreditCard } from 'lucide-react';

interface CartSummaryProps {
  compact?: boolean;
  className?: string;
  showCoupon?: boolean;
  showCheckout?: boolean;
  showFeatures?: boolean;
  onCheckout?: () => void;
  checkoutLoading?: boolean;
}

export default function CartSummary({
  compact = false,
  className = '',
  showCoupon = true,
  showCheckout = true,
  showFeatures = false,
  onCheckout,
  checkoutLoading = false,
}: CartSummaryProps) {
  const {
    items,
    subtotal,
    total,
    shippingCost,
    tax,
    discount,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    loading,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(false);
    try {
      const success = await applyCoupon(couponInput.trim().toUpperCase());
      if (success) {
        setCouponInput('');
        setCouponSuccess(true);
      } else {
        setCouponError('Code promo invalide');
      }
    } catch (error) {
      setCouponError('Une erreur est survenue');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponSuccess(false);
  };

  const totalItems = [
    { 
      label: 'Sous-total', 
      value: subtotal, 
      description: `${itemCount} article${itemCount > 1 ? 's' : ''}`
    },
    { 
      label: 'Livraison', 
      value: shippingCost, 
      highlight: shippingCost === 0,
      description: shippingCost === 0 ? 'Offerte' : 'Standard'
    },
    { 
      label: 'Taxes', 
      value: tax,
      description: 'TVA incluse'
    },
    { 
      label: 'Réduction', 
      value: -discount, 
      highlight: discount > 0,
      description: discount > 0 ? `-${formatPrice(discount)}` : 'Aucune'
    },
  ];

  // Version compacte pour le drawer
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="space-y-1.5">
          {totalItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={cn(
                'font-medium text-gray-900 dark:text-white',
                item.highlight && 'text-green-600 dark:text-green-400'
              )}>
                {item.value >= 0 ? formatPrice(item.value) : `-${formatPrice(Math.abs(item.value))}`}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-base font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
          </div>
          {couponCode && (
            <div className="mt-1 text-xs text-green-600 dark:text-green-400">
              Coupon {couponCode} appliqué
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Coupon */}
      {showCoupon && (
        <div className="space-y-2">
          {couponCode ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {couponCode}
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  ({formatPrice(couponDiscount)} de réduction)
                </span>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                aria-label="Retirer le coupon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Code promo"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  disabled={isApplyingCoupon}
                  className="flex-1"
                  error={couponError || undefined}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="whitespace-nowrap"
                >
                  {isApplyingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Appliquer'
                  )}
                </Button>
              </div>
              {couponError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Coupon appliqué avec succès !
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Détails */}
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        {totalItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              {item.description && (
                <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                  ({item.description})
                </span>
              )}
            </div>
            <span className={cn(
              'font-medium text-gray-900 dark:text-white',
              item.highlight && 'text-green-600 dark:text-green-400'
            )}>
              {item.value >= 0 ? formatPrice(item.value) : `-${formatPrice(Math.abs(item.value))}`}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          TVA incluse
        </p>
        {couponCode && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Coupon {couponCode} appliqué (-{formatPrice(couponDiscount)})
          </p>
        )}
      </div>

      {/* Checkout */}
      {showCheckout && (
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={loading || checkoutLoading || items.length === 0}
        >
          {checkoutLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Passer à la caisse
            </>
          )}
        </Button>
      )}

      {/* Features */}
      {showFeatures && (
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Truck className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-auto" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Livraison offerte</p>
          </div>
          <div className="text-center">
            <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-auto" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paiement sécurisé</p>
          </div>
          <div className="text-center">
            <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-auto" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Meilleurs prix</p>
          </div>
        </div>
      )}
    </div>
  );
}