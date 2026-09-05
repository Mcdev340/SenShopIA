"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ProductVariant as ProductVariantType } from "@/types/product";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ProductVariantProps {
  variants: ProductVariantType[];
  selectedId?: string | null;
  onSelect?: (variantId: string) => void;
  className?: string;
  label?: string;
  showPrice?: boolean;
  showStock?: boolean;
}

export default function ProductVariant({
  variants,
  selectedId,
  onSelect,
  className = "",
  label = "Variantes",
  showPrice = true,
  showStock = false,
}: ProductVariantProps) {
  const [selected, setSelected] = useState<string | null>(selectedId || null);

  const handleSelect = useCallback(
    (variantId: string) => {
      const variant = variants.find((v) => v.id === variantId);
      if (variant && variant.stock > 0) {
        setSelected(variantId);
        if (onSelect) {
          onSelect(variantId);
        }
      }
    },
    [variants, onSelect],
  );

  // Grouper par attribut
  const attributes = useMemo(() => {
    const result: Record<string, Set<string>> = {};
    variants.forEach((variant) => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!result[key]) result[key] = new Set();
        result[key].add(value);
      });
    });
    return result;
  }, [variants]);

  // Trouver le prix du variant sélectionné
  const selectedVariant = variants.find((v) => v.id === selected);

  if (variants.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
        {showPrice && selectedVariant && selectedVariant.price && (
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
              minimumFractionDigits: 0,
            }).format(selectedVariant.price)}
          </p>
        )}
      </div>

      {Object.entries(attributes).map(([attribute, values]) => (
        <div key={attribute}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 capitalize">
            {attribute}
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              const variant = variants.find(
                (v) => v.attributes[attribute] === value,
              );
              const isSelected = variant?.id === selected;
              const isDisabled = variant?.stock === 0;
              const isOutOfStock = variant?.stock === 0;

              return (
                <button
                  key={`${attribute}-${value}`}
                  onClick={() => variant && handleSelect(variant.id)}
                  disabled={isDisabled}
                  className={cn(
                    "relative px-3 py-1.5 text-sm rounded-lg border transition-all",
                    isSelected
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800",
                    isDisabled &&
                      "opacity-50 cursor-not-allowed line-through bg-gray-100 dark:bg-gray-800",
                  )}
                >
                  {value}
                  {isSelected && !isDisabled && (
                    <Check className="absolute -top-1 -right-1 w-3 h-3 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-900 rounded-full" />
                  )}
                  {isOutOfStock && (
                    <X className="absolute -top-1 -right-1 w-3 h-3 text-red-500 bg-white dark:bg-gray-900 rounded-full" />
                  )}
                  {showStock && !isDisabled && variant && (
                    <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                      ({variant.stock})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
