import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Options pour le hook useLocalStorage
 */
export interface UseLocalStorageOptions {
  /** Sérialiser les données (défaut: true) */
  serialize?: boolean;
  /** Désérialiser les données (défaut: true) */
  deserialize?: boolean;
  /** Écouter les changements dans d'autres onglets (défaut: true) */
  listenToStorageChanges?: boolean;
  /** Déboguer les opérations (défaut: false) */
  debug?: boolean;
  /** Valeur par défaut si la clé n'existe pas */
  defaultValue?: any;
  /** Expiration en millisecondes (défaut: 0 = jamais) */
  expiresIn?: number;
  /** Version des données (pour migration) */
  version?: number;
  /** Callback appelé quand la valeur change */
  onChange?: (value: any) => void;
  /** Callback appelé en cas d'erreur */
  onError?: (error: Error) => void;
}

/**
 * Structure des données stockées avec métadonnées
 */
interface StoredData<T> {
  /** Valeur stockée */
  value: T;
  /** Timestamp de création */
  createdAt: number;
  /** Timestamp de mise à jour */
  updatedAt: number;
  /** Date d'expiration */
  expiresAt?: number;
  /** Version des données */
  version?: number;
}

/**
 * Hook pour utiliser localStorage
 * Persiste une valeur dans le localStorage du navigateur
 * 
 * @param key - Clé de stockage
 * @param initialValue - Valeur initiale
 * @param options - Options supplémentaires
 * @returns [value, setValue, removeValue, isStored]
 * 
 * @example
 * // Exemple basique
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * 
 * // Changer la valeur
 * setTheme('dark');
 * 
 * // Supprimer la valeur
 * removeTheme();
 * 
 * // Avec options
 * const [user, setUser] = useLocalStorage('user', null, {
 *   expiresIn: 3600000, // Expire dans 1 heure
 *   version: 2,
 *   onChange: (value) => console.log('User changed:', value)
 * });
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void, () => void, boolean] => {
  const {
    serialize = true,
    deserialize = true,
    listenToStorageChanges = true,
    debug = false,
    defaultValue,
    expiresIn = 0,
    version = 1,
    onChange,
    onError,
  } = options;

  // Debug logger
  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log(`[useLocalStorage:${key}]`, ...args);
    }
  }, [key, debug]);

  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      if (item) {
        log('Lecture depuis localStorage:', item);
        
        let parsed: StoredData<T> | T;
        
        if (deserialize) {
          parsed = JSON.parse(item);
        } else {
          parsed = item as any;
        }
        
        // Vérifier si c'est une donnée avec métadonnées
        if (parsed && typeof parsed === 'object' && 'value' in parsed) {
          const stored = parsed as StoredData<T>;
          
          // Vérifier l'expiration
          if (stored.expiresAt && Date.now() > stored.expiresAt) {
            log('Données expirées, suppression');
            window.localStorage.removeItem(key);
            return initialValue;
          }
          
          // Vérifier la version
          if (stored.version && stored.version !== version) {
            log('Version différente, réinitialisation');
            window.localStorage.removeItem(key);
            return initialValue;
          }
          
          return stored.value;
        }
        
        return parsed as T;
      }
      
      // Si la clé n'existe pas mais qu'une valeur par défaut est fournie
      if (defaultValue !== undefined) {
        log('Valeur par défaut utilisée:', defaultValue);
        return defaultValue;
      }
      
      log('Aucune donnée trouvée, valeur initiale utilisée');
      return initialValue;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erreur de lecture');
      log('Erreur de lecture:', err);
      if (onError) {
        onError(err);
      }
      return initialValue;
    }
  });

  // Référence pour suivre si la valeur est stockée
  const [isStored, setIsStored] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  });

  // Fonction pour sérialiser les données
  const serializeData = useCallback((value: T): string => {
    if (!serialize) {
      return String(value);
    }
    
    const data: StoredData<T> = {
      value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version,
    };
    
    if (expiresIn > 0) {
      data.expiresAt = Date.now() + expiresIn;
    }
    
    return JSON.stringify(data);
  }, [serialize, version, expiresIn]);

  // Fonction pour mettre à jour la valeur
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder dans localStorage
      const serialized = serializeData(valueToStore);
      window.localStorage.setItem(key, serialized);
      
      log('Valeur sauvegardée:', valueToStore);
      
      setStoredValue(valueToStore);
      setIsStored(true);
      
      if (onChange) {
        onChange(valueToStore);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erreur de sauvegarde');
      log('Erreur de sauvegarde:', err);
      if (onError) {
        onError(err);
      }
    }
  }, [key, storedValue, serializeData, log, onChange, onError]);

  // Fonction pour supprimer la valeur
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      log('Valeur supprimée');
      setStoredValue(initialValue);
      setIsStored(false);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erreur de suppression');
      log('Erreur de suppression:', err);
      if (onError) {
        onError(err);
      }
    }
  }, [key, initialValue, log, onError]);

  // Fonction pour vérifier si la valeur existe
  const checkIsStored = useCallback(() => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [key]);
  // Écouter les changements dans d'autres onglets
  useEffect(() => {
    if (!listenToStorageChanges) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        log('Changement détecté dans un autre onglet:', e.newValue);
        
        try {
          let newValue: T;
          
          if (deserialize) {
            const parsed = JSON.parse(e.newValue);
            if (parsed && typeof parsed === 'object' && 'value' in parsed) {
              newValue = (parsed as StoredData<T>).value;
            } else {
              newValue = parsed;
            }
          } else {
            newValue = e.newValue as any;
          }
          
          setStoredValue(newValue);
          setIsStored(true);
          
          if (onChange) {
            onChange(newValue);
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Erreur de synchronisation');
          log('Erreur de synchronisation:', err);
          if (onError) {
            onError(err);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, listenToStorageChanges, deserialize, log, onChange, onError]);

  // Vérifier périodiquement si la valeur est toujours valide
  useEffect(() => {
    if (!expiresIn) return;

    const checkExpiration = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === 'object' && 'value' in parsed) {
            const stored = parsed as StoredData<T>;
            if (stored.expiresAt && Date.now() > stored.expiresAt) {
              log('Données expirées, suppression automatique');
              window.localStorage.removeItem(key);
              setStoredValue(initialValue);
              setIsStored(false);
            }
          }
        }
      } catch (error) {
        // Ignorer les erreurs de vérification
      }
    };

    const interval = setInterval(checkExpiration, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, [key, expiresIn, initialValue, log]);

  return [storedValue, setValue, removeValue, isStored];
};

/**
 * Hook pour utiliser sessionStorage
 * Similaire à useLocalStorage mais avec sessionStorage
 * 
 * @param key - Clé de stockage
 * @param initialValue - Valeur initiale
 * @param _options - Options supplémentaires
 * @returns [value, setValue, removeValue, isStored]
 * 
 * @example
 * const [session, setSession] = useSessionStorage('sessionData', null);
 */
