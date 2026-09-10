'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useAuth, useToast } from '@/hooks';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowLeft, Lock, Shield } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, loading, total, loadCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!authLoading && !isAuthenticated) {
        router.push('/login?redirect=/checkout');
        return;
      }
      await loadCart();
      setIsLoading(false);
    };
    init();
  }, [authLoading, isAuthenticated, router, loadCart]);

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [isLoading, items, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="warning" title="Panier vide">
          Votre panier est vide. Ajoutez des produits avant de passer commande.
          <div className="mt-4">
            <Button onClick={() => router.push('/products')}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Voir les produits
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/cart')}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au panier
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paiement
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Finalisez votre commande en toute sécurité
        </p>
      </div>

      {/* Security badges */}
      <div className="flex items-center gap-4 mb-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Paiement sécurisé SSL
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Protection des données
        </div>
      </div>

      {/* Checkout Form */}
      <CheckoutForm
        onSuccess={(orderId) => {
          router.push(`/orders/${orderId}`);
        }}
        onError={(error) => {
          showError(error);
        }}
      />
    </div>
  );
}