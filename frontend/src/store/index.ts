/**
 * Export principal des stores
 * Ce fichier exporte tous les stores et leurs types pour une utilisation facile
 */

// ============ EXPORT DES STORES ============

export { useAuthStore } from './authStore';
export { useCartStore } from './cartStore';
export { useUIStore } from './uiStore';
export { useProductStore } from './productStore';
export { useOrderStore } from './orderStore';
export { useNotificationStore } from './notificationStore';

// ============ EXPORT DES TYPES ============

// Types de base
export type {
  BaseState,
  StateWithStatus,
  BaseActions,
  StatusActions,
} from './types';

// Types paginés
export type {
  PaginatedState,
  PaginatedActions,
} from './types';

// Types sélectionnables
export type {
  SelectableState,
  SelectableActions,
} from './types';

// Types filtrables
export type {
  FilterableState,
  FilterableActions,
} from './types';

// Types triables
export type {
  SortableState,
  SortableActions,
} from './types';

// Types asynchrones
export type {
  AsyncState,
  AsyncActions,
} from './types';

// Types toasts
export type {
  ToastState,
  ToastActions,
  Toast,
} from './types';

// Types historiques
export type {
  HistoryState,
  HistoryActions,
} from './types';

// Types validation
export type {
  ValidationState,
  ValidationActions,
} from './types';

// Types combinés
export type {
  CombinedState,
  FullStoreState,
  StateCreator,
} from './types';

// ============ EXPORT DES TYPES DES STORES ============

// Auth store types
export type {
  AuthState,
} from './authStore';

// Cart store types
export type {
  CartState,
} from './cartStore';

// UI store types
export type {
  UIState,
  Theme,
  Language,
} from './uiStore';

// Product store types
export type {
  ProductState,
} from './productStore';

// Order store types
export type {
  OrderState,
} from './orderStore';

// Notification store types
export type {
  NotificationState,
} from './notificationStore';

// ============ EXPORT DES VALEURS PAR DÉFAUT ============

// Pour utiliser les stores avec des imports nommés ou par défaut
import { useAuthStore } from './authStore';
import { useCartStore } from './cartStore';
import { useUIStore } from './uiStore';
import { useProductStore } from './productStore';
import { useOrderStore } from './orderStore';
import { useNotificationStore } from './notificationStore';

export default {
  useAuthStore,
  useCartStore,
  useUIStore,
  useProductStore,
  useOrderStore,
  useNotificationStore,
};

// ============ HOOKS PERSONNALISÉS POUR LES STORES ============

/**
 * Hook pour réinitialiser tous les stores
 * Utile pour la déconnexion ou le reset de l'application
 */
export const resetAllStores = () => {
  useAuthStore.getState().reset();
  useCartStore.getState().reset();
  useUIStore.getState().reset();
  useProductStore.getState().reset();
  useOrderStore.getState().reset();
  useNotificationStore.getState().reset();
};

/**
 * Hook pour charger toutes les données initiales
 * Utile au démarrage de l'application
 */
export const loadInitialData = async () => {
  const promises = [];

  // Charger le panier si l'utilisateur est connecté
  if (useAuthStore.getState().isAuthenticated) {
    promises.push(useCartStore.getState().loadCart());
  }

  // Charger les produits populaires
  promises.push(useProductStore.getState().loadPopularProducts());

  // Charger les produits en vedette
  promises.push(useProductStore.getState().loadFeaturedProducts());

  // Charger les catégories
  promises.push(useProductStore.getState().loadCategories());

  // Charger les notifications non lues
  if (useAuthStore.getState().isAuthenticated) {
    promises.push(useNotificationStore.getState().loadUnreadCount());
  }

  await Promise.allSettled(promises);
};

/**
 * Hook pour nettoyer les stores (libération de mémoire)
 * Utile pour les composants qui se démontent
 */
export const cleanupStores = () => {
  // Nettoyer les erreurs
  useAuthStore.getState().clearError();
  useCartStore.getState().clearError();
  useProductStore.getState().clearError();
  useOrderStore.getState().clearError();
  useNotificationStore.getState().clearError();

  // Nettoyer les sélections
  useProductStore.getState().clearSelected();
  useOrderStore.getState().clearSelected();
};