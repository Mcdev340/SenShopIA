import { Address, Order } from './order';

export enum ShipmentStatus {
  PREPARING = 'preparing',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  CUSTOMS = 'customs',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

export enum DeliveryZone {
  DAKAR = 'dakar',
  THIES = 'thies',
  SAINT_LOUIS = 'saint_louis',
  TOUBA = 'touba',
  ZIGUINCHOR = 'ziguinchor',
  KAOLACK = 'kaolack',
  MBOUR = 'mbour',
  RUFISQUE = 'rufisque',
  OTHER = 'other',
}

export interface Shipment {
  id: string;
  orderId: string;
  order: Order;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  history: ShipmentHistory[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentHistory {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DeliveryAgent {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType: 'car' | 'motorcycle' | 'bicycle' | 'truck';
  licensePlate: string;
  currentLocation: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
  isAvailable: boolean;
  rating: number;
  completedDeliveries: number;
  totalDeliveries: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents?: {
    license: string;
    insurance: string;
    identity: string;
  };
  zones: DeliveryZone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryAssignment {
  id: string;
  shipmentId: string;
  agentId: string;
  agent?: DeliveryAgent;
  status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  assignedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  distance?: number;
  estimatedDuration?: number;
  actualDuration?: number;
}

export interface TrackingUpdate {
  trackingNumber: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DeliveryEstimate {
  cost: number;
  duration: string;
  distance: number;
  options: {
    id: string;
    type: 'standard' | 'express' | 'same_day';
    cost: number;
    duration: string;
    description: string;
  }[];
}

export interface ShipmentFilters {
  status?: ShipmentStatus;
  carrier?: string;
  startDate?: Date;
  endDate?: Date;
  orderId?: string;
  trackingNumber?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'estimatedDelivery' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface DeliveryZoneDetail {
  id: string;
  name: string;
  type: DeliveryZone;
  boundaries: {
    lat: number;
    lng: number;
  }[];
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  baseFee: number;
  feePerKm: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryTimeSlot {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxDeliveries: number;
  currentDeliveries: number;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  shipmentId: string;
  reason: 'damaged' | 'wrong_item' | 'not_satisfied' | 'other';
  description: string;
  items: {
    productId: string;
    quantity: number;
    condition: 'new' | 'used' | 'damaged';
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'in_transit' | 'received' | 'completed';
  returnMethod: 'pickup' | 'dropoff' | 'mail';
  pickupAddress?: Address;
  returnTrackingNumber?: string;
  returnCarrier?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface Carrier {
  id: string;
  name: string;
  code: string;
  trackingUrl: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  supportedServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryStatistics {
  totalDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  pendingDeliveries: number;
  inProgressDeliveries: number;
  averageDeliveryTime: number;
  onTimeRate: number;
  revenue: number;
  deliveryByStatus: { status: ShipmentStatus; count: number }[];
  deliveryByDay: { date: string; count: number }[];
}