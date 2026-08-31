import { apiClient } from '@/lib/api-client';
import {
  Shipment,
  ShipmentStatus,
  DeliveryAgent,
  DeliveryAssignment,
  TrackingUpdate,
  DeliveryEstimate,
  ShipmentFilters,
  DeliveryZoneDetail,
  DeliveryTimeSlot,
  ReturnRequest,
  Carrier,
  DeliveryStatistics,
} from '@/types/logistics';
import { Address } from '@/types/order';

class LogisticsService {
  private static instance: LogisticsService;

  private constructor() {}

  public static getInstance(): LogisticsService {
    if (!LogisticsService.instance) {
      LogisticsService.instance = new LogisticsService();
    }
    return LogisticsService.instance;
  }

  // ============ SHIPMENTS ============

  async getShipment(orderId: string): Promise<Shipment> {
    return apiClient.get<Shipment>(`/logistics/shipment/${orderId}/`);
  }

  async getShipmentById(id: string): Promise<Shipment> {
    return apiClient.get<Shipment>(`/logistics/shipments/${id}/`);
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment> {
    return apiClient.get<Shipment>(`/logistics/tracking/${trackingNumber}/`);
  }

  async getShipments(filters?: ShipmentFilters): Promise<{
    shipments: Shipment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/logistics/shipments/?${params.toString()}`);
  }

  async getTrackingHistory(trackingNumber: string): Promise<TrackingUpdate[]> {
    return apiClient.get<TrackingUpdate[]>(`/logistics/tracking/${trackingNumber}/history/`);
  }

  async getDeliveryStatus(trackingNumber: string): Promise<{
    status: ShipmentStatus;
    location: string;
    estimatedDelivery: Date;
    currentStep: number;
    totalSteps: number;
  }> {
    return apiClient.get(`/logistics/tracking/${trackingNumber}/status/`);
  }

  async updateDeliveryStatus(shipmentId: string, status: ShipmentStatus, location?: string, metadata?: Record<string, any>): Promise<Shipment> {
    return apiClient.patch<Shipment>(`/logistics/shipment/${shipmentId}/status/`, {
      status,
      location,
      metadata,
    });
  }

  async trackMultipleOrders(trackingNumbers: string[]): Promise<Shipment[]> {
    return apiClient.post<Shipment[]>('/logistics/tracking/multiple/', { tracking_numbers: trackingNumbers });
  }

  // ============ DELIVERY AGENTS ============

  async getDeliveryAgents(params?: {
    isAvailable?: boolean;
    zone?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<DeliveryAgent[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<DeliveryAgent[]>(`/logistics/agents/?${queryParams.toString()}`);
  }

  async getAvailableAgents(params?: { lat?: number; lng?: number; radius?: number }): Promise<DeliveryAgent[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<DeliveryAgent[]>(`/logistics/agents/available/?${queryParams.toString()}`);
  }

  async getNearbyAgents(lat: number, lng: number, radius = 10): Promise<DeliveryAgent[]> {
    return apiClient.get<DeliveryAgent[]>(`/logistics/agents/nearby/?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  async assignDeliveryAgent(shipmentId: string, agentId: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>('/logistics/assign/', {
      shipment_id: shipmentId,
      agent_id: agentId,
    });
  }

  async reassignDeliveryAgent(assignmentId: string, newAgentId: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>(`/logistics/assign/${assignmentId}/reassign/`, {
      agent_id: newAgentId,
    });
  }

  // ============ DELIVERY ASSIGNMENTS ============

  async getAssignment(assignmentId: string): Promise<DeliveryAssignment> {
    return apiClient.get<DeliveryAssignment>(`/logistics/assignments/${assignmentId}/`);
  }

  async getMyDeliveries(): Promise<DeliveryAssignment[]> {
    return apiClient.get<DeliveryAssignment[]>('/logistics/agent/deliveries/');
  }

  async acceptDelivery(assignmentId: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>(`/logistics/agent/${assignmentId}/accept/`);
  }

  async startDelivery(assignmentId: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>(`/logistics/agent/${assignmentId}/start/`);
  }

  async completeDelivery(assignmentId: string, proof?: string, signature?: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>(`/logistics/agent/${assignmentId}/complete/`, {
      proof,
      signature,
    });
  }

  async failDelivery(assignmentId: string, reason: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>(`/logistics/agent/${assignmentId}/fail/`, {
      reason,
    });
  }

  async updateAgentLocation(lat: number, lng: number): Promise<void> {
    return apiClient.post('/logistics/agent/location/', { lat, lng });
  }

  async getAgentStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    rating: number;
    earnings: number;
    pending: number;
  }> {
    return apiClient.get('/logistics/agent/stats/');
  }

  // ============ DELIVERY ZONES ============

  async getDeliveryZones(): Promise<DeliveryZoneDetail[]> {
    return apiClient.get<DeliveryZoneDetail[]>('/logistics/zones/');
  }

  async getDeliveryZone(id: string): Promise<DeliveryZoneDetail> {
    return apiClient.get<DeliveryZoneDetail>(`/logistics/zones/${id}/`);
  }

  async getDeliveryZonesForLocation(lat: number, lng: number): Promise<DeliveryZoneDetail[]> {
    return apiClient.get<DeliveryZoneDetail[]>(`/logistics/zones/nearby/?lat=${lat}&lng=${lng}`);
  }

  // ============ DELIVERY TIME SLOTS ============

  async getTimeSlots(zoneId: string, date: Date): Promise<DeliveryTimeSlot[]> {
    const params = new URLSearchParams({
      zone_id: zoneId,
      date: date.toISOString(),
    });
    return apiClient.get<DeliveryTimeSlot[]>(`/logistics/time-slots/?${params.toString()}`);
  }

  async getAvailableTimeSlots(zoneId: string, date: Date): Promise<DeliveryTimeSlot[]> {
    const params = new URLSearchParams({
      zone_id: zoneId,
      date: date.toISOString(),
    });
    return apiClient.get<DeliveryTimeSlot[]>(`/logistics/time-slots/available/?${params.toString()}`);
  }

  // ============ DELIVERY ESTIMATES ============

  async estimateDelivery(productId: string, address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }): Promise<DeliveryEstimate> {
    return apiClient.post<DeliveryEstimate>('/logistics/estimate/', {
      product_id: productId,
      address,
    });
  }

