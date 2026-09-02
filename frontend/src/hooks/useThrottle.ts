import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Options pour le hook useThrottle
 */
export interface UseThrottleOptions {
  /** Délai de throttling en millisecondes (défaut: 200) */
  limit?: number;
  /** Exécuter la fonction au début (défaut: false) */
  leading?: boolean;
  /** Exécuter la fonction à la fin (défaut: true) */
  trailing?: boolean;
  /** Callback appelé quand la valeur est throttlée */
  onThrottle?: (value: any) => void;
  /** Callback appelé quand la valeur change */
  onValueChange?: (value: any) => void;
}

/**
 * Hook pour throttler une valeur
 * Utile pour le scroll, resize, etc.
 * 
 * @param value - La valeur à throttler
 * @param limit - Délai en millisecondes (défaut: 200ms)
 * @param options - Options supplémentaires
 * @returns La valeur throttlée
 * 
 * @example
 * // Exemple basique
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScroll = useThrottle(scrollY, 200);
 * 
 * useEffect(() => {
 *   // Appel avec throttledScroll
 *   updateScrollPosition(throttledScroll);
 * }, [throttledScroll]);
 * 
 * // Avec options
 * const throttledScroll = useThrottle(scrollY, 200, {
 *   leading: true,
 *   trailing: true,
 *   onThrottle: (value) => console.log('Throttled:', value)
 * });
 */
export const useThrottle = <T>(
  value: T,
  limit: number = 200,
  options: UseThrottleOptions = {}
): T => {
  const {
    leading = false,
    trailing = true,
    onThrottle,
    onValueChange,
  } = options;

  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRun = useRef<number>(0);
  const lastValue = useRef<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef<boolean>(true);

  // Nettoyer le timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Appeler onValueChange si fourni
    if (onValueChange) {
      onValueChange(value);
    }

    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    // Si c'est le premier appel et leading est true
    if (isFirstRun.current && leading) {
      setThrottledValue(value);
      lastRun.current = now;
      isFirstRun.current = false;
      if (onThrottle) {
        onThrottle(value);
      }
      return;
    }

    // Si le délai est passé
    if (timeSinceLastRun >= limit) {
      setThrottledValue(value);
      lastRun.current = now;
      lastValue.current = value;
      if (onThrottle) {
        onThrottle(value);
      }
      clearTimer();
    } else if (trailing) {
      // Programmer une exécution à la fin
      clearTimer();
      const remaining = limit - timeSinceLastRun;
      timerRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastRun.current = Date.now();
        lastValue.current = value;
        if (onThrottle) {
          onThrottle(value);
        }
        timerRef.current = null;
      }, remaining);
    }

    return () => {
      clearTimer();
    };
  }, [value, limit, leading, trailing, onThrottle, onValueChange, clearTimer]);

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return throttledValue;
};

/**
 * Hook pour throttler une fonction
 * Utile pour les événements de scroll, resize, etc.
 * 
 * @param fn - Fonction à throttler
 * @param limit - Délai en millisecondes (défaut: 200ms)
 * @param options - Options supplémentaires
 * @returns Fonction throttlée
 * 
 * @example
 * const handleScroll = useThrottleFn(
 *   (position: number) => {
 *     console.log('Position de scroll:', position);
 *   },
 *   200,
 *   { leading: true, trailing: true }
 * );
 * 
 * useEffect(() => {
 *   const onScroll = () => {
 *     handleScroll(window.scrollY);
 *   };
 *   window.addEventListener('scroll', onScroll);
 *   return () => window.removeEventListener('scroll', onScroll);
 * }, [handleScroll]);
 */
export const useThrottleFn = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 200,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  const {
    leading = false,
    trailing = true,
  } = options;

  const lastRun = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);
  const isFirstRun = useRef<boolean>(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    // Si c'est le premier appel et leading est true
    if (isFirstRun.current && leading) {
      fn(...args);
      lastRun.current = now;
      isFirstRun.current = false;
      return;
    }

    // Si le délai est passé
    if (timeSinceLastRun >= limit) {
      fn(...args);
      lastRun.current = now;
      clearTimer();
    } else if (trailing) {
      // Programmer une exécution à la fin
      lastArgs.current = args;
      clearTimer();
      const remaining = limit - timeSinceLastRun;
      timerRef.current = setTimeout(() => {
        if (lastArgs.current) {
          fn(...lastArgs.current);
          lastRun.current = Date.now();
          lastArgs.current = null;
        }
        timerRef.current = null;
      }, remaining);
    }
  }, [fn, limit, leading, trailing, clearTimer]);
};

/**
 * Hook pour throttler avec état de chargement
 * 
 * @param fn - Fonction à throttler
 * @param limit - Délai en millisecondes (défaut: 200ms)
 * @param options - Options supplémentaires
 * @returns {Object} Fonction throttlée et état
 * 
 * @example
 * const { execute, isThrottled, remaining } = useThrottleState(
 *   (data) => console.log(data),
 *   1000
 * );
 * 
 * // Exécuter la fonction
 * execute('test');
 * 
 * // Vérifier si elle est throttlée
 * if (isThrottled) {
 *   console.log(`Attendez ${remaining}ms`);
 * }
 */
export const useThrottleState = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 200,
  options: { leading?: boolean; trailing?: boolean } = {}
): {
  execute: (...args: Parameters<T>) => void;
  isThrottled: boolean;
  remaining: number;
  reset: () => void;
} => {
  const {
    leading = false,
    trailing = true,
  } = options;

  const [isThrottled, setIsThrottled] = useState<boolean>(false);
  const [remaining, setRemaining] = useState<number>(0);
  
  const lastRun = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef<boolean>(true);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateRemaining = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastRun.current;
    const remainingTime = Math.max(0, limit - elapsed);
    setRemaining(remainingTime);
    
    if (remainingTime === 0) {
      setIsThrottled(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [limit]);

  const execute = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    // Si c'est le premier appel et leading est true
    if (isFirstRun.current && leading) {
      fn(...args);
      lastRun.current = now;
      isFirstRun.current = false;
      setIsThrottled(true);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(updateRemaining, 100);
      return;
    }

    // Si le délai est passé
    if (timeSinceLastRun >= limit) {
      fn(...args);
      lastRun.current = now;
      setIsThrottled(true);
      clearTimers();
      
      intervalRef.current = setInterval(updateRemaining, 100);
    } else if (trailing) {
      // Programmer une exécution à la fin
      clearTimers();
      const remaining = limit - timeSinceLastRun;
      timerRef.current = setTimeout(() => {
        fn(...args);
        lastRun.current = Date.now();
        setIsThrottled(true);
        timerRef.current = null;
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(updateRemaining, 100);
      }, remaining);
    }
  }, [fn, limit, leading, trailing, clearTimers, updateRemaining]);

  const reset = useCallback(() => {
    clearTimers();
    setIsThrottled(false);
    setRemaining(0);
    lastRun.current = 0;
    isFirstRun.current = true;
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    execute,
    isThrottled,
    remaining,
    reset,
  };
};

/**
 * Type du retour du hook useThrottle
 */
export type UseThrottleReturn<T> = T;

/**
 * Type du retour du hook useThrottleFn
 */
export type UseThrottleFnReturn<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export default useThrottle;