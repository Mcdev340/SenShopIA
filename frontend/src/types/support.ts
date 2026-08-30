export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  PENDING = 'pending',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketCategory {
  ORDER = 'order',
  PAYMENT = 'payment',
  DELIVERY = 'delivery',
  PRODUCT = 'product',
  ACCOUNT = 'account',
  TECHNICAL = 'technical',
  OTHER = 'other',
}

export interface SupportTicket {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  message: string;
  category: TicketCategory;
  subCategory?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: Date;
  tags: string[];
  attachments: {
    id: string;
    name: string;
    url: string;
    size: number;
  }[];
  relatedOrderId?: string;
  relatedProductId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  firstResponseAt?: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  isInternal: boolean;
  isSystem: boolean;
  attachments: {
    id: string;
    name: string;
    url: string;
    size: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportStatistics {
  totalTickets: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  pending: number;
  urgent: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  firstResponseRate: number;
  reopenedRate: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  subCategory?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketData {
  subject: string;
  message: string;
  category: TicketCategory;
  subCategory?: string;
  priority?: TicketPriority;
  attachments?: File[];
  relatedOrderId?: string;
  relatedProductId?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'priority' | 'status' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SatisfactionSurvey {
  id: string;
  ticketId: string;
  rating: number;
  feedback?: string;
  resolutionTime: number;
  communication: number;
  knowledge: number;
  createdAt: Date;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  helpful: number;
  notHelpful: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}