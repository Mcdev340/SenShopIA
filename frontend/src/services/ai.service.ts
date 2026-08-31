import { apiClient } from '@/lib/api-client';
import { ChatMessage, ChatSession, ChatResponse } from '@/types/chat';
import { Product } from '@/types/product';

class AIService {
  private static instance: AIService;
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // ============ CHAT MESSAGES ============

  async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/ai/chat/', {
      message,
      session_id: sessionId,
    });
  }

  async sendMessageWithContext(message: string, context: {
    sessionId?: string;
    currentPage?: string;
    productId?: string;
    orderId?: string;
  }): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/ai/chat/context/', {
      message,
      ...context,
    });
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>('/ai/history/');
  }

  async getChatSession(sessionId: string): Promise<ChatSession> {
    return apiClient.get<ChatSession>(`/ai/session/${sessionId}/`);
  }

  async getActiveSession(): Promise<ChatSession> {
    return apiClient.get<ChatSession>('/ai/session/active/');
  }

  async startNewSession(): Promise<ChatSession> {
    return apiClient.post<ChatSession>('/ai/session/start/');
  }

  async closeSession(sessionId: string): Promise<void> {
    return apiClient.post(`/ai/session/${sessionId}/close/`);
  }

  async transferToHuman(sessionId: string, reason: string): Promise<{
    status: string;
    message: string;
    advisorId?: string;
  }> {
    return apiClient.post(`/ai/transfer/${sessionId}/`, { reason });
  }

  async getChatStatus(sessionId: string): Promise<{
    status: 'active' | 'transferred' | 'closed';
    advisorId?: string;
    advisorName?: string;
  }> {
    return apiClient.get(`/ai/status/${sessionId}/`);
  }

  // ============ AI TOOLS ============

  async searchProducts(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ products: Product[]; suggestions: string[] }> {
    return apiClient.post('/ai/tools/search/', { query, filters });
  }

  async recommendProducts(interests: string[], limit = 5): Promise<{
    products: Product[];
    explanation: string;
    categories: string[];
  }> {
    return apiClient.post('/ai/tools/recommend/', { interests, limit });
  }

  async compareProducts(productIds: string[]): Promise<{
    comparison: any;
    recommendation: string;
    bestValue: string;
  }> {
    return apiClient.post('/ai/tools/compare/', { product_ids: productIds });
  }

  async calculateDelivery(productId: string, zipCode: string): Promise<{
    cost: number;
    duration: string;
    options: { type: string; cost: number; duration: string; description: string }[];
  }> {
    return apiClient.post('/ai/tools/calculate-delivery/', {
      product_id: productId,
      zip_code: zipCode,
    });
  }

  async checkAvailability(productId: string): Promise<{
    available: boolean;
    quantity: number;
    alternatives?: Product[];
    estimatedRestock?: Date;
  }> {
    return apiClient.post('/ai/tools/check-availability/', { product_id: productId });
  }

  async getOrderStatus(orderId: string): Promise<{
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    currentLocation?: string;
    history: { status: string; location: string; timestamp: Date }[];
  }> {
    return apiClient.post('/ai/tools/order-status/', { order_id: orderId });
  }

  async addToCartViaAI(productId: string, quantity = 1): Promise<{
    success: boolean;
    message: string;
    cart?: any;
  }> {
    return apiClient.post('/ai/tools/add-to-cart/', {
      product_id: productId,
      quantity,
    });
  }

  async getCartViaAI(): Promise<{
    items: any[];
    subtotal: number;
    total: number;
    summary: string;
  }> {
    return apiClient.post('/ai/tools/get-cart/');
  }

  async getProductAdvice(productId: string): Promise<{
    pros: string[];
    cons: string[];
    recommendations: string;
    similarProducts: Product[];
    priceComparison: { product: string; price: number }[];
  }> {
    return apiClient.post('/ai/product-advice/', { product_id: productId });
  }

  async getPricePrediction(productId: string): Promise<{
    current: number;
    predicted: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
    factors: string[];
    bestTimeToBuy: string;
  }> {
    return apiClient.post('/ai/price-prediction/', { product_id: productId });
  }

  // ============ FAQ ============

  async getFAQ(): Promise<{ question: string; answer: string; category: string }[]> {
    return apiClient.get('/ai/faq/');
  }

  async searchFAQ(query: string): Promise<{ question: string; answer: string; relevance: number }[]> {
    return apiClient.post('/ai/faq/search/', { query });
  }

  async askQuestion(question: string, context?: string): Promise<string> {
    return apiClient.post<string>('/ai/ask/', { question, context });
  }

  // ============ SUPPORT ============

  async getSupportTickets(): Promise<any[]> {
    return apiClient.get('/ai/support/tickets/');
  }

  async createSupportTicket(message: string, category: string, priority?: string): Promise<any> {
    return apiClient.post('/ai/support/tickets/', {
      message,
      category,
      priority,
    });
  }

  async getSupportTicket(id: string): Promise<any> {
    return apiClient.get(`/ai/support/tickets/${id}/`);
  }

  async respondToTicket(ticketId: string, message: string): Promise<any> {
    return apiClient.post(`/ai/support/tickets/${ticketId}/respond/`, { message });
  }

  async closeTicket(ticketId: string): Promise<void> {
    return apiClient.post(`/ai/support/tickets/${ticketId}/close/`);
  }

  // ============ WEBSOCKET ============

  connectWebSocket(sessionId: string): WebSocket {
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws';
    this.ws = new WebSocket(`${wsUrl}/chat/${sessionId}/`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return this.ws;
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendMessageWebSocket(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  onMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: ChatMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  // ============ TYPING INDICATORS ============

  sendTypingIndicator(sessionId: string, isTyping: boolean): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'typing',
        session_id: sessionId,
        is_typing: isTyping,
      }));
    }
  }
}

export const aiService = AIService.getInstance();