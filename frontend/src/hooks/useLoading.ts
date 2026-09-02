import React from "react";
import { useUIStore } from "@/store/uiStore";

/**
 * Hook pour gérer les états de chargement
 * Utilise le store uiStore
 *
 * @param key - Clé de chargement (optionnel)
 * @param options - Options supplémentaires
 * @returns {Object} État et actions de chargement
 *
 * @example
 * // Avec clé spécifique
 * const { loading, start, stop, withLoading } = useLoading('fetchProducts');
 *
 * // Démarrer le chargement
 * start();
 *
 * // Arrêter le chargement
 * stop();
 *
 * // Exécuter avec chargement automatique
 * await withLoading(() => fetchProducts());
 *
 * // Sans clé (global)
 * const { globalLoading, setGlobalLoading } = useLoading();
 *
 * // Avec options
 * const { loading, withLoading } = useLoading('fetchProducts', {
 *   autoStart: true,
 *   autoStop: true,
 *   onStart: () => console.log('Chargement démarré'),
 *   onStop: () => console.log('Chargement terminé'),
 *   onError: (error) => console.error('Erreur:', error)
 * });
 */
export interface UseLoadingOptions {
  /** Démarrer automatiquement le chargement (défaut: false) */
  autoStart?: boolean;
  /** Arrêter automatiquement le chargement (défaut: true) */
  autoStop?: boolean;
  /** Callback appelé au début du chargement */
  onStart?: () => void;
  /** Callback appelé à la fin du chargement */
  onStop?: () => void;
  /** Callback appelé en cas d'erreur */
  onError?: (error: any) => void;
  /** Délai minimum de chargement en ms (défaut: 0) */
  minDuration?: number;
  /** Délai maximum de chargement en ms (défaut: 30000) */
  maxDuration?: number;
  /** Délai avant de démarrer le chargement en ms (défaut: 0) */
  delay?: number;
}

/**
 * Retour pour un chargement avec clé
 */
export interface UseLoadingWithKeyReturn {
  /** Est en chargement */
  loading: boolean;
  /** Démarrer le chargement */
  start: () => void;
  /** Arrêter le chargement */
  stop: () => void;
  /** Exécuter avec chargement */
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
  /** Démarrer le chargement avec un délai */
  startDelayed: (delay?: number) => void;
  /** Réinitialiser l'état de chargement */
  reset: () => void;
}

/**
 * Retour pour un chargement global
 */
export interface UseLoadingGlobalReturn {
  /** Chargement global */
  globalLoading: boolean;
  /** Nombre de chargements en cours */
  loadingCount: number;
  /** File d'attente des chargements */
  loadingQueue: string[];
  /** Définir le chargement global */
  setGlobalLoading: (loading: boolean) => void;
  /** Vérifier si un chargement est en cours */
  isLoading: (key: string) => boolean;
  /** Démarrer un chargement */
  startLoading: (key: string) => void;
  /** Arrêter un chargement */
  stopLoading: (key: string) => void;
  /** Exécuter avec chargement */
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
  /** Vérifier si un chargement est en cours */
  isAnyLoading: () => boolean;
  /** Récupérer les clés de chargement */
  getLoadingKeys: () => string[];
  /** Effacer les états de chargement */
  clearLoadingStates: () => void;
}

/**
 * Retour du hook useLoading
 */
export type UseLoadingReturn = UseLoadingWithKeyReturn | UseLoadingGlobalReturn;

