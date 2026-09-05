"use client";

import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowRight, Loader2 } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "pink";
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const colorClasses = {
  primary: {
    bg: "bg-primary-50 dark:bg-primary-900/20",
    text: "text-primary-600 dark:text-primary-400",
    icon: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
    border: "border-primary-200 dark:border-primary-800",
  },
  secondary: {
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    icon: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    icon: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
    icon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  danger: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    text: "text-pink-600 dark:text-pink-400",
    icon: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
  },
};

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  subtitle,
  color = "primary",
  onClick,
  className = "",
  loading = false,
  children,
}: StatsCardProps) {
  const colors = colorClasses[color];
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;
  const isNeutralTrend = trend && trend === 0;

  return (
    <Card
      className={cn(
        "w-full transition-all duration-300 border",
        colors.border,
        onClick && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      <CardBody className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {value}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl flex-shrink-0", colors.icon)}>
            {icon}
          </div>
        </div>

        {(trend !== undefined || trendLabel) && (
          <div className="mt-4 flex items-center flex-wrap gap-2">
            {trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                  isPositiveTrend
                    ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                    : isNegativeTrend
                      ? "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                      : "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
                )}
              >
                {isPositiveTrend && <TrendingUp className="w-3 h-3 mr-1" />}
                {isNegativeTrend && <TrendingDown className="w-3 h-3 mr-1" />}
                {isNeutralTrend && "="}
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
            {trendLabel && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {trendLabel}
              </span>
            )}
            {onClick && (
              <ArrowRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
            )}
          </div>
        )}

        {children}
      </CardBody>
    </Card>
  );
}
