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

import { useAuth } from "./useAuth";
import { useCart } from "./useCart";
import { useProducts } from "./useProducts";
import { useOrders } from "./useOrders";
import { useNotifications } from "./useNotifications";
import { useUI } from "./useUI";

// ============================================
// 2. HOOKS UTILITAIRES DE PERFORMANCE
// ============================================
// Optimisation des performances

import { useDebounce } from "./useDebounce";
import { useThrottle } from "./useThrottle";

// ============================================
// 3. HOOKS DE STOCKAGE
// ============================================
// Persistance des données

import { useLocalStorage } from "./useLocalStorage";

// ============================================
// 4. HOOKS D'INTERACTION AVEC LE DOM
// ============================================
// Gestion des interactions utilisateur

import { useMediaQuery } from "./useMediaQuery";
import { useClickOutside } from "./useClickOutside";
import { useEscapeKey } from "./useEscapeKey";
import { useWindowSize } from "./useWindowSize";

// ============================================
// 5. HOOKS DE PAGINATION ET NAVIGATION
// ============================================
// Gestion des listes et de la navigation

import { usePagination } from "./usePagination";

// ============================================
// 6. HOOKS DE FORMULAIRES
// ============================================
// Gestion des formulaires et validation

import { useForm } from "./useForm";
import { useValidation } from "./useValidation";

// ============================================
// 7. HOOKS UI
// ============================================
// Gestion de l'interface utilisateur

import { useToast } from "./useToast";
import { useModal } from "./useModal";
import { useLoading } from "./useLoading";

// ============================================
// 8. HOOKS DE LOGGING
// ============================================
// Journalisation et débogage

import { useLogger } from "./useLogger";

export {
  useAuth,
  useCart,
  useProducts,
  useOrders,
  useNotifications,
  useUI,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useMediaQuery,
  useClickOutside,
  useEscapeKey,
  useWindowSize,
  usePagination,
  useForm,
  useValidation,
  useToast,
  useModal,
  useLoading,
  useLogger,
};

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

// Types de useForm
export type { UseFormReturn } from "./useForm";

// Types de useValidation
export type { UseValidationReturn, ValidationSchema } from "./useValidation";

// Types de usePagination
export type { UsePaginationReturn } from "./usePagination";

// Types de useDebounce
export type { UseDebounceReturn } from "./useDebounce";

// Types de useThrottle
export type { UseThrottleReturn } from "./useThrottle";

// Types de useLocalStorage
export type { UseLocalStorageReturn } from "./useLocalStorage";

// Types de useMediaQuery
export type { UseMediaQueryReturn } from "./useMediaQuery";

// Types de useClickOutside
export type { UseClickOutsideReturn } from "./useClickOutside";

// Types de useEscapeKey
export type { UseEscapeKeyReturn } from "./useEscapeKey";

// Types de useWindowSize
export type { UseWindowSizeReturn } from "./useWindowSize";

// Types de useToast
export type { UseToastReturn } from "./useToast";

// Types de useModal
export type { UseModalReturn } from "./useModal";

// Types de useLoading
export type {
  UseLoadingWithKeyReturn,
  UseLoadingGlobalReturn,
} from "./useLoading";

// Types de useLogger
export type { UseLoggerReturn } from "./useLogger";
