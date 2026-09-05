"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import {
  ShoppingBag,
  User,
  Package,
  CreditCard,
  Truck,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

const AvatarComponent = Avatar as any;

interface Activity {
  id: string;
  type:
    | "order"
    | "user"
    | "product"
    | "payment"
    | "delivery"
    | "message"
    | "system";
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    id?: string;
    name: string;
    avatar?: string;
  };
  status?: "completed" | "pending" | "failed" | "processing";
  link?: string;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities: Activity[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  loading?: boolean;
  onViewAll?: () => void;
  onActivityClick?: (activity: Activity) => void;
}

const activityIcons = {
  order: {
    icon: ShoppingBag,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
  },
  user: {
    icon: User,
    color: "text-green-500 bg-green-100 dark:bg-green-900/20",
  },
  product: {
    icon: Package,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/20",
  },
  payment: {
    icon: CreditCard,
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900/20",
  },
  delivery: {
    icon: Truck,
    color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20",
  },
  message: {
    icon: MessageCircle,
    color: "text-pink-500 bg-pink-100 dark:bg-pink-900/20",
  },
  system: {
    icon: AlertCircle,
    color: "text-gray-500 bg-gray-100 dark:bg-gray-800",
  },
};

const statusColors = {
  completed: "text-green-500 bg-green-100 dark:bg-green-900/20",
  pending: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20",
  failed: "text-red-500 bg-red-100 dark:bg-red-900/20",
  processing: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: AlertCircle,
  processing: Loader2,
};

const statusLabels = {
  completed: "Terminé",
  pending: "En attente",
  failed: "Échoué",
  processing: "En cours",
};

export default function RecentActivity({
  activities,
  title = "Activités récentes",
  subtitle = "Dernières actions sur la plateforme",
  limit = 5,
  showViewAll = true,
  className = "",
  loading = false,
  onViewAll,
  onActivityClick,
}: RecentActivityProps) {
  const [expanded, setExpanded] = useState(false);

  const displayActivities = expanded ? activities : activities.slice(0, limit);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  const handleActivityClick = (activity: Activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activities.length > limit && (
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Réduire
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Voir plus
                  </>
                )}
              </Button>
            )}
            {showViewAll && (
              <Button
                variant="outline"
                size="sm"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                onClick={handleViewAll}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          {loading ? (
            // Skeleton loading
            Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))
          ) : displayActivities.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucune activité récente
              </p>
            </div>
          ) : (
            displayActivities.map((activity) => {
              const Icon =
                activityIcons[activity.type]?.icon || activityIcons.system.icon;
              const iconColor =
                activityIcons[activity.type]?.color ||
                activityIcons.system.color;
              const StatusIcon = activity.status
                ? statusIcons[activity.status]
                : null;
              const statusColor = activity.status
                ? statusColors[activity.status]
                : "";

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-start space-x-4 p-3 rounded-lg transition-colors cursor-pointer",
                    "hover:bg-gray-50 dark:hover:bg-gray-800",
                  )}
                  onClick={() => handleActivityClick(activity)}
                >
                  {/* Icône */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      iconColor,
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      {activity.status && StatusIcon && (
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            statusColor,
                          )}
                        >
                          <StatusIcon className="w-3 h-3 mr-0.5" />
                          {statusLabels[activity.status]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.description}
                    </p>
                    {activity.user && (
                      <div className="flex items-center space-x-2 mt-1">
                        <AvatarComponent
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          size="xs"
                        />
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {activity.user.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                    {activity.link && (
                      <Eye className="w-3 h-3 text-gray-400 mt-1" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export const useDefaultActivities = () => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "order",
      title: "Nouvelle commande #1234",
      description: "Commande de 3 articles par Jean Dupont",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "completed",
      user: { id: "user1", name: "Jean Dupont", avatar: "" },
      link: "/dashboard/admin/orders/1234",
    },
    {
      id: "2",
      type: "user",
      title: "Nouvel utilisateur inscrit",
      description: "Marie Diop a créé un compte",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: "completed",
      user: { id: "user2", name: "Marie Diop", avatar: "" },
    },
    {
      id: "3",
      type: "payment",
      title: "Paiement reçu #1234",
      description: "25 000 FCFA pour la commande #1234",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "completed",
    },
    {
      id: "4",
      type: "delivery",
      title: "Livraison en cours",
      description: "Colis #456 en route vers Dakar",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: "processing",
    },
    {
      id: "5",
      type: "message",
      title: "Nouveau message support",
      description: "Ticket #789: Problème de paiement",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "pending",
    },
  ];

  return activities;
};
