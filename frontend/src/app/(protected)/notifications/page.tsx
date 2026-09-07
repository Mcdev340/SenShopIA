'use client';

import { useState, useEffect } from 'react';
import { useNotifications, useAuth } from '@/hooks';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
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
} from 'lucide-react';

const notificationIcons = {
  order: Package,
  payment: CreditCard,
  delivery: Truck,
  message: MessageCircle,
  user: User,
  system: AlertCircle,
  promotion: ShoppingBag,
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  if (loading) {
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
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Non lues
          {unreadCount > 0 && (
            <Badge className="ml-2">{unreadCount}</Badge>
          )}
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('read')}
        >
          Lues
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

            return (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all hover:shadow-md',
                  !notification.isRead && 'border-l-4 border-l-primary-600'
                )}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      notification.isRead ? 'bg-gray-100 dark:bg-gray-800' : 'bg-primary-100 dark:bg-primary-900/30'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5',
                        notification.isRead ? 'text-gray-400' : 'text-primary-600 dark:text-primary-400'
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn(
                            'font-medium',
                            notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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