import { useUIStore } from "@/store/uiStore";
import { Toast, ToastType } from "@/store/uiStore";
import { useCallback, useEffect, useRef } from "react";

/**
 * Options pour le hook useToast
 */
export interface UseToastOptions {
  /** Durée d'affichage en millisecondes (défaut: 5000) */
  duration?: number;
  /** Position du toast (défaut: 'top-right') */
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
  /** Titre du toast */
  title?: string;
  /** Icône personnalisée */
  icon?: string;
  /** Action du toast */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Peut être fermé par l'utilisateur (défaut: true) */
  dismissible?: boolean;
  /** Callback appelé à l'ouverture */
  onOpen?: () => void;
  /** Callback appelé à la fermeture */
  onClose?: () => void;
  /** Callback appelé au clic */
  onClick?: () => void;
}

/**
 * Retour du hook useToast
 */
export interface UseToastReturn {
  /** Liste des toasts */
  toasts: Toast[];
  /** Ajouter un toast */
  addToast: (toast: Omit<Toast, "id">) => string;
  /** Supprimer un toast */
  removeToast: (id: string) => void;
  /** Effacer tous les toasts */
  clearToasts: () => void;
  /** Récupérer un toast par ID */
  getToastById: (id: string) => Toast | null;
  /** Mettre à jour un toast */
  updateToast: (id: string, toast: Partial<Toast>) => void;
  /** Toast de succès */
  success: (
    message: string,
    options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
  ) => string;
  /** Toast d'erreur */
  error: (
    message: string,
    options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
  ) => string;
  /** Toast d'avertissement */
  warning: (
    message: string,
    options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
  ) => string;
  /** Toast d'information */
  info: (
    message: string,
    options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
  ) => string;
  /** Toast personnalisé */
  custom: (
    message: string,
    type: ToastType,
    options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
  ) => string;
  /** Toast avec promesse */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
      duration?: number;
    },
  ) => Promise<T>;
}

/**
 * Hook pour les toasts (notifications temporaires)
 * Utilise le store uiStore
 *
 * @param defaultOptions - Options par défaut
 * @returns {Object} Méthodes pour gérer les toasts
 *
 * @example
 * // Exemple basique
 * const { success, error, warning, info } = useToast();
 *
 * // Toast de succès
 * success('Opération réussie !');
 *
 * // Toast d'erreur avec titre
 * error('Une erreur est survenue', { title: 'Erreur' });
 *
 * // Toast personnalisé
 * const { addToast } = useToast();
 * addToast({
 *   type: 'info',
 *   message: 'Message personnalisé',
 *   duration: 3000,
 *   action: { label: 'Voir', onClick: () => {} }
 * });
 *
 * // Avec options par défaut
 * const toast = useToast({
 *   duration: 3000,
 *   position: 'bottom-center',
 *   dismissible: false
 * });
 */
