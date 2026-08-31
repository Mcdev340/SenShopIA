import { apiClient } from '@/lib/api-client';
import {
  PageView,
  UserAction,
  AnalyticsEvent,
  ConversionFunnel,
  UserRetention,
  RevenueAnalytics,
  ProductAnalytics,
  UserAnalytics,
  PerformanceMetric,
  Test,
  AnalyticsExport,
} from '@/types/analytics';

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // ============ PAGE VIEWS ============

  async trackPageView(page: string, title?: string, referrer?: string): Promise<void> {
    const data = {
      page,
      title: title || document.title,
      referrer: referrer || document.referrer,
      sessionId: this.sessionId,
      url: window.location.href,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    };
    return apiClient.post('/analytics/page-view/', data);
  }

  async getPageViews(params?: {
    startDate?: Date;
    endDate?: Date;
    page?: string;
    userId?: string;
  }): Promise<PageView[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/page-views/?${queryParams.toString()}`);
  }

  async getPageViewStats(params?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<{
    total: number;
    unique: number;
    averageDuration: number;
    viewsByPage: { page: string; count: number }[];
    viewsByTime: { time: string; count: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/page-views/stats/?${queryParams.toString()}`);
  }

  // ============ USER ACTIONS ============

  async trackAction(action: Omit<UserAction, 'id' | 'sessionId' | 'timestamp'>): Promise<void> {
    return apiClient.post('/analytics/action/', {
      ...action,
      sessionId: this.sessionId,
    });
  }

  async getUserSessions(userId: string): Promise<any[]> {
    return apiClient.get(`/analytics/user/${userId}/sessions/`);
  }

  async getUserActions(userId: string, params?: {
    type?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<UserAction[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/user/${userId}/actions/?${queryParams.toString()}`);
  }

  // ============ EVENTS ============

  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'sessionId' | 'timestamp'>): Promise<void> {
    return apiClient.post('/analytics/event/', {
      ...event,
      sessionId: this.sessionId,
    });
  }

  async getEvents(params?: {
    event?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    limit?: number;
  }): Promise<AnalyticsEvent[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/events/?${queryParams.toString()}`);
  }

  async getEventStats(params?: {
    startDate?: Date;
    endDate?: Date;
    event?: string;
  }): Promise<{
    total: number;
    unique: number;
    eventsByType: { event: string; count: number }[];
    eventsByDay: { day: string; count: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/events/stats/?${queryParams.toString()}`);
  }

  // ============ CONVERSION FUNNEL ============

  async getConversionFunnel(funnelId: string, params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ConversionFunnel[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/funnels/${funnelId}/?${queryParams.toString()}`);
  }

  async getConversionRate(params?: {
    startDate?: Date;
    endDate?: Date;
    step?: string;
  }): Promise<{
    overall: number;
    steps: { step: string; rate: number; dropOff: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/conversion-rate/?${queryParams.toString()}`);
  }

  // ============ USER RETENTION ============

  async getUserRetention(days: number = 30): Promise<UserRetention[]> {
    return apiClient.get(`/analytics/retention/?days=${days}`);
  }

  async getCohortAnalysis(params?: {
    cohortType?: 'week' | 'month' | 'quarter';
    dateRange?: { start: Date; end: Date };
  }): Promise<{
    cohorts: { cohort: string; users: number; retention: number[] }[];
    periods: string[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/cohort/?${queryParams.toString()}`);
  }

  // ============ REVENUE ANALYTICS ============

  async getRevenueAnalytics(params?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Promise<RevenueAnalytics> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/revenue/?${queryParams.toString()}`);
  }

  async getRevenueByProduct(params?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<{ product: string; revenue: number; sold: number }[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/revenue/product/?${queryParams.toString()}`);
  }

  // ============ PRODUCT ANALYTICS ============

  async getProductAnalytics(productId: string, params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ProductAnalytics> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/product/${productId}/?${queryParams.toString()}`);
  }

  async getTopProducts(params?: {
    startDate?: Date;
    endDate?: Date;
    sortBy?: 'views' | 'sales' | 'revenue';
    limit?: number;
  }): Promise<ProductAnalytics[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/top-products/?${queryParams.toString()}`);
  }

  // ============ USER ANALYTICS ============

  async getUserAnalytics(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<UserAnalytics> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/users/?${queryParams.toString()}`);
  }

  // ============ PERFORMANCE METRICS ============

  async getPerformanceMetrics(params?: {
    startDate?: Date;
    endDate?: Date;
    type?: string;
  }): Promise<PerformanceMetric[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/performance/?${queryParams.toString()}`);
  }

  async getSystemMetrics(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    responseTime: { avg: number; p95: number; p99: number };
    errorRate: number;
    uptime: number;
    cpuUsage: number;
    memoryUsage: number;
    requestsPerSecond: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/system/?${queryParams.toString()}`);
  }

  // ============ TESTS ============

  async getABTests(params?: { status?: string; limit?: number }): Promise<Test[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/analytics/ab-tests/?${queryParams.toString()}`);
  }

  async getABTest(id: string): Promise<Test> {
    return apiClient.get(`/analytics/ab-tests/${id}/`);
  }

  async createABTest(data: Partial<Test>): Promise<Test> {
    return apiClient.post('/analytics/ab-tests/', data);
  }

  async updateABTest(id: string, data: Partial<Test>): Promise<Test> {
    return apiClient.patch(`/analytics/ab-tests/${id}/`, data);
  }

  async getABTestResults(id: string): Promise<{
    variant: string;
    conversions: number;
    conversionRate: number;
    confidence: number;
    improvement: number;
    sampleSize: number;
  }[]> {
    return apiClient.get(`/analytics/ab-tests/${id}/results/`);
  }

  // ============ REAL-TIME ============

  async getRealTimeStats(): Promise<{
    onlineUsers: number;
    pageViewsToday: number;
    conversionsToday: number;
    revenueToday: number;
    activeSessions: number;
    topPages: { page: string; views: number }[];
    recentEvents: AnalyticsEvent[];
  }> {
    return apiClient.get('/analytics/realtime/');
  }

  async getLiveVisitors(): Promise<{
    count: number;
    visitors: { id: string; page: string; location: string; timestamp: Date }[];
  }> {
    return apiClient.get('/analytics/live-visitors/');
  }

  // ============ GEOGRAPHIC ============

  async getGeolocationStats(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    countries: { country: string; visitors: number; percentage: number }[];
    cities: { city: string; country: string; visitors: number }[];
    regions: { region: string; country: string; visitors: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/geolocation/?${queryParams.toString()}`);
  }

  // ============ DEVICE & BROWSER ============

  async getDeviceStats(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    devices: { device: string; visitors: number; percentage: number }[];
    browsers: { browser: string; visitors: number; percentage: number }[];
    os: { os: string; visitors: number; percentage: number }[];
    screenResolutions: { resolution: string; visitors: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/devices/?${queryParams.toString()}`);
  }

  // ============ EXPORTS ============

  async exportAnalytics(params: {
    type: 'page_views' | 'events' | 'conversions' | 'revenue' | 'users';
    format: 'csv' | 'excel' | 'pdf' | 'json';
    startDate?: Date;
    endDate?: Date;
    filters?: Record<string, any>;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams({
      type: params.type,
      format: params.format,
    });
    if (params.startDate) {
      queryParams.append('start_date', params.startDate.toISOString());
    }
    if (params.endDate) {
      queryParams.append('end_date', params.endDate.toISOString());
    }
    if (params.filters) {
      queryParams.append('filters', JSON.stringify(params.filters));
    }
    return apiClient.get(`/analytics/export/?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  }

  async getExportHistory(): Promise<AnalyticsExport[]> {
    return apiClient.get('/analytics/exports/');
  }

  async getExport(id: string): Promise<AnalyticsExport> {
    return apiClient.get(`/analytics/exports/${id}/`);
  }

  async downloadExport(id: string): Promise<Blob> {
    return apiClient.get(`/analytics/exports/${id}/download/`, {
      responseType: 'blob',
    });
  }

  // ============ DASHBOARD ============

  async getDashboardData(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    summary: {
      visitors: number;
      pageViews: number;
      conversions: number;
      revenue: number;
      averageOrderValue: number;
    };
    charts: {
      visitors: { date: string; count: number }[];
      revenue: { date: string; amount: number }[];
      conversions: { date: string; count: number }[];
    };
    topProducts: ProductAnalytics[];
    recentEvents: AnalyticsEvent[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/analytics/dashboard/?${queryParams.toString()}`);
  }

  // ============ UTILITY ============

  getSessionId(): string {
    return this.sessionId;
  }

  refreshSession(): void {
    this.sessionId = this.generateSessionId();
  }
}

export const analyticsService = AnalyticsService.getInstance();