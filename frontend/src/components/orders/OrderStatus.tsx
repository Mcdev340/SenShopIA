"use client";

import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  CreditCard,
  Loader2,
  Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type OrderStatusType =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

interface OrderStatusProps {
  status: OrderStatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  showProgress?: boolean;
  className?: string;
}

const statusConfig: Record<
  OrderStatusType,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
    progress: number;
    step: number;
  }
> = {
  pending: {
    label: "En attente",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    progress: 10,
    step: 0,
  },
  confirmed: {
    label: "Confirmée",
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    progress: 25,
    step: 1,
  },
  processing: {
    label: "En traitement",
    icon: Loader2,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    progress: 40,
    step: 2,
  },
  shipped: {
    label: "Expédiée",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    progress: 60,
    step: 3,
  },
  in_transit: {
    label: "En transit",
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    progress: 75,
    step: 4,
  },
  delivered: {
    label: "Livrée",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800",
    progress: 100,
    step: 5,
  },
  cancelled: {
    label: "Annulée",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    borderColor: "border-red-200 dark:border-red-800",
    progress: 0,
    step: -1,
  },
  returned: {
    label: "Retournée",
    icon: AlertCircle,
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
    progress: 50,
    step: 4,
  },
  refunded: {
    label: "Remboursée",
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    progress: 100,
    step: 6,
  },
};

const statusSteps: OrderStatusType[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "in_transit",
  "delivered",
];

export default function OrderStatus({
  status,
  label,
  size = "md",
  showIcon = true,
  showLabel = true,
  showProgress = true,
  className = "",
}: OrderStatusProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isProcessing = status === "processing";
  const isCancelled = status === "cancelled";
  const isCompleted = status === "delivered" || status === "refunded";

  const sizeClasses = {
    sm: {
      container: "gap-2",
      icon: "w-4 h-4",
      text: "text-xs",
      badge: "px-2 py-0.5 text-xs",
      progress: "h-1",
    },
    md: {
      container: "gap-3",
      icon: "w-5 h-5",
      text: "text-sm",
      badge: "px-3 py-1 text-sm",
      progress: "h-1.5",
    },
    lg: {
      container: "gap-4",
      icon: "w-6 h-6",
      text: "text-base",
      badge: "px-4 py-1.5 text-base",
      progress: "h-2",
    },
  };

  const getStatusColor = (status: OrderStatusType) => {
    if (status === "cancelled")
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    if (status === "delivered" || status === "refunded")
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
    if (status === "in_transit")
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
    if (status === "shipped")
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    if (status === "processing")
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    if (status === "confirmed")
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    if (status === "returned")
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
  };

  const statusIndex = statusSteps.indexOf(status);
  const currentStep = statusIndex >= 0 ? statusIndex : 0;

  const renderBadge = () => (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-full border font-medium",
        sizeClasses[size].badge,
        getStatusColor(status),
      )}
    >
      {showIcon && (
        <StatusIcon
          className={cn(sizeClasses[size].icon, isProcessing && "animate-spin")}
        />
      )}
      {showLabel && (
        <span className={sizeClasses[size].text}>{label || config.label}</span>
      )}
    </div>
  );

  const renderProgress = () => {
    if (!showProgress || isCancelled || status === "returned") return null;

    return (
      <div className="hidden sm:block flex-1 max-w-xs ml-4">
        <div className="relative">
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
            <span>Début</span>
            <span>En cours</span>
            <span>Terminé</span>
          </div>
          <div
            className={cn(
              "mt-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
              sizeClasses[size].progress,
            )}
          >
            <div
              className={cn(
                "h-full transition-all duration-700 rounded-full",
                isCompleted
                  ? "bg-green-500"
                  : config.color.replace("text-", "bg-"),
              )}
              style={{ width: `${config.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStep;
              const stepConfig = statusConfig[step];
              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                      isActive
                        ? `${stepConfig.bgColor} ${stepConfig.color} border-${stepConfig.color.replace("text-", "")}`
                        : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
                    )}
                  >
                    {isActive && (
                      <Circle className="w-1.5 h-1.5 fill-current" />
                    )}
                  </div>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 mt-0.5 hidden lg:block">
                    {stepConfig.label.substring(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex items-center",
        sizeClasses[size].container,
        className,
      )}
    >
      {renderBadge()}
      {renderProgress()}
    </div>
  );
}
