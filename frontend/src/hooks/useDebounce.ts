import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook pour debounce une valeur
 * Utile pour la recherche, les filtres, etc.
 * 
 * @param value - La valeur à debouncer
 * @param delay - Délai en millisecondes (défaut: 500ms)
 * @param options - Options supplémentaires
 * @returns La valeur debouncée
 * 
 * @example
 * // Exemple basique
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 * 
 * useEffect(() => {
 *   // Appel API avec debouncedSearch
 *   fetchProducts(debouncedSearch);
 * }, [debouncedSearch]);
 * 
 * // Exemple avec callback
 * const debouncedSearch = useDebounce(search, 300, {
 *   onDebounce: (value) => {
 *     console.log('Valeur debouncée:', value);
 *   }
 * });
 */
export interface UseDebounceOptions {
  /** Callback appelé quand la valeur est debouncée */
  onDebounce?: (value: any) => void;
  /** Callback appelé quand la valeur change (avant debounce) */
  onValueChange?: (value: any) => void;
  /** Appeler le callback au premier changement immédiatement */
  leading?: boolean;
  /** Appeler le callback après le délai même si la valeur n'a pas changé */
  trailing?: boolean;
}

export const useDebounce = <T>(
  value: T,
  delay: number = 500,
  options: UseDebounceOptions = {}
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef<boolean>(true);
  const previousValue = useRef<T>(value);

  // Fonction pour nettoyer le timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Fonction pour définir la valeur debouncée
  const setDebounced = useCallback((newValue: T) => {
    setDebouncedValue(newValue);
    if (options.onDebounce) {
      options.onDebounce(newValue);
    }
  }, [options]);

  // Gestion du leading edge
  const handleLeading = useCallback((newValue: T) => {
    if (options.leading) {
      // Si c'est le premier rendu ou si la valeur a changé
      if (isFirstRender.current || previousValue.current !== newValue) {
        clearTimer();
        setDebounced(newValue);
        isFirstRender.current = false;
        previousValue.current = newValue;
        return true;
      }
    }
    return false;
  }, [options.leading, clearTimer, setDebounced]);

  useEffect(() => {
    // Appeler onValueChange si fourni
    if (options.onValueChange) {
      options.onValueChange(value);
    }

    // Gestion du leading edge
    if (handleLeading(value)) {
      return;
    }

    // Nettoyer le timer existant
    clearTimer();

    // Créer un nouveau timer
    timerRef.current = setTimeout(() => {
      setDebounced(value);
      previousValue.current = value;
      isFirstRender.current = false;
    }, delay);

    // Nettoyer le timer lors du démontage ou des changements
    return () => {
      clearTimer();
    };
  }, [value, delay, clearTimer, setDebounced, handleLeading, options.onValueChange]);

  // Nettoyer le timer lors du démontage du composant
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return debouncedValue;
};

/**
 * Hook pour debounce une fonction
 * Utile pour les événements de scroll, resize, etc.
 * 
 * @param fn - Fonction à debouncer
 * @param delay - Délai en millisecondes (défaut: 500ms)
 * @param options - Options supplémentaires
 * @returns Fonction debouncée
 * 
 * @example
 * const handleSearch = useDebounceFn((query) => {
 *   fetchProducts(query);
 * }, 300);
 * 
 * // Utilisation
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export const useDebounceFn = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 500,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLeadingCalled = useRef<boolean>(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return useCallback((...args: Parameters<T>) => {
    // Leading edge
    if (options.leading && !isLeadingCalled.current) {
      fn(...args);
      isLeadingCalled.current = true;
      // Réinitialiser après le délai
      setTimeout(() => {
        isLeadingCalled.current = false;
      }, delay);
      return;
    }

    // Trailing edge
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (options.trailing !== false) {
        fn(...args);
      }
      isLeadingCalled.current = false;
    }, delay);
  }, [fn, delay, options.leading, options.trailing, clearTimer]);
};

/**
 * Type du retour du hook useDebounce
 */
export type UseDebounceReturn<T> = T;

/**
 * Type du retour du hook useDebounceFn
 */
export type UseDebounceFnReturn<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export default useDebounce;