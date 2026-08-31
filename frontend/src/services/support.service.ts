import { apiClient } from '@/lib/api-client';
import {
  SupportTicket,
  SupportMessage,
  SupportStatistics,
  FAQ,
  CreateTicketData,
  TicketFilters,
  SatisfactionSurvey,
  KnowledgeBaseArticle,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '@/types/support';

class SupportService {
  private static instance: SupportService;

  private constructor() {}

  public static getInstance(): SupportService {
    if (!SupportService.instance) {
      SupportService.instance = new SupportService();
    }
    return SupportService.instance;
  }

  // ============ USER TICKETS ============

  /**
   * Récupère tous les tickets de l'utilisateur connecté
   */
  async getMyTickets(params?: TicketFilters): Promise<{
    tickets: SupportTicket[];
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
    return apiClient.get(`/support/tickets/?${queryParams.toString()}`);
  }

  /**
   * Récupère un ticket spécifique
   */
  async getTicket(id: string): Promise<SupportTicket> {
    return apiClient.get<SupportTicket>(`/support/tickets/${id}/`);
  }

  /**
   * Crée un nouveau ticket de support
   */
  async createTicket(data: CreateTicketData): Promise<SupportTicket> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append('attachments', file);
            }
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.post<SupportTicket>('/support/tickets/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Récupère tous les messages d'un ticket
   */
  async getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
    return apiClient.get<SupportMessage[]>(`/support/tickets/${ticketId}/messages/`);
  }

  /**
   * Répond à un ticket
   */
  async replyToTicket(ticketId: string, message: string, attachments?: File[]): Promise<SupportMessage> {
    const formData = new FormData();
    formData.append('message', message);
    if (attachments) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    return apiClient.post<SupportMessage>(`/support/tickets/${ticketId}/reply/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Ferme un ticket
   */
  async closeTicket(ticketId: string, feedback?: string): Promise<void> {
    return apiClient.post(`/support/tickets/${ticketId}/close/`, { feedback });
  }

  /**
   * Réouvre un ticket fermé
   */
  async reopenTicket(ticketId: string): Promise<void> {
    return apiClient.post(`/support/tickets/${ticketId}/reopen/`);
  }

  /**
   * Récupère le statut d'un ticket
   */
  async getTicketStatus(ticketId: string): Promise<{ status: TicketStatus; message: string }> {
    return apiClient.get(`/support/tickets/${ticketId}/status/`);
  }

  /**
   * Escalade un ticket vers un niveau supérieur
   */
  async escalateTicket(ticketId: string, reason: string): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(`/support/tickets/${ticketId}/escalate/`, { reason });
  }

  /**
   * Récupère l'historique d'un ticket
   */
  async getTicketHistory(ticketId: string): Promise<{
    id: string;
    action: string;
    description: string;
    createdBy: string;
    createdAt: Date;
  }[]> {
    return apiClient.get(`/support/tickets/${ticketId}/history/`);
  }

  // ============ SATISFACTION SURVEYS ============

  /**
   * Soumet une enquête de satisfaction pour un ticket
   */
  async submitSatisfactionSurvey(ticketId: string, data: {
    rating: number;
    feedback?: string;
    communication?: number;
    knowledge?: number;
    resolutionTime?: number;
  }): Promise<SatisfactionSurvey> {
    return apiClient.post<SatisfactionSurvey>(`/support/tickets/${ticketId}/survey/`, data);
  }

  /**
   * Récupère les statistiques de satisfaction
   */
  async getSatisfactionStats(): Promise<{
    averageRating: number;
    totalSurveys: number;
    distribution: { [key: number]: number };
    feedbacks: { rating: number; feedback: string; createdAt: Date }[];
    byCategory: {
      category: string;
      averageRating: number;
      count: number;
    }[];
  }> {
    return apiClient.get('/support/satisfaction/stats/');
  }

  /**
   * Récupère les détails d'une enquête de satisfaction
   */
  async getSatisfactionSurvey(surveyId: string): Promise<SatisfactionSurvey> {
    return apiClient.get<SatisfactionSurvey>(`/support/satisfaction/${surveyId}/`);
  }

  // ============ FAQ ============

  /**
   * Récupère toutes les FAQs
   */
  async getFaqs(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
    isActive?: boolean;
    isFeatured?: boolean;
  }): Promise<{
    faqs: FAQ[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/support/faqs/?${queryParams.toString()}`);
  }

  /**
   * Récupère une FAQ spécifique
   */
  async getFaq(id: string): Promise<FAQ> {
    return apiClient.get<FAQ>(`/support/faqs/${id}/`);
  }

  /**
   * Récupère toutes les catégories de FAQ
   */
  async getFaqCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/support/faqs/categories/');
  }

  /**
   * Recherche dans les FAQs
   */
  async searchFaqs(query: string): Promise<FAQ[]> {
    return apiClient.get<FAQ[]>(`/support/faqs/search/?q=${encodeURIComponent(query)}`);
  }

  /**
   * Marque une FAQ comme utile ou non
   */
  async markFaqHelpful(id: string, helpful: boolean): Promise<void> {
    return apiClient.post(`/support/faqs/${id}/helpful/`, { helpful });
  }

  /**
   * Récupère les FAQs populaires
   */
  async getPopularFaqs(limit: number = 10): Promise<FAQ[]> {
    return apiClient.get<FAQ[]>(`/support/faqs/popular/?limit=${limit}`);
  }

  /**
   * Récupère les FAQs par catégorie
   */
  async getFaqsByCategory(category: string): Promise<FAQ[]> {
    return apiClient.get<FAQ[]>(`/support/faqs/category/${encodeURIComponent(category)}/`);
  }

  // ============ KNOWLEDGE BASE ============

  /**
   * Récupère les articles de la base de connaissances
   */
  async getKnowledgeBaseArticles(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
    isPublished?: boolean;
    isFeatured?: boolean;
  }): Promise<{
    articles: KnowledgeBaseArticle[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/support/knowledge-base/?${queryParams.toString()}`);
  }

  /**
   * Récupère un article spécifique de la base de connaissances
   */
  async getKnowledgeBaseArticle(id: string): Promise<KnowledgeBaseArticle> {
    return apiClient.get<KnowledgeBaseArticle>(`/support/knowledge-base/${id}/`);
  }

  /**
   * Recherche dans la base de connaissances
   */
  async searchKnowledgeBase(query: string): Promise<KnowledgeBaseArticle[]> {
    return apiClient.get<KnowledgeBaseArticle[]>(`/support/knowledge-base/search/?q=${encodeURIComponent(query)}`);
  }

  /**
   * Marque un article comme utile ou non
   */
  async markArticleHelpful(id: string, helpful: boolean): Promise<void> {
    return apiClient.post(`/support/knowledge-base/${id}/helpful/`, { helpful });
  }

  /**
   * Récupère les articles populaires
   */
  async getPopularArticles(limit: number = 10): Promise<KnowledgeBaseArticle[]> {
    return apiClient.get<KnowledgeBaseArticle[]>(`/support/knowledge-base/popular/?limit=${limit}`);
  }

  // ============ ADMIN METHODS ============

  /**
   * Récupère tous les tickets (admin seulement)
   */
  async getAllTickets(params?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    tickets: SupportTicket[];
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
    return apiClient.get(`/support/admin/tickets/?${queryParams.toString()}`);
  }

  /**
   * Assigner un ticket à un conseiller
   */
  async assignTicket(ticketId: string, advisorId: string): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(`/support/admin/tickets/${ticketId}/assign/`, {
      advisor_id: advisorId,
    });
  }

  /**
   * Mettre à jour le statut d'un ticket
   */
  async updateTicketStatus(ticketId: string, status: TicketStatus, note?: string): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`/support/admin/tickets/${ticketId}/status/`, {
      status,
      note,
    });
  }

  /**
   * Mettre à jour la priorité d'un ticket
   */
  async updateTicketPriority(ticketId: string, priority: TicketPriority): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`/support/admin/tickets/${ticketId}/priority/`, {
      priority,
    });
  }

  /**
   * Mettre à jour la catégorie d'un ticket
   */
  async updateTicketCategory(ticketId: string, category: TicketCategory, subCategory?: string): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`/support/admin/tickets/${ticketId}/category/`, {
      category,
      sub_category: subCategory,
    });
  }

  /**
   * Récupère les statistiques des tickets
   */
  async getTicketStatistics(): Promise<SupportStatistics> {
    return apiClient.get<SupportStatistics>('/support/admin/statistics/');
  }

  /**
   * Récupère la liste des conseillers
   */
  async getAdvisors(): Promise<{
    id: string;
    name: string;
    email: string;
    isAvailable: boolean;
    totalTickets: number;
    resolvedTickets: number;
    inProgressTickets: number;
    rating: number;
    online: boolean;
    specialization?: string;
  }[]> {
    return apiClient.get('/support/admin/advisors/');
  }

  /**
   * Met à jour la disponibilité d'un conseiller
   */
  async updateAdvisorAvailability(advisorId: string, isAvailable: boolean): Promise<void> {
    return apiClient.patch(`/support/admin/advisors/${advisorId}/`, {
      is_available: isAvailable,
    });
  }

  /**
   * Récupère les statistiques d'un conseiller
   */
  async getAdvisorStats(advisorId: string): Promise<{
    totalTickets: number;
    resolved: number;
    inProgress: number;
    open: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    rating: number;
    satisfactionRate: number;
    ticketsByPriority: { priority: TicketPriority; count: number }[];
    ticketsByCategory: { category: TicketCategory; count: number }[];
    dailyStats: { date: string; resolved: number; opened: number }[];
  }> {
    return apiClient.get(`/support/admin/advisors/${advisorId}/stats/`);
  }

  /**
   * Récupère les tickets assignés à un conseiller
   */
  async getAdvisorTickets(advisorId: string, params?: {
    status?: TicketStatus;
    page?: number;
    limit?: number;
  }): Promise<{
    tickets: SupportTicket[];
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
    return apiClient.get(`/support/admin/advisors/${advisorId}/tickets/?${queryParams.toString()}`);
  }

  // ============ ADMIN FAQ ============

  /**
   * Crée une nouvelle FAQ (admin seulement)
   */
  async createFaq(data: {
    question: string;
    answer: string;
    category: string;
    subCategory?: string;
    tags?: string[];
    isActive?: boolean;
    isFeatured?: boolean;
  }): Promise<FAQ> {
    return apiClient.post<FAQ>('/support/admin/faqs/', data);
  }

  /**
   * Met à jour une FAQ (admin seulement)
   */
  async updateFaq(id: string, data: Partial<{
    question: string;
    answer: string;
    category: string;
    subCategory: string;
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
  }>): Promise<FAQ> {
    return apiClient.patch<FAQ>(`/support/admin/faqs/${id}/`, data);
  }

  /**
   * Supprime une FAQ (admin seulement)
   */
  async deleteFaq(id: string): Promise<void> {
    return apiClient.delete(`/support/admin/faqs/${id}/`);
  }

  /**
   * Réorganise les FAQs
   */
  async reorderFaqs(orders: { id: string; order: number }[]): Promise<void> {
    return apiClient.post('/support/admin/faqs/reorder/', { orders });
  }

  /**
   * Importe des FAQs depuis un fichier
   */
  async importFaqs(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/support/admin/faqs/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Exporte les FAQs
   */
  async exportFaqs(format: 'csv' | 'json' = 'json'): Promise<Blob> {
    return apiClient.get(`/support/admin/faqs/export/?format=${format}`, {
      responseType: 'blob',
    });
  }

  // ============ ADMIN KNOWLEDGE BASE ============

  /**
   * Crée un article dans la base de connaissances (admin seulement)
   */
  async createKnowledgeBaseArticle(data: Partial<KnowledgeBaseArticle>): Promise<KnowledgeBaseArticle> {
    return apiClient.post<KnowledgeBaseArticle>('/support/admin/knowledge-base/', data);
  }

  /**
   * Met à jour un article de la base de connaissances (admin seulement)
   */
  async updateKnowledgeBaseArticle(id: string, data: Partial<KnowledgeBaseArticle>): Promise<KnowledgeBaseArticle> {
    return apiClient.patch<KnowledgeBaseArticle>(`/support/admin/knowledge-base/${id}/`, data);
  }

  /**
   * Supprime un article de la base de connaissances (admin seulement)
   */
  async deleteKnowledgeBaseArticle(id: string): Promise<void> {
    return apiClient.delete(`/support/admin/knowledge-base/${id}/`);
  }

  // ============ EXPORTS ============

  /**
   * Exporte les tickets
   */
  async exportTickets(params?: {
    startDate?: Date;
    endDate?: Date;
    status?: TicketStatus;
    format?: 'csv' | 'excel' | 'json';
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
    return apiClient.get(`/support/admin/export/?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  }

  /**
   * Exporte les données de satisfaction
   */
  async exportSatisfactionData(params?: {
    startDate?: Date;
    endDate?: Date;
    format?: 'csv' | 'excel' | 'json';
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
    return apiClient.get(`/support/admin/export/satisfaction/?${queryParams.toString()}`, {
      responseType: 'blob',
    });
  }

  // ============ TICKET TAGS ============

  /**
   * Récupère tous les tags disponibles
   */
  async getTicketTags(): Promise<string[]> {
    return apiClient.get<string[]>('/support/tags/');
  }

  /**
   * Ajoute des tags à un ticket
   */
  async addTicketTags(ticketId: string, tags: string[]): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(`/support/tickets/${ticketId}/tags/`, { tags });
  }

  /**
   * Supprime un tag d'un ticket
   */
  async removeTicketTag(ticketId: string, tag: string): Promise<SupportTicket> {
    return apiClient.delete(`/support/tickets/${ticketId}/tags/${encodeURIComponent(tag)}/`);
  }

  // ============ TICKET NOTES ============

  /**
   * Ajoute une note interne à un ticket
   */
  async addInternalNote(ticketId: string, note: string): Promise<SupportMessage> {
    return apiClient.post<SupportMessage>(`/support/tickets/${ticketId}/notes/`, {
      note,
      is_internal: true,
    });
  }

  /**
   * Récupère les notes internes d'un ticket
   */
  async getInternalNotes(ticketId: string): Promise<SupportMessage[]> {
    return apiClient.get<SupportMessage[]>(`/support/tickets/${ticketId}/notes/`);
  }

  // ============ AUTOMATED RESPONSES ============

  /**
   * Récupère les réponses automatiques disponibles
   */
  async getAutoResponses(): Promise<{
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
  }[]> {
    return apiClient.get('/support/auto-responses/');
  }

  /**
   * Suggère une réponse automatique pour un ticket
   */
  async suggestAutoResponse(ticketId: string): Promise<{
    suggestions: { title: string; content: string; confidence: number }[];
  }> {
    return apiClient.get(`/support/tickets/${ticketId}/auto-suggest/`);
  }

  // ============ ATTACHMENTS ============

  /**
   * Télécharge une pièce jointe d'un ticket
   */
  async downloadAttachment(attachmentId: string): Promise<Blob> {
    return apiClient.get(`/support/attachments/${attachmentId}/download/`, {
      responseType: 'blob',
    });
  }

  /**
   * Supprime une pièce jointe d'un ticket
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    return apiClient.delete(`/support/attachments/${attachmentId}/`);
  }

  // ============ ESCALATION ============

  /**
   * Récupère les niveaux d'escalade disponibles
   */
  async getEscalationLevels(): Promise<{
    level: number;
    name: string;
    description: string;
    responseTime: number;
  }[]> {
    return apiClient.get('/support/escalation/levels/');
  }

  /**
   * Récupère l'historique d'escalade d'un ticket
   */
  async getEscalationHistory(ticketId: string): Promise<{
    id: string;
    fromLevel: number;
    toLevel: number;
    reason: string;
    createdBy: string;
    createdAt: Date;
  }[]> {
    return apiClient.get(`/support/tickets/${ticketId}/escalation-history/`);
  }
}

export const supportService = SupportService.getInstance();