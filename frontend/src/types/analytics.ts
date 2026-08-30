export interface PageView {
  id: string;
  userId?: string;
  sessionId: string;
  page: string;
  title: string;
  referrer?: string;
  userAgent: string;
  ip: string;
  device: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  os: string;
  screenResolution: string;
  viewport: string;
  timestamp: Date;
  duration?: number;
}

export interface UserSession {
  id: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pages: string[];
  actions: UserAction[];
  device: string;
  browser: string;
  os: string;
  country?: string;
  city?: string;
}

export interface UserAction {
  id: string;
  sessionId: string;
  userId?: string;
  type: 'view' | 'click' | 'scroll' | 'search' | 'add_cart' | 'remove_cart' | 'checkout' | 'purchase' | 'share';
  target: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  event: string;
  category?: string;
  label?: string;
  value?: number;
  properties: Record<string, any>;
  timestamp: Date;
}

export interface ConversionFunnel {
  step: string;
  count: number;
  percentage: number;
  dropOff: number;
}

export interface UserRetention {
  date: Date;
  newUsers: number;
  returningUsers: number;
  retentionRate: number;
  cohorts: {
    cohort: string;
    users: number;
    retention: number[];
  }[];
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueByDay: { date: string; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  revenueByYear: { year: string; revenue: number }[];
  averageOrderValue: number;
  projectedRevenue: number;
  growthRate: number;
}

export interface ProductAnalytics {
  id: string;
  name: string;
  views: number;
  clicks: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  churnedUsers: number;
  engagementRate: number;
  averageSessionDuration: number;
  usersByDevice: { device: string; count: number }[];
  usersByCountry: { country: string; count: number }[];
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'warning' | 'critical';
  timestamp: Date;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  variant: string;
  hypothesis: string;
  metrics: string[];
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  results: {
    variant: string;
    conversions: number;
    conversionRate: number;
    confidence: number;
    improvement: number;
  }[];
}

export interface AnalyticsExport {
  id: string;
  type: 'report' | 'data' | 'dashboard';
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  filters: Record<string, any>;
  url: string;
  createdAt: Date;
  expiresAt: Date;
}