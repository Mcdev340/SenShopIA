import { Product } from './product';
import { Order } from './order';
import { Cart } from './cart';

export enum AIToolType {
  SEARCH = 'search',
  RECOMMEND = 'recommend',
  COMPARE = 'compare',
  AVAILABILITY = 'availability',
  DELIVERY = 'delivery',
  ORDER_STATUS = 'order_status',
  ADD_TO_CART = 'add_to_cart',
  GET_CART = 'get_cart',
  PRODUCT_ADVICE = 'product_advice',
  PRICE_PREDICTION = 'price_prediction',
  FAQ = 'faq',
  TRANSFER = 'transfer',
}

export enum MessageType {
  TEXT = 'text',
  ACTION = 'action',
  SUGGESTION = 'suggestion',
  ERROR = 'error',
  QUICK_REPLY = 'quick_reply',
  SYSTEM = 'system',
  TYPING = 'typing',
}

export enum ChatStatus {
  ACTIVE = 'active',
  TRANSFERRED = 'transferred',
  CLOSED = 'closed',
  PENDING = 'pending',
  PAUSED = 'paused',
}

export interface AIMessage {
  id: string;
  userId: string;
  sessionId: string;
  content: string;
  type: MessageType;
  isAI: boolean;
  isRead: boolean;
  timestamp: Date;
  attachments?: {
    id: string;
    type: 'image' | 'file' | 'link';
    url: string;
    name: string;
    size?: number;
  }[];
  metadata?: {
    action?: AIToolType;
    data?: any;
    suggestions?: string[];
    quickReplies?: QuickReply[];
    error?: string;
    confidence?: number;
    context?: Record<string, any>;
  };
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
  icon?: string;
  description?: string;
  action?: AIToolType;
  data?: any;
}

export interface ChatSession {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    phone?: string;
  };
  messages: AIMessage[];
  status: ChatStatus;
  transferredTo?: string;
  transferredToName?: string;
  advisorId?: string;
  advisorName?: string;
  tags?: string[];
  rating?: number;
  feedback?: string;
  metadata?: {
    currentPage?: string;
    productId?: string;
    orderId?: string;
    cartId?: string;
    userAgent?: string;
    ip?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  closedAt?: Date;
  transferredAt?: Date;
}

export interface ChatResponse {
  message: string;
  type: MessageType;
  action?: {
    type: AIToolType;
    data: any;
    label?: string;
  };
  suggestions?: string[];
  quickReplies?: QuickReply[];
  error?: string;
  metadata?: Record<string, any>;
}

export interface AIRequest {
  message: string;
  sessionId?: string;
  context?: {
    currentPage?: string;
    productId?: string;
    orderId?: string;
    cartId?: string;
    userId?: string;
    preferences?: Record<string, any>;
  };
  tools?: AIToolType[];
}

export interface TransferRequest {
  sessionId: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  category: 'order' | 'payment' | 'delivery' | 'product' | 'technical' | 'other';
  customerEmail?: string;
  customerPhone?: string;
  previousMessages?: AIMessage[];
  context?: Record<string, any>;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  advisorId?: string;
  advisorName?: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
}

export interface ChatContext {
  sessionId: string;
  userId: string;
  currentPage?: string;
  previousMessages: AIMessage[];
  userInfo: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    orderCount?: number;
    totalSpent?: number;
    memberSince?: Date;
    preferences?: Record<string, any>;
  };
  activeOrder?: {
    id: string;
    status: string;
    total: number;
    items: number;
  };
  recentOrders?: Order[];
  cart?: Cart;
  browsingHistory?: {
    products: Product[];
    categories: string[];
  };
}

export interface AITool {
  name: string;
  description: string;
  type: AIToolType;
  parameters: {
    required: string[];
    optional: string[];
    properties: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      description: string;
      enum?: string[];
      example?: any;
    }>;
  };
  execute: (params: any, context: ChatContext) => Promise<ChatResponse>;
}

export interface AIToolResult {
  success: boolean;
  data: any;
  message?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AIAnalytics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  messageCount: number;
  aiMessages: number;
  humanMessages: number;
  transferCount: number;
  toolsUsed: {
    tool: AIToolType;
    count: number;
    successRate: number;
  }[];
  rating?: number;
  resolution: boolean;
  tags: string[];
  userSatisfaction?: number;
  responseTime?: number;
}

export interface AIConfig {
  enabled: boolean;
  maxMessagesPerSession: number;
  sessionTimeout: number;
  transferThreshold: number;
  tools: {
    [key in AIToolType]?: {
      enabled: boolean;
      timeout: number;
      retries: number;
    };
  };
  model: {
    provider: 'openai' | 'anthropic' | 'custom';
    name: string;
    temperature: number;
    maxTokens: number;
  };
}

export interface AIFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number;
  feedback?: string;
  helpful: boolean;
  issues?: string[];
  timestamp: Date;
}

export interface AISuggestion {
  id: string;
  type: 'product' | 'category' | 'search' | 'action';
  label: string;
  value: string;
  confidence: number;
  icon?: string;
  data?: any;
}

export interface AIHistory {
  id: string;
  userId: string;
  sessionId: string;
  query: string;
  response: string;
  type: MessageType;
  toolUsed?: AIToolType;
  timestamp: Date;
  rating?: number;
}

export interface AIPersonalization {
  userId: string;
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: {
      min: number;
      max: number;
    };
    interests: string[];
    preferredLanguage: string;
  };
  history: {
    searches: string[];
    views: string[];
    purchases: string[];
  };
  recommendations: {
    products: Product[];
    categories: string[];
    lastUpdated: Date;
  };
}

export interface AIWebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'status' | 'transfer' | 'error';
  sessionId: string;
  data: any;
  timestamp: Date;
}

export interface AITypingIndicator {
  sessionId: string;
  isTyping: boolean;
  userId: string;
}

export interface AIStatusUpdate {
  sessionId: string;
  status: ChatStatus;
  message?: string;
  timestamp: Date;
}

export interface AIMessageReadReceipt {
  sessionId: string;
  messageId: string;
  userId: string;
  readAt: Date;
}