export const useLoading = (
  key?: string,
  options: UseLoadingOptions = {},
): UseLoadingReturn => {
  const store = useUIStore();
  const {
    autoStart = false,
    autoStop = true,
    onStart,
    onStop,
    onError,
    minDuration = 0,
    maxDuration = 30000,
    delay = 0,
  } = options;

  // Timer pour le délai minimum
  const startTimeRef = React.useRef<number>(0);
  const minTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const maxTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Nettoyer les timers
  const clearTimers = React.useCallback(() => {
    if (minTimerRef.current) {
      clearTimeout(minTimerRef.current);
      minTimerRef.current = null;
    }
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  }, []);

  // Démarrer le chargement avec gestion du délai minimum
  const startLoadingInternal = React.useCallback(
    (loadingKey: string) => {
      // Démarrer le chargement
      store.startLoading(loadingKey);
      startTimeRef.current = Date.now();

      if (onStart) {
        onStart();
      }

      // Timer de sécurité (maxDuration)
      if (maxDuration > 0) {
        maxTimerRef.current = setTimeout(() => {
          store.stopLoading(loadingKey);
          if (onStop) {
            onStop();
          }
          console.warn(
            `Chargement "${loadingKey}" a dépassé le délai maximum de ${maxDuration}ms`,
          );
        }, maxDuration);
      }
    },
    [store, maxDuration, onStart, onStop],
  );

  // Arrêter le chargement avec gestion du délai minimum
  const stopLoadingInternal = React.useCallback(
    (loadingKey: string) => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minDuration - elapsed);

      clearTimers();

      if (remaining > 0 && minDuration > 0) {
        // Attendre le délai minimum avant d'arrêter
        minTimerRef.current = setTimeout(() => {
          store.stopLoading(loadingKey);
          if (onStop) {
            onStop();
          }
          minTimerRef.current = null;
        }, remaining);
      } else {
        store.stopLoading(loadingKey);
        if (onStop) {
          onStop();
        }
      }
    },
    [store, minDuration, onStop, clearTimers],
  );

  // Exécuter une fonction avec chargement
  const withLoading = React.useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      if (!key) {
        throw new Error("useLoading: key est requis pour withLoading");
      }

      try {
        startLoadingInternal(key);
        const result = await fn();
        if (autoStop !== false) {
          stopLoadingInternal(key);
        }
        return result;
      } catch (error) {
        if (onError) {
          onError(error);
        }
        if (autoStop !== false) {
          stopLoadingInternal(key);
        }
        throw error;
      } finally {
        clearTimers();
      }
    },
    [
      key,
      autoStop,
      startLoadingInternal,
      stopLoadingInternal,
      onError,
      clearTimers,
    ],
  );

  // Démarrer le chargement avec délai
  const startDelayed = React.useCallback(
    (customDelay?: number) => {
      if (!key) return;

      const delayMs = customDelay || delay;
      if (delayMs > 0) {
        delayTimerRef.current = setTimeout(() => {
          startLoadingInternal(key);
        }, delayMs);
      } else {
        startLoadingInternal(key);
      }
    },
    [key, delay, startLoadingInternal],
  );

  // Réinitialiser
  const reset = React.useCallback(() => {
    if (key) {
      store.stopLoading(key);
    }
    clearTimers();
    startTimeRef.current = 0;
  }, [key, store, clearTimers]);

  // Nettoyer au démontage
  React.useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  React.useEffect(() => {
    if (!key) return;

    if (autoStart) {
      startLoadingInternal(key);
    }

    return () => {
      if (autoStop !== false) {
        stopLoadingInternal(key);
      }
      clearTimers();
    };
  }, [
    autoStart,
    autoStop,
    key,
    startLoadingInternal,
    stopLoadingInternal,
    clearTimers,
  ]);

  // Si une clé est fournie, retourner le chargement avec clé
  if (key) {
    const loading = store.isLoading(key);

    return {
      loading,
      start: () => startLoadingInternal(key),
      stop: () => stopLoadingInternal(key),
      withLoading,
      startDelayed,
      reset,
    };
  }

  // Retourner le chargement global
  return {
    globalLoading: store.globalLoading,
    loadingCount: store.loadingCount,
    loadingQueue: store.loadingQueue,
    setGlobalLoading: store.setGlobalLoading,
    isLoading: store.isLoading,
    startLoading: store.startLoading,
    stopLoading: store.stopLoading,
    withLoading: store.withLoading,
    isAnyLoading: store.isAnyLoading,
    getLoadingKeys: store.getLoadingKeys,
    clearLoadingStates: store.clearLoadingStates,
  };
};