export const useToast = (
  defaultOptions: Partial<UseToastOptions> = {},
): UseToastReturn => {
  const store = useUIStore();

  // Référence pour les timeout
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutRefs.current.clear();
    };
  }, []);

  // Fonction pour créer un toast avec options
  const createToast = useCallback(
    (
      message: string,
      type: ToastType,
      options: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick"> = {},
    ): string => {
      const {
        duration = defaultOptions.duration || 5000,
        position: _position = defaultOptions.position || "top-right",
        title = defaultOptions.title,
        icon = defaultOptions.icon,
        action = defaultOptions.action,
        dismissible = defaultOptions.dismissible !== undefined
          ? defaultOptions.dismissible
          : true,
      } = options;

      // Ajouter le toast au store
      const id = store.addToast({
        type,
        message,
        title,
        icon,
        duration,
        action,
        dismissible,
      });

      // Si une durée est spécifiée, auto-supprimer
      if (duration > 0) {
        const timeout = setTimeout(() => {
          store.removeToast(id);
          timeoutRefs.current.delete(id);
        }, duration);
        timeoutRefs.current.set(id, timeout);
      }

      return id;
    },
    [store, defaultOptions],
  );

  // Supprimer un toast
  const removeToast = useCallback(
    (id: string) => {
      // Nettoyer le timeout si existe
      const timeout = timeoutRefs.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        timeoutRefs.current.delete(id);
      }
      store.removeToast(id);
    },
    [store],
  );

  // Effacer tous les toasts
  const clearToasts = useCallback(() => {
    // Nettoyer tous les timeouts
    timeoutRefs.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeoutRefs.current.clear();
    store.clearToasts();
  }, [store]);

  // Mettre à jour un toast
  const updateToast = useCallback(
    (id: string, toast: Partial<Toast>) => {
      store.updateToast(id, toast);
    },
    [store],
  );

  // Récupérer un toast par ID
  const getToastById = useCallback(
    (id: string) => {
      return store.getToastById(id);
    },
    [store],
  );

  // Toast de succès
  const success = useCallback(
    (
      message: string,
      options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
    ) => {
      return createToast(message, "success", options);
    },
    [createToast],
  );

  // Toast d'erreur
  const error = useCallback(
    (
      message: string,
      options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
    ) => {
      return createToast(message, "error", options);
    },
    [createToast],
  );

  // Toast d'avertissement
  const warning = useCallback(
    (
      message: string,
      options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
    ) => {
      return createToast(message, "warning", options);
    },
    [createToast],
  );

  // Toast d'information
  const info = useCallback(
    (
      message: string,
      options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
    ) => {
      return createToast(message, "info", options);
    },
    [createToast],
  );

  // Toast personnalisé
  const custom = useCallback(
    (
      message: string,
      type: ToastType,
      options?: Omit<UseToastOptions, "onOpen" | "onClose" | "onClick">,
    ) => {
      return createToast(message, type, options);
    },
    [createToast],
  );

  // Toast avec promesse
  const promise = useCallback(
    <T>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
        duration?: number;
      },
    ): Promise<T> => {
      const {
        loading,
        success,
        error: errorMessage,
        duration = defaultOptions.duration || 5000,
      } = options;

      // Afficher le toast de chargement
      const loadingId = createToast(loading, "info", {
        duration: 0,
        dismissible: false,
      });

      return promise
        .then((data) => {
          // Supprimer le toast de chargement
          removeToast(loadingId);

          // Afficher le toast de succès
          const successMessage =
            typeof success === "function" ? success(data) : success;
          createToast(successMessage, "success", {
            duration,
          });

          return data;
        })
        .catch((error) => {
          // Supprimer le toast de chargement
          removeToast(loadingId);

          // Afficher le toast d'erreur
          const resolvedErrorMessage =
            typeof errorMessage === "function"
              ? errorMessage(error)
              : errorMessage;
          createToast(resolvedErrorMessage, "error", {
            duration,
          });

          throw error;
        });
    },
    [createToast, removeToast, defaultOptions.duration],
  );

  // Ajouter un toast personnalisé
  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = store.addToast(toast);

      // Si une durée est spécifiée, auto-supprimer
      if (toast.duration && toast.duration > 0) {
        const timeout = setTimeout(() => {
          store.removeToast(id);
          timeoutRefs.current.delete(id);
        }, toast.duration);
        timeoutRefs.current.set(id, timeout);
      }

      return id;
    },
    [store],
  );

  return {
    toasts: store.toasts,
    addToast,
    removeToast,
    clearToasts,
    getToastById,
    updateToast,
    success,
    error,
    warning,
    info,
    custom,
    promise,
  };
};

/**
 * Hook pour créer un toast avec une durée personnalisée
 *
 * @param duration - Durée par défaut
 * @returns {Object} Méthodes pour gérer les toasts
 *
 * @example
 * const toast = useTimedToast(3000);
 * toast.success('Message affiché pendant 3 secondes');
 */
export const useTimedToast = (duration: number = 3000): UseToastReturn => {
  return useToast({ duration });
};

/**
 * Hook pour créer des toasts avec une position spécifique
 *
 * @param position - Position des toasts
 * @returns {Object} Méthodes pour gérer les toasts
 *
 * @example
 * const toast = usePositionedToast('bottom-center');
 * toast.success('Toast en bas au centre');
 */
export const usePositionedToast = (
  position:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center" = "top-right",
): UseToastReturn => {
  return useToast({ position });
};

/**
 * Hook pour créer des toasts avec action
 *
 * @param action - Action par défaut
 * @returns {Object} Méthodes pour gérer les toasts
 *
 * @example
 * const toast = useActionToast({
 *   label: 'Voir',
 *   onClick: () => console.log('Action cliquée')
 * });
 * toast.success('Message avec action');
 */
export const useActionToast = (action: {
  label: string;
  onClick: () => void;
}): UseToastReturn => {
  return useToast({ action });
};

export default useToast;
