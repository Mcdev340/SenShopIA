import { apiClient } from '@/lib/api-client';
import {
  Order,
  OrderItem,
  CreateOrderData,
  OrderStatus,
  OrderHistory,
  OrderStatusUpdate,
  OrderFilters,
  OrderStats,
  OrderInvoice,
  OrderReturn,
  OrderRefund,
  OrderShipment,
} from '@/types/order';

class OrdersService {
  private static instance: OrdersService;

  private constructor() {}

  public static getInstance(): OrdersService {
    if (!OrdersService.instance) {
      OrdersService.instance = new OrdersService();
    }
    return OrdersService.instance;
  }

  // ============ USER ORDERS ============

  async getOrders(params?: OrderFilters): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/orders/?${queryParams.toString()}`);
  }

  async getOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}/`);
  }

  async getOrderByReference(reference: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/reference/${reference}/`);
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    return apiClient.post<Order>('/orders/', orderData);
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/cancel/`, { reason });
  }

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status/`, { status, note });
  }

  async getOrderStatus(id: string): Promise<{ status: OrderStatus; updatedAt: Date; message?: string }> {
    return apiClient.get(`/orders/${id}/status/`);
  }

  // ============ ORDER ITEMS ============

  async getOrderItems(id: string): Promise<OrderItem[]> {
    return apiClient.get<OrderItem[]>(`/orders/${id}/items/`);
  }

  async getOrderItem(id: string, itemId: string): Promise<OrderItem> {
    return apiClient.get<OrderItem>(`/orders/${id}/items/${itemId}/`);
  }

  // ============ ORDER HISTORY ============

  async getOrderHistory(id: string): Promise<OrderHistory[]> {
    return apiClient.get<OrderHistory[]>(`/orders/${id}/history/`);
  }

  async getOrderTimeline(id: string): Promise<OrderStatusUpdate[]> {
    return apiClient.get<OrderStatusUpdate[]>(`/orders/${id}/timeline/`);
  }

  // ============ INVOICES ============

  async getInvoice(id: string): Promise<OrderInvoice> {
    return apiClient.get<OrderInvoice>(`/orders/${id}/invoice/`);
  }

  async downloadInvoice(id: string, format: 'pdf' | 'html' = 'pdf'): Promise<Blob> {
    return apiClient.get(`/orders/${id}/invoice/download/?format=${format}`, {
      responseType: 'blob',
    });
  }

  async getInvoices(params?: { page?: number; limit?: number }): Promise<{
    invoices: OrderInvoice[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/orders/invoices/?${queryParams.toString()}`);
  }

  // ============ RETURNS ============

  async createReturn(orderId: string, data: {
    items: { orderItemId: string; quantity: number; reason: string; condition: string }[];
    returnMethod: 'pickup' | 'dropoff' | 'mail';
    notes?: string;
  }): Promise<OrderReturn> {
    return apiClient.post<OrderReturn>(`/orders/${orderId}/returns/`, data);
  }

  async getReturn(id: string): Promise<OrderReturn> {
    return apiClient.get<OrderReturn>(`/orders/returns/${id}/`);
  }

  async getReturnStatus(id: string): Promise<{ status: string; message: string }> {
    return apiClient.get(`/orders/returns/${id}/status/`);
  }

  async cancelReturn(id: string, reason?: string): Promise<OrderReturn> {
    return apiClient.patch<OrderReturn>(`/orders/returns/${id}/cancel/`, { reason });
  }

  // ============ REFUNDS ============

  async getRefunds(orderId: string): Promise<OrderRefund[]> {
    return apiClient.get<OrderRefund[]>(`/orders/${orderId}/refunds/`);
  }

  async getRefund(id: string): Promise<OrderRefund> {
    return apiClient.get<OrderRefund>(`/orders/refunds/${id}/`);
  }

  // ============ SHIPMENTS ============

  async getShipment(orderId: string): Promise<OrderShipment> {
    return apiClient.get<OrderShipment>(`/orders/${orderId}/shipment/`);
  }

  async getTrackingInfo(trackingNumber: string): Promise<OrderShipment> {
    return apiClient.get<OrderShipment>(`/orders/tracking/${trackingNumber}/`);
  }

  async getTrackingHistory(trackingNumber: string): Promise<{
    status: string;
    location: string;
    description: string;
    timestamp: Date;
  }[]> {
    return apiClient.get(`/orders/tracking/${trackingNumber}/history/`);
  }

  // ============ STATISTICS ============

  async getOrderSummary(): Promise<{
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
  }> {
    return apiClient.get('/orders/summary/');
  }

  async getOrderStats(dateRange?: { start: Date; end: Date }): Promise<OrderStats> {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('start', dateRange.start.toISOString());
      params.append('end', dateRange.end.toISOString());
    }
    return apiClient.get(`/orders/stats/?${params.toString()}`);
  }

  // ============ ADMIN METHODS ============

  async getAllOrders(params?: OrderFilters & { search?: string }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/orders/admin/all/?${queryParams.toString()}`);
  }

  async assignDeliveryAgent(orderId: string, agentId: string): Promise<void> {
    return apiClient.post(`/orders/admin/${orderId}/assign-delivery/`, { agent_id: agentId });
  }

  async updateOrderAdmin(id: string, data: Partial<Order>): Promise<Order> {
    return apiClient.patch<Order>(`/orders/admin/${id}/`, data);
  }

  async deleteOrder(id: string): Promise<void> {
    return apiClient.delete(`/orders/admin/${id}/`);
  }

  async approveReturn(returnId: string): Promise<OrderReturn> {
    return apiClient.post<OrderReturn>(`/orders/admin/returns/${returnId}/approve/`);
  }

  async rejectReturn(returnId: string, reason: string): Promise<OrderReturn> {
    return apiClient.post<OrderReturn>(`/orders/admin/returns/${returnId}/reject/`, { reason });
  }

  async processRefund(refundId: string): Promise<OrderRefund> {
    return apiClient.post<OrderRefund>(`/orders/admin/refunds/${refundId}/process/`);
  }

  async getOrdersAnalytics(params?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Promise<{
    revenue: { date: string; amount: number }[];
    orders: { date: string; count: number }[];
    averageOrderValue: { date: string; value: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/orders/admin/analytics/?${queryParams.toString()}`);
  }

  async getOrderExport(params?: {
    startDate?: Date;
    endDate?: Date;
    status?: OrderStatus;
    format?: 'csv' | 'excel';
  }): Promise<Blob> {
    const queryParams = new URLSearchParams({ format: params?.format || 'csv' });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && key !== 'format') {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/orders/admin/export/?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  }
}

export const ordersService = OrdersService.getInstance();