/**
 * Hook pour gérer un tableau de chargements
 *
 * @param keys - Liste des clés de chargement
 * @param options - Options supplémentaires
 * @returns {Object} État et actions
 *
 * @example
 * const { isLoading, isAnyLoading, getLoadingStates } = useLoadingStates([
 *   'fetchProducts',
 *   'fetchCategories',
 *   'fetchReviews'
 * ]);
 *
 * // Vérifier si un chargement spécifique est en cours
 * if (isLoading('fetchProducts')) {
 *   // Afficher un spinner
 * }
 *
 * // Vérifier si un chargement est en cours
 * if (isAnyLoading()) {
 *   // Afficher un loader global
 * }
 */
export const useLoadingStates = (
  keys: string[],
  options: UseLoadingOptions = {},
): {
  /** Vérifier si un chargement spécifique est en cours */
  isLoading: (key: string) => boolean;
  /** Vérifier si un chargement est en cours */
  isAnyLoading: () => boolean;
  /** Récupérer tous les états de chargement */
  getLoadingStates: () => Record<string, boolean>;
  /** Démarrer un chargement */
  startLoading: (key: string) => void;
  /** Arrêter un chargement */
  stopLoading: (key: string) => void;
  /** Exécuter une fonction avec chargement */
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
} => {
  const store = useUIStore();

  const isLoading = React.useCallback(
    (key: string) => {
      return store.isLoading(key);
    },
    [store],
  );

  const isAnyLoading = React.useCallback(() => {
    return keys.some((key) => store.isLoading(key));
  }, [keys, store]);

  const getLoadingStates = React.useCallback(() => {
    const states: Record<string, boolean> = {};
    keys.forEach((key) => {
      states[key] = store.isLoading(key);
    });
    return states;
  }, [keys, store]);

  const startLoading = React.useCallback(
    (key: string) => {
      store.startLoading(key);
    },
    [store],
  );

  const stopLoading = React.useCallback(
    (key: string) => {
      store.stopLoading(key);
    },
    [store],
  );

  const withLoading = React.useCallback(
    async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      try {
        store.startLoading(key);
        const result = await fn();
        store.stopLoading(key);
        return result;
      } catch (error) {
        store.stopLoading(key);
        if (options.onError) {
          options.onError(error);
        }
        throw error;
      }
    },
    [store, options.onError],
  );

  return {
    isLoading,
    isAnyLoading,
    getLoadingStates,
    startLoading,
    stopLoading,
    withLoading,
  };
};

/**
 * Hook pour créer un loader avec état
 *
 * @param initialState - État initial du loader
 * @returns {Object} État et actions
 *
 * @example
 * const { isLoading, start, stop, withLoading } = useLoader();
 *
 * // Charger des données
 * await withLoading(async () => {
 *   const data = await fetchData();
 *   setData(data);
 * });
 */
export const useLoader = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(initialState);
  const startTimeRef = React.useRef<number>(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const start = React.useCallback(() => {
    setIsLoading(true);
    startTimeRef.current = Date.now();
  }, []);

  const stop = React.useCallback((minDuration: number = 0) => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, minDuration - elapsed);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (remaining > 0) {
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
        timerRef.current = null;
      }, remaining);
    } else {
      setIsLoading(false);
    }
  }, []);

  const withLoading = React.useCallback(
    async <T>(fn: () => Promise<T>, minDuration: number = 0): Promise<T> => {
      start();
      try {
        const result = await fn();
        stop(minDuration);
        return result;
      } catch (error) {
        stop(0);
        throw error;
      }
    },
    [start, stop],
  );

  const reset = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLoading(false);
    startTimeRef.current = 0;
  }, []);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return {
    isLoading,
    start,
    stop,
    withLoading,
    reset,
  };
};

export default useLoading;
