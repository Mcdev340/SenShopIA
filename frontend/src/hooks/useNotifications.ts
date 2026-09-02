import { useNotificationStore } from '@/store/notificationStore';

/**
 * Hook pour les notifications
 * Utilise le store notificationStore
 * 
 * @returns {Object} État et actions des notifications
 * 
 * @example
 * const { notifications, markAsRead, unreadCount } = useNotifications();
 * 
 * // Marquer une notification comme lue
 * await markAsRead('notification-id');
 */
export const useNotifications = () => {
  const store = useNotificationStore();
  
  return {
    // ============ ÉTAT ============
    /** Liste des notifications */
    notifications: store.notifications,
    /** Nombre de notifications non lues */
    unreadCount: store.unreadCount,
    /** Préférences de notification */
    preferences: store.preferences,
    /** Statistiques des notifications */
    stats: store.stats,
    /** En cours de chargement */
    loading: store.loading,
    /** Erreur */
    error: store.error,
    /** Statut */
    status: store.status,
    
    // ============ PAGINATION ============
    /** Total des notifications */
    total: store.total,
    /** Page actuelle */
    page: store.page,
    /** Limite par page */
    limit: store.limit,
    /** Nombre total de pages */
    totalPages: store.totalPages,
    /** Filtres actuels */
    filters: store.filters,
    
    // ============ ACTIONS PRINCIPALES ============
    /** Charger les notifications */
    loadNotifications: store.loadNotifications,
    /** Charger le nombre de non lues */
    loadUnreadCount: store.loadUnreadCount,
    /** Charger les préférences */
    loadPreferences: store.loadPreferences,
    /** Charger les statistiques */
    loadStats: store.loadStats,
    /** Rafraîchir */
    refresh: store.refresh,
    
    // ============ MARQUAGE ============
    /** Marquer comme lue */
    markAsRead: store.markAsRead,
    /** Marquer toutes comme lues */
    markAllAsRead: store.markAllAsRead,
    /** Marquer plusieurs comme lues */
    markMultipleAsRead: store.markMultipleAsRead,
    
    // ============ SUPPRESSION ============
    /** Supprimer une notification */
    deleteNotification: store.deleteNotification,
    /** Supprimer toutes les notifications */
    deleteAllNotifications: store.deleteAllNotifications,
    /** Supprimer les notifications lues */
    clearReadNotifications: store.clearReadNotifications,
    
    // ============ PRÉFÉRENCES ============
    /** Mettre à jour les préférences */
    updatePreferences: store.updatePreferences,
    /** Mettre à jour une préférence de canal */
    updateChannelPreference: store.updateChannelPreference,
    
    // ============ FILTRES ET PAGINATION ============
    /** Définir les filtres */
    setFilters: store.setFilters,
    /** Réinitialiser les filtres */
    resetFilters: store.resetFilters,
    /** Aller à une page */
    goToPage: store.goToPage,
    /** Page suivante */
    nextPage: store.nextPage,
    /** Page précédente */
    previousPage: store.previousPage,
    
    // ============ UTILITAIRES ============
    /** Récupérer les non lues par type */
    getUnreadByType: store.getUnreadByType,
    /** Récupérer les notifications par catégorie */
    getNotificationsByCategory: store.getNotificationsByCategory,
    /** Récupérer les non lues par priorité */
    getUnreadByPriority: store.getUnreadByPriority,
    
    /** Effacer l'erreur */
    clearError: store.clearError,
    /** Réinitialiser le store */
    reset: store.reset,
  };
};