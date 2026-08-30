import { Product, ProductVariant } from './product';
import { User } from './user';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  WALLET = 'wallet',
}

export interface Address {
  id?: string;
  userId?: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  instructions?: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  discount: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  subtotal: number;
  shippingCost: number;
  serviceFee: number;
  customsFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  deliveryInstructions?: string;
  notes?: string;
  isActive: boolean;
  isGift: boolean;
  giftMessage?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  items: { productId: string; variantId?: string; quantity: number }[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  isGift?: boolean;
  giftMessage?: string;
  deliveryInstructions?: string;
}

export interface OrderStatusUpdate {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  note?: string;
  createdBy: string;
  createdAt: Date;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  action: string;
  description: string;
  data: Record<string, any>;
  createdBy: string;
  createdAt: Date;
}

export interface OrderInvoice {
  id: string;
  orderId: string;
  number: string;
  url: string;
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
  total: number;
  tax: number;
  discount: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByStatus: { status: OrderStatus; count: number }[];
}

export interface OrderReturn {
  id: string;
  orderId: string;
  order: Order;
  items: {
    orderItemId: string;
    quantity: number;
    reason: string;
    condition: string;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  returnMethod: 'pickup' | 'dropoff' | 'mail';
  refundAmount: number;
  refundMethod: PaymentMethod;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

export interface OrderRefund {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'failed';
  processedAt?: Date;
  createdAt: Date;
}

export interface OrderShipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  history: {
    status: string;
    location: string;
    description: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}