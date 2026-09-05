"use client";

import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/hooks";
import {
  MapPin,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Share2,
  Printer,
  Mail,
  Copy,
  Check,
  Loader2,
  XCircle,
  Phone,
  MessageCircle,
} from "lucide-react";

const BadgeComponent = Badge as any;

interface TrackingEvent {
  id: string;
  status:
    | "preparing"
    | "picked_up"
    | "in_transit"
    | "customs"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned";
  location: string;
  description: string;
  timestamp: Date;
}

interface OrderTrackingProps {
  trackingNumber: string;
  carrier?: string;
  carrierPhone?: string;
  status:
    | "preparing"
    | "picked_up"
    | "in_transit"
    | "customs"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned";
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  history: TrackingEvent[];
  className?: string;
  onRefresh?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  onNotify?: () => void;
  onContact?: () => void;
}

const statusConfig = {
  preparing: {
    label: "Préparation",
    icon: Package,
    color: "bg-gray-500",
    textColor: "text-gray-500",
  },
  picked_up: {
    label: "Collecté",
    icon: Package,
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  in_transit: {
    label: "En transit",
    icon: Truck,
    color: "bg-orange-500",
    textColor: "text-orange-500",
  },
  customs: {
    label: "Douane",
    icon: AlertCircle,
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  out_for_delivery: {
    label: "En livraison",
    icon: Truck,
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
  delivered: {
    label: "Livré",
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  failed: {
    label: "Échec de livraison",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-500",
  },
  returned: {
    label: "Retourné",
    icon: Package,
    color: "bg-gray-500",
    textColor: "text-gray-500",
  },
};

export default function OrderTracking({
  trackingNumber,
  carrier = "ShopSense Express",
  carrierPhone = "+221 77 000 00 00",
  status,
  estimatedDelivery,
  actualDelivery,
  currentLocation,
  history,
  className = "",
  onRefresh,
  onShare,
  onPrint,
  onNotify,
  onContact,
}: OrderTrackingProps) {
  const { success } = useToast();
  const [trackingInput, setTrackingInput] = useState(trackingNumber);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setIsCopied(true);
      success("Numéro de suivi copié");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = trackingNumber;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setIsCopied(true);
      success("Numéro de suivi copié");
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [trackingNumber, success]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, [onRefresh]);

  const handleTrack = useCallback(() => {
    if (trackingInput && trackingInput !== trackingNumber) {
      window.location.href = `/tracking/${trackingInput}`;
    }
  }, [trackingInput, trackingNumber]);

  // Filtrer les événements pour la timeline
  const timelineEvents = history.map((event, index) => {
    const isLast = index === history.length - 1;
    const isCompleted =
      isLast && (status === "delivered" || status === "returned");
    const isCurrent = isLast && !isCompleted;
    const eventStatus = statusConfig[event.status];

    return {
      ...event,
      isCompleted,
      isCurrent,
      icon: eventStatus.icon,
      color: eventStatus.color,
      textColor: eventStatus.textColor,
    };
  });

  const getStatusBadgeColor = () => {
    const colors = {
      preparing:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      picked_up:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      in_transit:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      customs:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      out_for_delivery:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      returned: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    return colors[status] || colors.preparing;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suivi de colis
              </h3>
            </div>
            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>N° de suivi:</span>
              <span className="font-mono font-medium text-gray-900 dark:text-white">
                {trackingNumber}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="p-1 h-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <BadgeComponent
              className={cn("font-medium", getStatusBadgeColor())}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {currentStatus.label}
            </BadgeComponent>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Recherche de suivi */}
        <div className="flex gap-2">
          <Input
            placeholder="Entrez un numéro de suivi"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            className="flex-1"
          />
          <Button onClick={handleTrack}>
            <Search className="w-4 h-4 mr-2" />
            Suivre
          </Button>
        </div>

        {/* Statut actuel */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  currentStatus.color.replace("bg-", "bg-") + "/20",
                  "text-white",
                )}
              >
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Statut actuel
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentStatus.label}
                </p>
                {carrier && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transporteur: {carrier}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              {estimatedDelivery && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Livraison estimée
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatDateTime(estimatedDelivery)}
                  </p>
                </div>
              )}
              {actualDelivery && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Livré le
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatDateTime(actualDelivery)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Localisation actuelle */}
          {currentLocation && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {currentLocation.address}
              </span>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Historique de suivi
          </h4>
          <div className="space-y-0">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLast = index === timelineEvents.length - 1;
              const isCompleted =
                event.isCompleted || (isLast && status === "delivered");
              const isCurrent = event.isCurrent;

              return (
                <div key={event.id} className="relative">
                  {/* Ligne de connexion */}
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-5 top-10 w-0.5 h-12",
                        isCompleted
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600",
                      )}
                    />
                  )}

                  <div className="flex items-start space-x-4 py-3">
                    {/* Icône */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        isCompleted
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-800",
                        isCurrent &&
                          "ring-4 ring-primary-100 dark:ring-primary-900/30",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400 dark:text-gray-500",
                        )}
                      />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isCompleted
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400",
                            )}
                          >
                            {event.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(event.timestamp)}
                          </span>
                          {isCurrent && (
                            <BadgeComponent className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 animate-pulse">
                              En cours
                            </BadgeComponent>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" size="sm" onClick={onNotify}>
            <Mail className="w-4 h-4 mr-2" />
            Recevoir des notifications
          </Button>
          {carrierPhone && (
            <Button variant="outline" size="sm" onClick={onContact}>
              <Phone className="w-4 h-4 mr-2" />
              Contacter {carrier}
            </Button>
          )}
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat support
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
