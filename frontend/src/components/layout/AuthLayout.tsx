"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  className = "",
}: AuthLayoutProps) {
  return (
    <main
      className={cn(
        "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8",
        className,
      )}
    >
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="block text-center text-2xl font-bold text-primary-600 dark:text-primary-400"
        >
          ShopSense AI
        </Link>
        {(title || subtitle) && (
          <div className="text-center space-y-1">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}

export { AuthLayout };
