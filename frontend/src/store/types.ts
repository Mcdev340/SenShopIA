/**
 * Types partagés pour les stores Zustand
 * Ces types sont utilisés par les stores du projet
 */

// ============ ÉTATS DE BASE ============

/**
 * État de base pour un store avec chargement et erreur
 */
export interface BaseState {
  loading: boolean;
  error: string | null;
}

/**
 * État avec statut (idle, loading, success, error)
 */
export interface StateWithStatus extends BaseState {
  status: 'idle' | 'loading' | 'success' | 'error';
}

/**
 * Actions de base pour un store
 */
export interface BaseActions {
  reset: () => void;
  clearError: () => void;
}

/**
 * Actions avec statut
 */
export interface StatusActions extends BaseActions {
  setLoading: () => void;
  setSuccess: () => void;
  setError: (error: string) => void;
  setIdle: () => void;
}

// ============ ÉTATS PAGINÉS ============

/**
 * État paginé pour les listes
 */
export interface PaginatedState<T> extends BaseState {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Actions pour les listes paginées
 */
export interface PaginatedActions<T> extends BaseActions {
  setItems: (items: T[]) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  addItem: (item: T) => void;
  updateItem: (id: string, data: Partial<T>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

// ============ ÉTATS SÉLECTIONNABLES ============

/**
 * État avec sélection
 */
export interface SelectableState<T> {
  selected: T | null;
  selectedId: string | null;
}

/**
 * Actions pour la sélection
 */
export interface SelectableActions<T> {
  select: (item: T) => void;
  selectById: (id: string) => void;
  clearSelected: () => void;
  isSelected: (id: string) => boolean;
}

// ============ ÉTATS FILTRABLES ============

/**
 * État avec filtres
 */
export interface FilterableState<F> {
  filters: F;
}

/**
 * Actions pour les filtres
 */
export interface FilterableActions<F> {
  setFilters: (filters: Partial<F>) => void;
  resetFilters: () => void;
  clearFilters: () => void;
  updateFilter: <K extends keyof F>(key: K, value: F[K]) => void;
}

// ============ ÉTATS TRIABLES ============

/**
 * État avec tri
 */
export interface SortableState<T> {
  sortBy: keyof T | null;
  sortOrder: 'asc' | 'desc';
}

/**
 * Actions pour le tri
 */
export interface SortableActions<T> {
  setSort: (field: keyof T, order?: 'asc' | 'desc') => void;
  toggleSort: (field: keyof T) => void;
  clearSort: () => void;
}

// ============ ÉTATS ASYNCHRONES ============

/**
 * État pour les données asynchrones
 */
export interface AsyncState<T> extends BaseState {
  data: T | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

/**
 * Actions pour les données asynchrones
 */
export interface AsyncActions<T> extends BaseActions {
  setData: (data: T | null) => void;
  setLoading: () => void;
  setSuccess: (data: T) => void;
  setError: (error: string) => void;
  setIdle: () => void;
  hasData: () => boolean;
}

// ============ ÉTATS AVEC TOASTS ============

/**
 * Toast notification
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

/**
 * État avec toasts
 */
export interface ToastState {
  toasts: Toast[];
}

/**
 * Actions pour les toasts
 */
export interface ToastActions {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

// ============ ÉTATS AVEC HISTORIQUE ============

/**
 * État avec historique (undo/redo)
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

/**
 * Actions pour l'historique
 */
export interface HistoryActions<T> {
  push: (state: T) => void;
  undo: () => T | null;
  redo: () => T | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

// ============ ÉTATS AVEC VALIDATION ============

/**
 * État avec validation
 */
export interface ValidationState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Actions pour la validation
 */
export interface ValidationActions<T> {
  setData: (data: T) => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearError: <K extends keyof T>(field: K) => void;
  clearAllErrors: () => void;
  validate: () => boolean;
  reset: () => void;
}

// ============ COMBINAISON D'ÉTATS ============

/**
 * Combine plusieurs états en un seul
 */
export type CombinedState<T extends Record<string, any>> = T & BaseState;

/**
 * État complet d'un store avec toutes les fonctionnalités
 */
export type FullStoreState<T, F = any> = 
  BaseState & 
  Partial<PaginatedState<T>> & 
  Partial<SelectableState<T>> & 
  Partial<FilterableState<F>> &
  Partial<SortableState<T>>;

/**
 * Créateur d'état
 */
export type StateCreator<T> = {
  initialState: T;
  create: (set: any, get: any) => T;
};

// ============ EXPORT ============

// États
export type {
  // Base
  BaseState,
  StateWithStatus,
  
  // Paginé
  PaginatedState,
  
  // Sélection
  SelectableState,
  
  // Filtres
  FilterableState,
  
  // Tri
  SortableState,
  
  // Asynchrone
  AsyncState,
  
  // Toasts
  ToastState,
  
  // Historique
  HistoryState,
  
  // Validation
  ValidationState,
  
  // Combiné
  FullStoreState,
};

// Actions
export type {
  // Base
  BaseActions,
  StatusActions,
  
  // Paginé
  PaginatedActions,
  
  // Sélection
  SelectableActions,
  
  // Filtres
  FilterableActions,
  
  // Tri
  SortableActions,
  
  // Asynchrone
  AsyncActions,
  
  // Toasts
  ToastActions,
  
  // Historique
  HistoryActions,
  
  // Validation
  ValidationActions,
};

// Types utilitaires
export type {
  Toast,
  StateCreator,
  CombinedState,
};

// ============ EXPORT PAR DÉFAUT ============

export default {
  // États
  BaseState: {} as BaseState,
  StateWithStatus: {} as StateWithStatus,
  PaginatedState: {} as PaginatedState<any>,
  SelectableState: {} as SelectableState<any>,
  FilterableState: {} as FilterableState<any>,
  SortableState: {} as SortableState<any>,
  AsyncState: {} as AsyncState<any>,
  ToastState: {} as ToastState,
  HistoryState: {} as HistoryState<any>,
  ValidationState: {} as ValidationState<any>,
  FullStoreState: {} as FullStoreState<any>,

  // Actions
  BaseActions: {} as BaseActions,
  StatusActions: {} as StatusActions,
  PaginatedActions: {} as PaginatedActions<any>,
  SelectableActions: {} as SelectableActions<any>,
  FilterableActions: {} as FilterableActions<any>,
  SortableActions: {} as SortableActions<any>,
  AsyncActions: {} as AsyncActions<any>,
  ToastActions: {} as ToastActions,
  HistoryActions: {} as HistoryActions<any>,
  ValidationActions: {} as ValidationActions<any>,

  // Utilitaires
  Toast: {} as Toast,
  StateCreator: {} as StateCreator<any>,
  CombinedState: {} as CombinedState<any>,
};