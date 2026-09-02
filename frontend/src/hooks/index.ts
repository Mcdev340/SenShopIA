/**
 * ============================================
 * HOOKS - EXPORT PRINCIPAL
 * ============================================
 * Ce fichier exporte tous les hooks personnalisés
 * de l'application ShopSense AI.
 * 
 * Les hooks sont organisés par catégorie :
 * - Hooks de store (authentification, panier, etc.)
 * - Hooks utilitaires (debounce, throttle, etc.)
 * - Hooks d'interaction (clickOutside, escapeKey, etc.)
 * - Hooks de formulaire (form, validation)
 * - Hooks UI (toast, modal, loading)
 * ============================================
 */

// ============================================
// 1. HOOKS DE STORE
// ============================================
// Ces hooks fournissent l'accès aux stores Zustand
// Ils sont les principaux hooks de l'application

export { useAuth } from './useAuth';
export { useCart } from './useCart';
export { useProducts } from './useProducts';
export { useOrders } from './useOrders';
export { useNotifications } from './useNotifications';
export { useUI } from './useUI';

// ============================================
// 2. HOOKS UTILITAIRES DE PERFORMANCE
// ============================================
// Optimisation des performances

export { useDebounce } from './useDebounce';
export { useThrottle } from './useThrottle';

// ============================================
// 3. HOOKS DE STOCKAGE
// ============================================
// Persistance des données

export { useLocalStorage } from './useLocalStorage';

// ============================================
// 4. HOOKS D'INTERACTION AVEC LE DOM
// ============================================
// Gestion des interactions utilisateur

export { useMediaQuery } from './useMediaQuery';
export { useClickOutside } from './useClickOutside';
export { useEscapeKey } from './useEscapeKey';
export { useWindowSize } from './useWindowSize';

// ============================================
// 5. HOOKS DE PAGINATION ET NAVIGATION
// ============================================
// Gestion des listes et de la navigation

export { usePagination } from './usePagination';

// ============================================
// 6. HOOKS DE FORMULAIRES
// ============================================
// Gestion des formulaires et validation

export { useForm } from './useForm';
export { useValidation } from './useValidation';

// ============================================
// 7. HOOKS UI
// ============================================
// Gestion de l'interface utilisateur

export { useToast } from './useToast';
export { useModal } from './useModal';
export { useLoading } from './useLoading';

// ============================================
// 8. HOOKS DE LOGGING
// ============================================
// Journalisation et débogage

export { useLogger } from './useLogger';

// ============================================
// EXPORT PAR DÉFAUT
// ============================================
// Pour une utilisation avec import * as hooks from '@/hooks'

export default {
  // Hooks de store
  useAuth,
  useCart,
  useProducts,
  useOrders,
  useNotifications,
  useUI,

  // Hooks utilitaires de performance
  useDebounce,
  useThrottle,

  // Hooks de stockage
  useLocalStorage,

  // Hooks d'interaction DOM
  useMediaQuery,
  useClickOutside,
  useEscapeKey,
  useWindowSize,

  // Hooks de pagination
  usePagination,

  // Hooks de formulaires
  useForm,
  useValidation,

  // Hooks UI
  useToast,
  useModal,
  useLoading,

  // Hooks de logging
  useLogger,
};

// ============================================
// TYPES EXPORTÉS
// ============================================
// Types pour les hooks

// Types de useAuth
export type { UseAuthReturn } from './useAuth';

// Types de useCart
export type { UseCartReturn } from './useCart';

// Types de useProducts
export type { UseProductsReturn } from './useProducts';

// Types de useOrders
export type { UseOrdersReturn } from './useOrders';

// Types de useNotifications
export type { UseNotificationsReturn } from './useNotifications';

// Types de useUI
export type { UseUIReturn } from './useUI';

// Types de useForm
export type { UseFormReturn } from './useForm';

// Types de useValidation
export type { UseValidationReturn, ValidationSchema } from './useValidation';

// Types de usePagination
export type { UsePaginationReturn } from './usePagination';

// Types de useDebounce
export type { UseDebounceReturn } from './useDebounce';

// Types de useThrottle
export type { UseThrottleReturn } from './useThrottle';

// Types de useLocalStorage
export type { UseLocalStorageReturn } from './useLocalStorage';

// Types de useMediaQuery
export type { UseMediaQueryReturn } from './useMediaQuery';

// Types de useClickOutside
export type { UseClickOutsideReturn } from './useClickOutside';

// Types de useEscapeKey
export type { UseEscapeKeyReturn } from './useEscapeKey';

// Types de useWindowSize
export type { UseWindowSizeReturn } from './useWindowSize';

// Types de useToast
export type { UseToastReturn } from './useToast';

// Types de useModal
export type { UseModalReturn } from './useModal';

// Types de useLoading
export type { UseLoadingWithKeyReturn, UseLoadingGlobalReturn } from './useLoading';

// Types de useLogger
export type { UseLoggerReturn } from './useLogger';