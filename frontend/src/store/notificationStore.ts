import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';
import { 
  Notification, 
  NotificationType, 
  NotificationCategory,
  NotificationPriority,
  NotificationPreferences,
  NotificationFilter,
  NotificationStats,
} from '@/types/notification';
import { notificationService } from '@/services/notification.service';
import { ApiError } from '@/lib/api-client';
import { logger } from '@/lib/logger';

// ============ TYPES ============

export interface NotificationState {
  // Données
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  stats: NotificationStats | null;
  
  // État
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  
  // Pagination
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  
  // Filtres
  filters: NotificationFilter;
  
  // Retry
  retryCount: number;
  maxRetries: number;
  
  // Actions
  loadNotifications: (filters?: Partial<NotificationFilter>) => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  loadPreferences: () => Promise<void>;
  loadStats: () => Promise<void>;
  refresh: () => Promise<void>;
  
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  markMultipleAsRead: (ids: string[]) => Promise<boolean>;
  
  deleteNotification: (id: string) => Promise<boolean>;
  deleteAllNotifications: () => Promise<boolean>;
  clearReadNotifications: () => Promise<boolean>;
  
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<boolean>;
  updateChannelPreference: (
    channel: string,
    type: string,
    enabled: boolean
  ) => Promise<boolean>;
  
  setFilters: (filters: Partial<NotificationFilter>) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  
  getUnreadByType: (type: NotificationType) => number;
  getNotificationsByCategory: (category: NotificationCategory) => Notification[];
  getUnreadByPriority: (priority: NotificationPriority) => number;
  
  clearError: () => void;
  reset: () => void;
}

// ============ INITIAL STATE ============

const initialFilters: NotificationFilter = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const initialState: Omit<NotificationState, 
  | 'loadNotifications'
  | 'loadUnreadCount'
  | 'loadPreferences'
  | 'loadStats'
  | 'refresh'
  | 'markAsRead'
  | 'markAllAsRead'
  | 'markMultipleAsRead'
  | 'deleteNotification'
  | 'deleteAllNotifications'
  | 'clearReadNotifications'
  | 'updatePreferences'
  | 'updateChannelPreference'
  | 'setFilters'
  | 'resetFilters'
  | 'goToPage'
  | 'nextPage'
  | 'previousPage'
  | 'getUnreadByType'
  | 'getNotificationsByCategory'
  | 'getUnreadByPriority'
  | 'clearError'
  | 'reset'
> = {
  notifications: [],
  unreadCount: 0,
  preferences: null,
  stats: null,
  loading: false,
  refreshing: false,
  error: null,
  status: 'idle' as const,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  filters: initialFilters,
  retryCount: 0,
  maxRetries: 3,
};

