"use client";

import { cn } from "@/lib/utils";

interface ProductStockProps {
  stock: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showIcon?: boolean;
  showQuantity?: boolean;
}

export default function ProductStock({
  stock,
  className = "",
  size = "md",
  showLabel = true,
  showIcon = true,
  showQuantity = true,
}: ProductStockProps) {
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const getStatus = () => {
    if (isOutOfStock) {
      return {
        label: "Rupture de stock",
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/30",
        icon: "❌",
        border: "border-red-200 dark:border-red-800",
      };
    }
    if (isLowStock) {
      return {
        label: `Plus que ${stock} en stock`,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/30",
        icon: "⚠️",
        border: "border-orange-200 dark:border-orange-800",
      };
    }
    return {
      label: "En stock",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
      icon: "✅",
      border: "border-green-200 dark:border-green-800",
    };
  };

  const status = getStatus();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "px-2 py-0.5 rounded-full font-medium border",
          status.bg,
          status.color,
          status.border,
          sizeClasses[size],
        )}
      >
        {showIcon && <span className="mr-1">{status.icon}</span>}
        {showLabel && status.label}
      </span>
      {!isOutOfStock && showQuantity && stock > 10 && (
        <span
          className={cn("text-gray-500 dark:text-gray-400", sizeClasses[size])}
        >
          ({stock} disponibles)
        </span>
      )}
    </div>
  );
}
