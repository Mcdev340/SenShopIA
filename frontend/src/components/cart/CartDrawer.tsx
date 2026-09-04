export default function CartDrawer() {
  return null;
}
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart, useUI } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CartEmpty } from './CartEmpty';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function CartDrawer({ isOpen, onClose, className }: CartDrawerProps) {
  const { items, itemCount, loading, loadCart } = useCart();
  const [isClosing, setIsClosing] = useState(false);

  // Charger le panier à l'ouverture
  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen, loadCart]);

  // Fermer avec Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Empêcher le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out',
          isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full',
          className
        )}
        role="dialog"
        aria-label="Panier"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mon panier
            </h2>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-70px)]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1">
              <CartEmpty
                title="Votre panier est vide"
                message="Découvrez nos produits et trouvez ce qui vous plaît."
                buttonText="Découvrir les produits"
                buttonLink="/products"
              />
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} compact />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-4">
                <CartSummary compact />
                <Link href="/checkout" onClick={handleClose}>
                  <Button className="w-full" size="lg">
                    Passer à la caisse
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={handleClose}
                  className="block text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  Voir tout le panier
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}