// ============ STORE ============

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============ CHARGEMENT ============

      loadNotifications: async (filters?: Partial<NotificationFilter>) => {
        // Éviter les doubles chargements
        if (get().loading) return;
        
        set({ loading: true, error: null, status: 'loading' });
        try {
          const currentFilters = { ...get().filters, ...filters };
          const result = await notificationService.getNotifications(currentFilters);
          
          set({
            notifications: result.notifications,
            total: result.total,
            page: result.page,
            limit: result.limit || 20,
            totalPages: result.totalPages,
            unreadCount: result.unreadCount,
            filters: currentFilters,
            loading: false,
            status: 'success',
            retryCount: 0,
          });
          
          logger.info('Notifications loaded', { 
            count: result.notifications.length, 
            total: result.total,
            unread: result.unreadCount,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des notifications';
          const retryCount = get().retryCount;
          
          // Tentative de retry
          if (retryCount < get().maxRetries) {
            set({ retryCount: retryCount + 1 });
            setTimeout(() => {
              get().loadNotifications(filters);
            }, 1000 * (retryCount + 1));
            return;
          }
          
          set({ 
            error: message, 
            loading: false, 
            status: 'error' 
          });
          logger.error('Failed to load notifications', error);
        }
      },

      loadUnreadCount: async () => {
        try {
          const result = await notificationService.getUnreadCount();
          set({ unreadCount: result.count });
        } catch (error) {
          logger.error('Failed to load unread count', error);
        }
      },

      loadPreferences: async () => {
        set({ loading: true, error: null });
        try {
          const preferences = await notificationService.getPreferences();
          set({ 
            preferences, 
            loading: false,
            status: 'success',
          });
          logger.info('Preferences loaded');
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des préférences';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to load preferences', error);
        }
      },

      loadStats: async () => {
        set({ loading: true, error: null });
        try {
          // Récupération des statistiques depuis le service
          const stats = await notificationService.getNotificationStats?.() || null;
          set({ 
            stats, 
            loading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des statistiques';
          set({ 
            error: message, 
            loading: false,
          });
          logger.error('Failed to load stats', error);
        }
      },

      refresh: async () => {
        if (get().refreshing) return;
        
        set({ refreshing: true });
        try {
          await get().loadNotifications();
          await get().loadUnreadCount();
          set({ refreshing: false });
        } catch (error) {
          set({ refreshing: false });
          logger.error('Failed to refresh notifications', error);
        }
      },

      // ============ MARQUAGE ============

      markAsRead: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await notificationService.markAsRead(id);
          
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
            loading: false,
          }));
          
          logger.info('Notification marked as read', { notificationId: id });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de marquage';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to mark notification as read', error);
          return false;
        }
      },

      markAllAsRead: async () => {
        set({ loading: true, error: null });
        try {
          await notificationService.markAllAsRead();
          
          set((state) => ({
            notifications: state.notifications.map((n) => ({ 
              ...n, 
              isRead: true, 
              readAt: new Date() 
            })),
            unreadCount: 0,
            loading: false,
          }));
          
          logger.info('All notifications marked as read');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de marquage';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to mark all notifications as read', error);
          return false;
        }
      },

      markMultipleAsRead: async (ids: string[]) => {
        if (ids.length === 0) return true;
        
        set({ loading: true, error: null });
        try {
          // Appel batch si disponible, sinon boucle
          if (notificationService.markMultipleAsRead) {
            await notificationService.markMultipleAsRead(ids);
          } else {
            await Promise.all(ids.map(id => notificationService.markAsRead(id)));
          }
          
          set((state) => ({
            notifications: state.notifications.map((n) =>
              ids.includes(n.id) ? { ...n, isRead: true, readAt: new Date() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - ids.length),
            loading: false,
          }));
          
          logger.info('Multiple notifications marked as read', { count: ids.length });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de marquage';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to mark multiple notifications as read', error);
          return false;
        }
      },

      // ============ SUPPRESSION ============

      deleteNotification: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await notificationService.deleteNotification(id);
          
          const removed = get().notifications.find(n => n.id === id);
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: removed && !removed.isRead 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount,
            loading: false,
          }));
          
          logger.info('Notification deleted', { notificationId: id });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de suppression';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to delete notification', error);
          return false;
        }
      },

      deleteAllNotifications: async () => {
        set({ loading: true, error: null });
        try {
          await notificationService.deleteAllNotifications();
          
          set({
            notifications: [],
            unreadCount: 0,
            loading: false,
          });
          
          logger.info('All notifications deleted');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de suppression';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to delete all notifications', error);
          return false;
        }
      },

      clearReadNotifications: async () => {
        set({ loading: true, error: null });
        try {
          if (notificationService.clearReadNotifications) {
            await notificationService.clearReadNotifications();
          } else {
            // Fallback: supprimer manuellement les notifications lues
            const readIds = get().notifications
              .filter(n => n.isRead)
              .map(n => n.id);
            await Promise.all(readIds.map(id => notificationService.deleteNotification(id)));
          }
          
          set((state) => ({
            notifications: state.notifications.filter((n) => !n.isRead),
            loading: false,
          }));
          
          logger.info('Read notifications cleared');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de suppression';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to clear read notifications', error);
          return false;
        }
      },

      // ============ PRÉFÉRENCES ============

      updatePreferences: async (preferences: Partial<NotificationPreferences>) => {
        set({ loading: true, error: null });
        try {
          const updated = await notificationService.updatePreferences(preferences);
          set({ 
            preferences: updated, 
            loading: false,
            status: 'success',
          });
          logger.info('Preferences updated');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour des préférences';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to update preferences', error);
          return false;
        }
      },

      updateChannelPreference: async (channel: string, type: string, enabled: boolean) => {
        set({ loading: true, error: null });
        try {
          let updated: NotificationPreferences;
          if (notificationService.updateChannelPreference) {
            updated = await notificationService.updateChannelPreference(
              channel as any,
              type as any,
              enabled
            );
          } else {
            // Fallback: update via preferences
            const current = get().preferences || (await notificationService.getPreferences());
            updated = await notificationService.updatePreferences({
              ...current,
              channels: {
                ...current.channels,
                [channel]: {
                  ...current.channels[channel],
                  enabled,
                },
              },
            });
          }
          
          set({ 
            preferences: updated, 
            loading: false,
          });
          logger.info('Channel preference updated', { channel, type, enabled });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to update channel preference', error);
          return false;
        }
      },

      // ============ FILTRES ============

      setFilters: (filters: Partial<NotificationFilter>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
        get().loadNotifications();
      },

      resetFilters: () => {
        set({ filters: initialFilters });
        get().loadNotifications();
      },

      goToPage: (page: number) => {
        const { totalPages } = get();
        if (page < 1 || page > totalPages) return;
        set({ page });
        get().loadNotifications({ page });
      },

      nextPage: () => {
        const { page, totalPages } = get();
        if (page < totalPages) {
          get().goToPage(page + 1);
        }
      },

      previousPage: () => {
        const { page } = get();
        if (page > 1) {
          get().goToPage(page - 1);
        }
      },

      // ============ UTILITAIRES ============

      getUnreadByType: (type: NotificationType) => {
        return get().notifications.filter(
          n => n.type === type && !n.isRead
        ).length;
      },

      getNotificationsByCategory: (category: NotificationCategory) => {
        return get().notifications.filter(
          n => n.category === category
        );
      },

      getUnreadByPriority: (priority: NotificationPriority) => {
        return get().notifications.filter(
          n => n.priority === priority && !n.isRead
        ).length;
      },

      clearError: () => {
        set({ error: null, status: 'idle' });
      },

      reset: () => {
        set({
          ...initialState,
          preferences: get().preferences, // Conserver les préférences
        });
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        unreadCount: state.unreadCount,
        filters: state.filters,
      }),
    }
  )
);