  async estimateBulkDelivery(products: { productId: string; quantity: number }[], address: any): Promise<DeliveryEstimate> {
    return apiClient.post<DeliveryEstimate>('/logistics/estimate/bulk/', {
      products,
      address,
    });
  }

  // ============ CARRIERS ============

  async getCarriers(): Promise<Carrier[]> {
    return apiClient.get<Carrier[]>('/logistics/carriers/');
  }

  async getCarrier(id: string): Promise<Carrier> {
    return apiClient.get<Carrier>(`/logistics/carriers/${id}/`);
  }

  async getCarrierForTracking(trackingNumber: string): Promise<Carrier> {
    return apiClient.get<Carrier>(`/logistics/carriers/detect/?tracking=${trackingNumber}`);
  }

  // ============ RETURNS ============

  async createReturn(data: {
    orderId: string;
    items: { productId: string; quantity: number; reason: string; condition: string }[];
    returnMethod: 'pickup' | 'dropoff' | 'mail';
    pickupAddress?: Address;
    notes?: string;
  }): Promise<ReturnRequest> {
    return apiClient.post<ReturnRequest>('/logistics/returns/', data);
  }

  async getReturn(id: string): Promise<ReturnRequest> {
    return apiClient.get<ReturnRequest>(`/logistics/returns/${id}/`);
  }

  async getReturns(params?: { status?: string; orderId?: string; page?: number; limit?: number }): Promise<{
    returns: ReturnRequest[];
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
    return apiClient.get(`/logistics/returns/?${queryParams.toString()}`);
  }

  async cancelReturn(id: string): Promise<ReturnRequest> {
    return apiClient.post<ReturnRequest>(`/logistics/returns/${id}/cancel/`);
  }

  // ============ ADMIN METHODS ============

  async getLogisticsStatistics(params?: { startDate?: Date; endDate?: Date }): Promise<DeliveryStatistics> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toISOString());
        }
      });
    }
    return apiClient.get<DeliveryStatistics>(`/logistics/admin/statistics/?${queryParams.toString()}`);
  }

  async getDeliveryPerformance(params?: { agentId?: string; startDate?: Date; endDate?: Date }): Promise<{
    onTimeRate: number;
    averageDeliveryTime: number;
    successRate: number;
    agentPerformance: { agentId: string; name: string; completed: number; rating: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/logistics/admin/performance/?${queryParams.toString()}`);
  }

  async getDeliveryHeatmap(params?: { startDate?: Date; endDate?: Date }): Promise<{
    locations: { lat: number; lng: number; intensity: number; count: number }[];
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toISOString());
        }
      });
    }
    return apiClient.get(`/logistics/admin/heatmap/?${queryParams.toString()}`);
  }

  async updateAgentAvailability(agentId: string, isAvailable: boolean): Promise<DeliveryAgent> {
    return apiClient.patch<DeliveryAgent>(`/logistics/admin/agents/${agentId}/`, {
      is_available: isAvailable,
    });
  }

  async updateAgentRating(agentId: string, rating: number): Promise<DeliveryAgent> {
    return apiClient.patch<DeliveryAgent>(`/logistics/admin/agents/${agentId}/rating/`, {
      rating,
    });
  }

  // ============ WEBHOOKS ============

  async receiveTrackingUpdate(data: any): Promise<void> {
    return apiClient.post('/logistics/tracking/webhook/', data);
  }

  // ============ PICKUP POINTS ============

  async getPickupPoints(params?: { city?: string; lat?: number; lng?: number; radius?: number }): Promise<{
    id: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    workingHours: { day: string; open: string; close: string }[];
    isActive: boolean;
  }[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/logistics/pickup-points/?${queryParams.toString()}`);
  }

  async getPickupPoint(id: string): Promise<any> {
    return apiClient.get(`/logistics/pickup-points/${id}/`);
  }
}

export const logisticsService = LogisticsService.getInstance();