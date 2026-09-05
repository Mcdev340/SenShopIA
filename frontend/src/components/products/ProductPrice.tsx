"use client";

import { formatPrice, cn } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  salePrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
  showOriginal?: boolean;
  className?: string;
  currency?: string;
}

export default function ProductPrice({
  price,
  salePrice,
  size = "md",
  showDiscount = true,
  showOriginal = true,
  className = "",
  currency: _currency = "XOF",
}: ProductPriceProps) {
  const isOnSale =
    salePrice !== undefined && salePrice !== null && salePrice < price;
  const discountPercentage = isOnSale
    ? Math.round((1 - salePrice / price) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      price: "text-base",
      sale: "text-sm",
      original: "text-xs",
      discount: "text-xs",
    },
    md: {
      price: "text-xl",
      sale: "text-lg",
      original: "text-sm",
      discount: "text-sm",
    },
    lg: {
      price: "text-2xl",
      sale: "text-xl",
      original: "text-base",
      discount: "text-base",
    },
    xl: {
      price: "text-3xl",
      sale: "text-2xl",
      original: "text-lg",
      discount: "text-lg",
    },
  };

  return (
    <div className={cn("flex items-baseline flex-wrap gap-2", className)}>
      {isOnSale ? (
        <>
          <span
            className={cn(
              "font-bold text-primary-600 dark:text-primary-400",
              sizeClasses[size].price,
            )}
          >
            {formatPrice(salePrice)}
          </span>
          {showOriginal && (
            <span
              className={cn(
                "text-gray-400 line-through",
                sizeClasses[size].original,
              )}
            >
              {formatPrice(price)}
            </span>
          )}
          {showDiscount && (
            <span
              className={cn(
                "px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded font-medium",
                sizeClasses[size].discount,
              )}
            >
              -{discountPercentage}%
            </span>
          )}
        </>
      ) : (
        <span
          className={cn(
            "font-bold text-gray-900 dark:text-white",
            sizeClasses[size].price,
          )}
        >
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}