// ============ HOOKS PERSONNALISÉS ============

/**
 * Hook pour utiliser les notifications avec filtres
 */
export const useNotifications = (filters?: Partial<NotificationFilter>) => {
  const store = useNotificationStore();
  
  React.useEffect(() => {
    if (filters) {
      store.setFilters(filters);
    } else {
      store.loadNotifications();
    }
  }, [JSON.stringify(filters)]);
  
  return {
    notifications: store.notifications,
    loading: store.loading,
    refreshing: store.refreshing,
    error: store.error,
    total: store.total,
    page: store.page,
    totalPages: store.totalPages,
    unreadCount: store.unreadCount,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    deleteNotification: store.deleteNotification,
    refresh: store.refresh,
    goToPage: store.goToPage,
    nextPage: store.nextPage,
    previousPage: store.previousPage,
  };
};

/**
 * Hook pour le compteur de notifications non lues
 */
export const useUnreadCount = () => {
  const { unreadCount, loadUnreadCount } = useNotificationStore();
  
  React.useEffect(() => {
    loadUnreadCount();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return unreadCount;
};

/**
 * Hook pour les préférences de notification
 */
export const useNotificationPreferences = () => {
  const { preferences, loadPreferences, updatePreferences, loading } = useNotificationStore();
  
  React.useEffect(() => {
    loadPreferences();
  }, []);
  
  return {
    preferences,
    loading,
    updatePreferences,
    updateChannel: (channel: string, type: string, enabled: boolean) => {
      return useNotificationStore.getState().updateChannelPreference(channel, type, enabled);
    },
  };
};

// ============ EXPORT ============

export default useNotificationStore;