export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
  _options: Omit<UseLocalStorageOptions, 'listenToStorageChanges'> = {}
): [T, (value: T | ((val: T) => T)) => void, () => void, boolean] => {
  const storage = useRef<Storage>(window.sessionStorage);
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.current.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const [isStored, setIsStored] = useState<boolean>(() => {
    try {
      return storage.current.getItem(key) !== null;
    } catch {
      return false;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      storage.current.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
      setIsStored(true);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      storage.current.removeItem(key);
      setStoredValue(initialValue);
      setIsStored(false);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, isStored];
};

/**
 * Hook pour utiliser localStorage avec expiration
 * 
 * @param key - Clé de stockage
 * @param initialValue - Valeur initiale
 * @param expiresIn - Durée de validité en millisecondes
 * @param version - Version des données
 * @returns [value, setValue, removeValue, isStored]
 * 
 * @example
 * const [token, setToken] = useExpiringLocalStorage('token', null, 3600000);
 * // Le token expire automatiquement après 1 heure
 */
export const useExpiringLocalStorage = <T>(
  key: string,
  initialValue: T,
  expiresIn: number = 3600000,
  version: number = 1
): [T, (value: T | ((val: T) => T)) => void, () => void, boolean] => {
  return useLocalStorage(key, initialValue, {
    expiresIn,
    version,
  });
};

/**
 * Hook pour synchroniser une valeur avec localStorage
 * Retourne la valeur et un indicateur de synchronisation
 * 
 * @param key - Clé de stockage
 * @param initialValue - Valeur initiale
 * @param options - Options supplémentaires
 * @returns { value, setValue, removeValue, isStored, isSyncing, sync }
 * 
 * @example
 * const { value, setValue, isSyncing, sync } = useSyncLocalStorage('data', null);
 * 
 * // Synchroniser manuellement
 * await sync();
 */
export const useSyncLocalStorage = <T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): {
  value: T;
  setValue: (value: T | ((val: T) => T)) => void;
  removeValue: () => void;
  isStored: boolean;
  isSyncing: boolean;
  sync: () => Promise<T | null>;
} => {
  const [value, setValue, removeValue, isStored] = useLocalStorage<T>(key, initialValue, options);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const sync = useCallback(async (): Promise<T | null> => {
    setIsSyncing(true);
    try {
      // Simuler une synchronisation avec un serveur
      const response = await fetch(`/api/sync/${key}`);
      const data = await response.json();
      
      if (data) {
        setValue(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Sync error:', error);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [key, setValue]);

  return {
    value,
    setValue,
    removeValue,
    isStored,
    isSyncing,
    sync,
  };
};

/**
 * Type du retour du hook useLocalStorage
 */
export type UseLocalStorageReturn<T> = [T, (value: T | ((val: T) => T)) => void, () => void, boolean];

export default useLocalStorage;