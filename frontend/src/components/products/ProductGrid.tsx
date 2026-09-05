"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4 | 5;
  variant?: "default" | "compact" | "minimal";
  showActions?: boolean;
  showRating?: boolean;
  showStock?: boolean;
  showCategory?: boolean;
  showQuickView?: boolean;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  loading = false,
  columns = 4,
  variant = "default",
  showActions = true,
  showRating = true,
  showStock = true,
  showCategory = true,
  showQuickView = true,
  className = "",
  onAddToCart,
  onView,
  onWishlist,
  onQuickView,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const columnsClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-500 dark:text-gray-400">
          Chargement des produits...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Aucun produit"
        description="Aucun produit ne correspond à votre recherche."
        actionText="Voir tous les produits"
        actionLink="/products"
        icon={<div className="text-4xl">📦</div>}
      />
    );
  }

  return (
    <div className={cn("grid gap-4", columnsClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showActions={showActions}
          showRating={showRating}
          showStock={showStock}
          showCategory={showCategory}
          showQuickView={showQuickView}
          onAddToCart={onAddToCart}
          onView={onView}
          onWishlist={onWishlist}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
