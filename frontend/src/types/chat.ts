export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  ACTION = 'action',
  SUGGESTION = 'suggestion',
  SYSTEM = 'system',
  ERROR = 'error',
}

export enum ChatStatus {
  ACTIVE = 'active',
  TRANSFERRED = 'transferred',
  CLOSED = 'closed',
  PENDING = 'pending',
}

export interface ChatMessage {
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
    type: string;
    url: string;
    name: string;
    size: number;
  }[];
  reactions?: {
    emoji: string;
    userId: string;
  }[];
  metadata?: {
    action?: string;
    data?: any;
    suggestions?: string[];
    quickReplies?: { label: string; value: string }[];
    error?: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  messages: ChatMessage[];
  status: ChatStatus;
  transferredTo?: string;
  transferredToName?: string;
  advisorId?: string;
  advisorName?: string;
  tags?: string[];
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  closedAt?: Date;
}

export interface ChatResponse {
  message: string;
  type: 'text' | 'action' | 'suggestion' | 'error' | 'quick_reply';
  action?: {
    type: 'search' | 'recommend' | 'compare' | 'track' | 'calculate' | 'transfer' | 'add_to_cart' | 'view_order';
    data: any;
  };
  suggestions?: string[];
  quickReplies?: { label: string; value: string }[];
}

export interface TransferRequest {
  sessionId: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  category: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface ChatContext {
  sessionId: string;
  userId: string;
  currentPage?: string;
  previousMessages: ChatMessage[];
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    orderCount?: number;
  };
  activeOrder?: {
    id: string;
    status: string;
    total: number;
  };
}

export interface AITool {
  name: string;
  description: string;
  parameters: {
    required: string[];
    optional: string[];
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
  };
  execute: (params: any, context: ChatContext) => Promise<ChatResponse>;
}

export interface ChatAnalytics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  messageCount: number;
  aiMessages: number;
  humanMessages: number;
  transferCount: number;
  rating?: number;
  resolution: boolean;
  tags: string[];
}

export interface ChatQuickReply {
  id: string;
  label: string;
  value: string;
  icon?: string;
  description?: string;
  category: 'product' | 'order' | 'payment' | 'delivery' | 'support' | 'general';
}