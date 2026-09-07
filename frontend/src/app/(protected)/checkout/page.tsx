"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart, useAuth } from "@/hooks";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, loading } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push("/cart");
    }
  }, [loading, items, router]);

  if (authLoading || loading) {
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
          <Button className="mt-4" onClick={() => router.push("/products")}>
            Voir les produits
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paiement
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Finalisez votre commande en toute sécurité
        </p>
      </div>

      <CheckoutForm
        onSuccess={(orderId: string) => {
          router.push(`/orders/${orderId}`);
        }}
        onError={(error: string) => {
          console.error("Erreur de paiement:", error);
        }}
      />
    </div>
  );
}
