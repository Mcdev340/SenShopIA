"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: React.ReactNode;
  status?: "online" | "offline" | "away" | "busy";
}

const sizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { src, alt = "Avatar", size = "md", fallback, status, className, ...props },
    ref,
  ) => {
    const [error, setError] = React.useState(false);

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const initials = getInitials(alt);

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex", className)}
        {...props}
      >
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
            sizes[size],
          )}
        >
          {src && !error ? (
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              onError={() => setError(true)}
              sizes={`${parseInt(sizes[size].split("h-")[1]) * 4}px`}
            />
          ) : fallback ? (
            fallback
          ) : (
            <span aria-hidden="true" className="font-medium">
              {initials}
            </span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-gray-900",
              statusColors[status],
              size === "xs"
                ? "h-1.5 w-1.5"
                : size === "sm"
                  ? "h-2 w-2"
                  : "h-3 w-3",
            )}
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
