"use client";

import { useState, useEffect } from "react";
import { useNotifications, useAuth, useToast } from "@/hooks";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/shared/EmptyState";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Package,
  Truck,
  CreditCard,
  MessageCircle,
  User,
  AlertCircle,
  ShoppingBag,
  Trash2,
} from "lucide-react";

const notificationIcons: Record<string, any> = {
  order: Package,
  payment: CreditCard,
  delivery: Truck,
  message: MessageCircle,
  user: User,
  system: AlertCircle,
  promotion: ShoppingBag,
};

const notificationColors: Record<string, string> = {
  order: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  payment:
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  delivery:
    "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  message:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  user: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  system: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  promotion: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
};

export default function NotificationsPage() {
  useAuth();
  const {
    notifications,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const { success, error: showError } = useToast();

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await loadNotifications();
    } catch (error) {
      showError("Erreur de chargement des notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      showError("Erreur");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      success("Toutes les notifications marquées comme lues");
    } catch (error) {
      showError("Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      success("Notification supprimée");
    } catch (error) {
      showError("Erreur");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Supprimer toutes les notifications ?")) return;
    try {
      // Supprimer une par une
      for (const notif of notifications) {
        await deleteNotification(notif.id);
      }
      success("Toutes les notifications supprimées");
    } catch (error) {
      showError("Erreur");
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bell className="w-6 h-6 mr-2 text-primary-600" />
            Notifications
            {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue
            {unreadCount > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAll}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Toutes ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Non lues ({unreadCount})
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("read")}
        >
          Lues ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Liste des notifications */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          title="Aucune notification"
          description="Vous n'avez pas encore de notifications."
          icon={<Bell className="w-16 h-16 text-gray-400" />}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = notificationIcons[notification.category] || Bell;
            const colorClass =
              notificationColors[notification.category] ||
              notificationColors.system;

            return (
              <Card
                key={notification.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  !notification.isRead && "border-l-4 border-l-primary-600",
                )}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        colorClass,
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={cn(
                              "font-medium",
                              notification.isRead
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-gray-900 dark:text-white",
                            )}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 text-gray-400 hover:text-primary-600"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Marquer comme lu"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 text-gray-400 hover:text-red-500"
                            onClick={() => handleDelete(notification.id)}
                            title="Supprimer"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {notification.link && (
                        <a
                          href={notification.link}
                          className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Voir les détails →
                        </a>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
