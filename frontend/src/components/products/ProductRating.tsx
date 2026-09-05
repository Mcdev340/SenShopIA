"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showCount?: boolean;
  showLabel?: boolean;
  className?: string;
  maxStars?: number;
}

export default function ProductRating({
  rating,
  count = 0,
  size = "md",
  showCount = true,
  showLabel = true,
  className = "",
  maxStars = 5,
}: ProductRatingProps) {
  const clampedRating = Math.max(0, Math.min(rating, maxStars));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: { star: "w-3 h-3", text: "text-xs", gap: "gap-0.5" },
    md: { star: "w-4 h-4", text: "text-sm", gap: "gap-0.5" },
    lg: { star: "w-5 h-5", text: "text-base", gap: "gap-1" },
    xl: { star: "w-6 h-6", text: "text-lg", gap: "gap-1" },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center", sizeClasses[size].gap)}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(
              "fill-yellow-400 text-yellow-400",
              sizeClasses[size].star,
            )}
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            className={cn(
              "fill-yellow-400 text-yellow-400",
              sizeClasses[size].star,
            )}
          />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(
              "text-gray-300 dark:text-gray-600",
              sizeClasses[size].star,
            )}
          />
        ))}
      </div>
      {showCount && count > 0 && (
        <span
          className={cn(
            "text-gray-500 dark:text-gray-400",
            sizeClasses[size].text,
          )}
        >
          ({count} avis)
        </span>
      )}
      {showLabel && (
        <span
          className={cn(
            "text-gray-500 dark:text-gray-400 font-medium",
            sizeClasses[size].text,
          )}
        >
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
