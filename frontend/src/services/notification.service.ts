import { apiClient } from '@/lib/api-client';
import {
  Notification as AppNotification,
  NotificationType,
  NotificationPreferences,
  PushSubscription,
  NotificationChannel,} from '@/types/notification';

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ============ NOTIFICATIONS ============

  async getNotifications(params?: {
    isRead?: boolean;
    type?: NotificationType;
    page?: number;
    limit?: number;
  }): Promise<{
    notifications: AppNotification[];
    total: number;
    page: number;
    totalPages: number;
    unreadCount: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/notifications/?${queryParams.toString()}`);
  }

  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>('/notifications/unread/count/');
  }

  async markAsRead(id: string): Promise<void> {
    return apiClient.post(`/notifications/${id}/read/`);
  }

  async markAllAsRead(): Promise<void> {
    return apiClient.post('/notifications/mark-all-read/');
  }

  async markMultipleAsRead(ids: string[]): Promise<void> {
    return apiClient.post('/notifications/mark-read/', { ids });
  }

  async deleteNotification(id: string): Promise<void> {
    return apiClient.delete(`/notifications/${id}/`);
  }

  async deleteAllNotifications(): Promise<void> {
    return apiClient.delete('/notifications/');
  }

  async clearReadNotifications(): Promise<void> {
    return apiClient.delete('/notifications/read/');
  }

  // ============ PREFERENCES ============

  async getPreferences(): Promise<NotificationPreferences> {
    return apiClient.get<NotificationPreferences>('/notifications/preferences/');
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return apiClient.patch<NotificationPreferences>('/notifications/preferences/', preferences);
  }

  async updateChannelPreference(
    channel: NotificationChannel,
    type: 'orderUpdates' | 'promotions' | 'deliveryUpdates' | 'systemUpdates',
    enabled: boolean
  ): Promise<NotificationPreferences> {
    return apiClient.patch<NotificationPreferences>('/notifications/preferences/channel/', {
      channel,
      type,
      enabled,
    });
  }

  // ============ PUSH NOTIFICATIONS ============

  async registerPushSubscription(subscription: PushSubscription): Promise<void> {
    return apiClient.post('/notifications/push/register/', subscription);
  }

  async unregisterPushSubscription(endpoint: string): Promise<void> {
    return apiClient.post('/notifications/push/unregister/', { endpoint });
  }

  async getPushSubscriptions(): Promise<PushSubscription[]> {
    return apiClient.get<PushSubscription[]>('/notifications/push/subscriptions/');
  }

  // ============ SEND NOTIFICATIONS ============

  async sendTestNotification(channel: NotificationChannel): Promise<void> {
    return apiClient.post('/notifications/test/', { channel });
  }

  async sendBroadcastNotification(data: {
    title: string;
    message: string;
    type: NotificationType;
    channels?: NotificationChannel[];
    targetUsers?: string[];
    targetRoles?: string[];
    link?: string;
    image?: string;
  }): Promise<{ sent: number; failed: number }> {
    return apiClient.post('/notifications/broadcast/', data);
  }

  // ============ BROWSER NOTIFICATIONS ============

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      this.permission = 'denied';
      return 'denied';
    }

    this.permission = await Notification.requestPermission();
    return this.permission;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  async sendBrowserNotification(
    title: string,
    options?: {
      body?: string;
      icon?: string;
      image?: string;
      badge?: string;
      sound?: string;
      data?: any;
      actions?: { action: string; title: string; icon?: string }[];
      tag?: string;
      requireInteraction?: boolean;
      silent?: boolean;
      timestamp?: number;
    }
  ): Promise<Notification | null> {
    if (this.permission === 'granted') {
      return new Notification(title, {
        ...options,
        icon: options?.icon || '/icons/icon-192x192.png',
      });
    }
    return null;
  }

  // ============ EMAIL NOTIFICATIONS ============

  async subscribeToEmail(email: string, preferences?: string[]): Promise<void> {
    return apiClient.post('/notifications/email/subscribe/', { email, preferences });
  }

  async unsubscribeFromEmail(email: string): Promise<void> {
    return apiClient.post('/notifications/email/unsubscribe/', { email });
  }

  async getEmailSubscriptions(): Promise<{ email: string; preferences: string[] }[]> {
    return apiClient.get('/notifications/email/subscriptions/');
  }

  // ============ SMS NOTIFICATIONS ============

  async subscribeToSms(phone: string): Promise<void> {
    return apiClient.post('/notifications/sms/subscribe/', { phone });
  }

  async unsubscribeFromSms(phone: string): Promise<void> {
    return apiClient.post('/notifications/sms/unsubscribe/', { phone });
  }

  // ============ IN-APP NOTIFICATIONS ============

  async getNotificationSettings(): Promise<{
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
  }> {
    return apiClient.get('/notifications/settings/');
  }

  async updateNotificationSettings(settings: {
    pushEnabled?: boolean;
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    inAppEnabled?: boolean;
  }): Promise<void> {
    return apiClient.patch('/notifications/settings/', settings);
  }

  // ============ UTILITY ============

  async getNotificationTypes(): Promise<NotificationType[]> {
    return apiClient.get('/notifications/types/');
  }

  async getNotificationTemplates(): Promise<{
    id: string;
    name: string;
    template: string;
    variables: string[];
  }[]> {
    return apiClient.get('/notifications/templates/');
  }
}

export const notificationService = NotificationService.getInstance();