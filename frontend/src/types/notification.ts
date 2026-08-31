export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export enum NotificationChannel {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
}

export enum NotificationCategory {
  ORDER = "order",
  PAYMENT = "payment",
  DELIVERY = "delivery",
  PRODUCT = "product",
  PROMOTION = "promotion",
  SYSTEM = "system",
  SUPPORT = "support",
  SECURITY = "security",
  SOCIAL = "social",
  REMINDER = "reminder",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  body?: string;
  link?: string;
  image?: string;
  icon?: string;
  isRead: boolean;
  isDismissed: boolean;
  metadata?: Record<string, any>;
  actions?: NotificationAction[];
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
  expiresAt?: Date;
}

export interface NotificationAction {
  id: string;
  label: string;
  url?: string;
  action?: string;
  data?: Record<string, any>;
  primary?: boolean;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    [NotificationChannel.EMAIL]: {
      enabled: boolean;
      frequency: "instant" | "daily" | "weekly" | "never";
    };
    [NotificationChannel.SMS]: {
      enabled: boolean;
      frequency: "instant" | "daily" | "never";
    };
    [NotificationChannel.PUSH]: {
      enabled: boolean;
      frequency: "instant" | "daily" | "never";
      sound: boolean;
      vibration: boolean;
    };
    [NotificationChannel.IN_APP]: {
      enabled: boolean;
      frequency: "instant" | "never";
      popup: boolean;
      sound: boolean;
    };
  };
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      channels: NotificationChannel[];
    };
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  updatedAt: Date;
}

export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  deviceInfo?: {
    platform: "web" | "ios" | "android";
    browser?: string;
    os?: string;
    model?: string;
    version?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  expiredAt?: Date;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  sound?: string;
  clickAction?: string;
  data?: Record<string, any>;
  actions?: {
    action: string;
    title: string;
    icon?: string;
  }[];
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number | number[];
  renotify?: boolean;
  priority?: "normal" | "high";
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: NotificationCategory;
  subject?: string;
  template: string;
  variables: string[];
  channels: NotificationChannel[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationStats {
  total: number;
  read: number;
  unread: number;
  dismissed: number;
  byType: {
    [key in NotificationType]: number;
  };
  byCategory: {
    [key in NotificationCategory]: number;
  };
  byPriority: {
    [key in NotificationPriority]: number;
  };
  dailyStats: {
    date: string;
    count: number;
    read: number;
  }[];
}

export interface NotificationFilter {
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  isRead?: boolean;
  isDismissed?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "priority" | "type";
  sortOrder?: "asc" | "desc";
}

export interface EmailNotification {
  id: string;
  userId: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: {
    filename: string;
    content: string;
    contentType: string;
  }[];
  status: "queued" | "sent" | "failed" | "bounced" | "opened" | "clicked";
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SMSNotification {
  id: string;
  userId: string;
  to: string;
  from?: string;
  message: string;
  status: "queued" | "sent" | "failed" | "delivered" | "read";
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  image?: string;
  status: "queued" | "sent" | "failed" | "delivered" | "opened" | "dismissed";
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  dismissedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationGroup {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  notifications: Notification[];
  count: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationBanner {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  image?: string;
  cta?: {
    label: string;
    action: string;
    data?: Record<string, any>;
  };
  isActive: boolean;
  dismissible: boolean;
  expiresAt?: Date;
  priority: NotificationPriority;
  segments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSubscription {
  id: string;
  userId: string;
  topic: string;
  channel: NotificationChannel;
  preferences: {
    enabled: boolean;
    frequency: "instant" | "daily" | "weekly";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationWebhook {
  id: string;
  url: string;
  secret?: string;
  events: NotificationType[];
  isActive: boolean;
  lastSent?: Date;
  lastStatus?: number;
  errorCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  recipient: string;
  status:
    | "pending"
    | "sent"
    | "delivered"
    | "failed"
    | "bounced"
    | "opened"
    | "clicked";
  attempts: number;
  lastAttempt?: Date;
  error?: string;
  metadata?: Record<string, any>;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  userId: string;
  email: {
    enabled: boolean;
    digest: boolean;
    digestFrequency: "daily" | "weekly" | "monthly";
    marketing: boolean;
    transactional: boolean;
  };
  sms: {
    enabled: boolean;
    marketing: boolean;
    transactional: boolean;
  };
  push: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    badge: boolean;
    marketing: boolean;
    transactional: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
  };
  inApp: {
    enabled: boolean;
    popup: boolean;
    sound: boolean;
    marketing: boolean;
    transactional: boolean;
  };
  updatedAt: Date;
}

export interface NotificationAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounceRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  byChannel: {
    [key in NotificationChannel]: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      converted: number;
    };
  };
  byType: {
    [key in NotificationType]: {
      sent: number;
      opened: number;
      clicked: number;
    };
  };
  byHour: {
    hour: number;
    sent: number;
    opened: number;
    clicked: number;
  }[];
}

export interface NotificationScheduler {
  id: string;
  notification: Partial<Notification>;
  scheduledAt: Date;
  recurring: "none" | "daily" | "weekly" | "monthly";
  recurringPattern?: {
    dayOfWeek?: number;
    dayOfMonth?: number;
    hour?: number;
    minute?: number;
  };
  status: "pending" | "processing" | "sent" | "failed" | "cancelled";
  lastRun?: Date;
  nextRun?: Date;
  totalRuns: number;
  successRuns: number;
  createdAt: Date;
  updatedAt: Date;
}
