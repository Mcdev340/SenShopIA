export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  processingOrders: number;
  activeUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  ordersThisMonth: number;
  ordersThisWeek: number;
  revenueThisMonth: number;
  revenueThisWeek: number;
  averageOrderValue: number;
  conversionRate: number;
  bounceRate: number;
  previousMonthGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
    tension?: number;
    pointBackgroundColor?: string | string[];
    pointBorderColor?: string | string[];
  }[];
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  revenue: number;
  averageOrderValue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  sold: number;
  revenue: number;
  rating: number;
  category: string;
}

export interface RecentOrder {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  total: number;
  status: string;
  date: Date;
  items: number;
  paymentMethod: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  completedToday: number;
  completedThisWeek: number;
  pending: number;
  inProgress: number;
  failed: number;
  rating: number;
  totalEarned: number;
  earningsThisMonth: number;
  averageDeliveryTime: number;
  onTimeRate: number;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: string;
  distance: number;
  estimatedTime: string;
  actualTime?: string;
  amount: number;
  items: number;
  createdAt: Date;
  estimatedDelivery: Date;
}

export interface AdvisorStats {
  totalTickets: number;
  resolved: number;
  open: number;
  inProgress: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'table' | 'list' | 'custom';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  data?: any;
  settings?: Record<string, any>;
}

export interface AdminFilters {
  dateRange?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  status?: string;
  category?: string;
  search?: string;
}

export interface ExportData {
  type: 'orders' | 'users' | 'products' | 'revenue' | 'analytics';
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  columns?: string[];
}

export interface NotificationCenter {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  action?: {
    label: string;
    url: string;
  };
}