import { useMemo, useRef, useCallback, useEffect } from "react";
import { logger, LogLevel, Logger } from "@/lib/logger";

/**
 * Options pour le hook useLogger
 */
export interface UseLoggerOptions {
  /** Niveau de log minimum (défaut: LogLevel.DEBUG) */
  level?: LogLevel;
  /** Tags supplémentaires */
  tags?: string[];
  /** Activer les logs (défaut: true) */
  enabled?: boolean;
  /** Nom du composant pour le contexte */
  component?: string;
  /** Ajouter un timestamp aux logs (défaut: true) */
  timestamp?: boolean;
  /** Ajouter des métadonnées supplémentaires */
  metadata?: Record<string, any>;
  /** Format de sortie (défaut: 'text') */
  format?: "text" | "json" | "pretty";
}

/**
 * Hook pour le logging
 * Utilise le système de logging centralisé
 *
 * @param context - Contexte du log (ex: 'ComponentName')
 * @param options - Options supplémentaires
 * @returns {Object} Méthodes de logging
 *
 * @example
 * // Exemple basique
 * const log = useLogger('ProductList');
 *
 * // Log d'information
 * log.info('Products loaded', { count: products.length });
 *
 * // Log de débogage
 * log.debug('Filter applied', { filter });
 *
 * // Log d'erreur
 * log.error('Failed to load products', error);
 *
 * // Log d'exception
 * log.exception(error, { context: 'fetchProducts' });
 *
 * // Avec options
 * const log = useLogger('ProductList', {
 *   level: LogLevel.INFO,
 *   tags: ['products', 'catalog'],
 *   metadata: { version: '1.0.0' }
 * });
 */
export interface UseLoggerReturn {
  /** Log de débogage */
  debug: (message: string, data?: any, tags?: string[]) => void;
  /** Log d'information */
  info: (message: string, data?: any, tags?: string[]) => void;
  /** Log d'avertissement */
  warn: (message: string, data?: any, tags?: string[]) => void;
  /** Log d'erreur */
  error: (message: string, error?: any, tags?: string[]) => void;
  /** Log d'exception */
  exception: (
    error: any,
    context?: Record<string, any>,
    tags?: string[],
  ) => void;
  /** Log de performance */
  performance: (label: string, duration: number, data?: any) => void;
  /** Log d'API */
  api: (method: string, url: string, data?: any, response?: any) => void;
  /** Log de composant */
  component: (action: string, data?: any) => void;
  /** Log d'événement */
  event: (name: string, data?: any) => void;
  /** Grouper les logs */
  group: (name: string, fn: () => void) => void;
  /** Grouper les logs (collapsible) */
  groupCollapsed: (name: string, fn: () => void) => void;
  /** Mesurer le temps d'exécution */
  time: (label: string) => void;
  /** Fin de mesure */
  timeEnd: (label: string) => void;
  /** Mesurer une fonction asynchrone */
  timeAsync: <T>(label: string, fn: () => Promise<T>) => Promise<T>;
  /** Créer un logger enfant */
  child: (tags: string[]) => UseLoggerReturn;
  /** Définir le niveau de log */
  setLevel: (level: LogLevel) => void;
  /** Activer/désactiver */
  setEnabled: (enabled: boolean) => void;
  /** Récupérer le logger interne */
  getLogger: () => Logger;
  /** Nettoyer les ressources */
  cleanup: () => void;
}

export const useLogger = (
  context?: string,
  options: UseLoggerOptions = {},
): UseLoggerReturn => {
  const {
    level = LogLevel.DEBUG,
    tags = [],
    enabled = true,
    component,
    timestamp = true,
    metadata = {},
    format = "text",
  } = options;

  // Référence pour stocker le logger
  const loggerRef = useRef<Logger>(logger);
  const contextRef = useRef<string | undefined>(context);
  const enabledRef = useRef<boolean>(enabled);
  const levelRef = useRef<LogLevel>(level);

  // Mettre à jour les refs
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    levelRef.current = level;
    loggerRef.current.setLevel(level);
  }, [level]);

  // Tags complets (context + tags + component)
  const fullTags = useMemo(() => {
    const allTags: string[] = [...tags];
    if (component) {
      allTags.push(`component:${component}`);
    }
    if (context) {
      allTags.push(`context:${context}`);
    }
    return allTags;
  }, [tags, component, context]);

  // Créer un enfant du logger
  const createChild = useCallback(
    (childTags: string[]): Logger => {
      return loggerRef.current.child([...fullTags, ...childTags]);
    },
    [fullTags],
  );

  // Méthode de log principale
  const log = useCallback(
    (
      level: LogLevel,
      message: string,
      data?: any,
      error?: any,
      extraTags?: string[],
    ) => {
      if (!enabledRef.current) return;
      if (level < levelRef.current) return;

      const loggerInstance = createChild(extraTags || []);
      const logData = {
        ...metadata,
        ...(data || {}),
        ...(error
          ? {
              error:
                error instanceof Error
                  ? {
                      name: error.name,
                      message: error.message,
                      stack: error.stack,
                      ...((error as Error & { response?: unknown }).response
                        ? {
                            response: (error as Error & { response?: unknown })
                              .response,
                          }
                        : {}),
                      ...((error as Error & { request?: unknown }).request
                        ? {
                            request: (error as Error & { request?: unknown })
                              .request,
                          }
                        : {}),
                    }
                  : error,
            }
          : {}),
      };

      // Ajouter un timestamp si demandé
      if (timestamp) {
        logData.timestamp = new Date().toISOString();
      }

      // Ajouter le format
      if (format === "json") {
        logData._format = "json";
      } else if (format === "pretty") {
        logData._format = "pretty";
      }

      switch (level) {
        case LogLevel.DEBUG:
          loggerInstance.debug(message, logData);
          break;
        case LogLevel.INFO:
          loggerInstance.info(message, logData);
          break;
        case LogLevel.WARN:
          loggerInstance.warn(message, logData);
          break;
        case LogLevel.ERROR:
          loggerInstance.error(message, logData);
          break;
        default:
          loggerInstance.info(message, logData);
      }
    },
    [createChild, metadata, timestamp, format],
  );

  // ============ MÉTHODES DE LOG ============

  const debug = useCallback(
    (message: string, data?: any, extraTags?: string[]) => {
      log(LogLevel.DEBUG, message, data, undefined, extraTags);
    },
    [log],
  );

  const info = useCallback(
    (message: string, data?: any, extraTags?: string[]) => {
      log(LogLevel.INFO, message, data, undefined, extraTags);
    },
    [log],
  );

  const warn = useCallback(
    (message: string, data?: any, extraTags?: string[]) => {
      log(LogLevel.WARN, message, data, undefined, extraTags);
    },
    [log],
  );

  const error = useCallback(
    (message: string, error?: any, extraTags?: string[]) => {
      log(LogLevel.ERROR, message, undefined, error, extraTags);
    },
    [log],
  );

  const exception = useCallback(
    (error: any, context?: Record<string, any>, extraTags?: string[]) => {
      log(
        LogLevel.ERROR,
        error instanceof Error ? error.message : String(error),
        context,
        error,
        extraTags,
      );
    },
    [log],
  );

  // ============ MÉTHODES SPÉCIALISÉES ============

  const performance = useCallback(
    (label: string, duration: number, data?: any) => {
      info(`Performance: ${label}`, {
        duration,
        ...data,
        _type: "performance",
        _label: label,
      });
    },
    [info],
  );

  const api = useCallback(
    (method: string, url: string, data?: any, response?: any) => {
      info(`API: ${method} ${url}`, {
        method,
        url,
        request: data,
        response,
        _type: "api",
      });
    },
    [info],
  );

  const componentLog = useCallback(
    (action: string, data?: any) => {
      debug(`Component: ${action}`, {
        action,
        ...data,
        _type: "component",
        _component: component || context,
      });
    },
    [debug, component, context],
  );

  const event = useCallback(
    (name: string, data?: any) => {
      info(`Event: ${name}`, {
        name,
        ...data,
        _type: "event",
      });
    },
    [info],
  );

  // ============ GROUPAGE ============

  const group = useCallback(
    (name: string, fn: () => void) => {
      if (!enabledRef.current) return;
      const loggerInstance = createChild([]);
      loggerInstance.group(name, fn);
    },
    [createChild],
  );

  const groupCollapsed = useCallback(
    (name: string, fn: () => void) => {
      if (!enabledRef.current) return;
      const loggerInstance = createChild([]);
      loggerInstance.groupCollapsed(name, fn);
    },
    [createChild],
  );

  // ============ PERFORMANCE ============

  const time = useCallback(
    (label: string) => {
      if (!enabledRef.current) return;
      const loggerInstance = createChild([]);
      loggerInstance.time(label);
    },
    [createChild],
  );

  const timeEnd = useCallback(
    (label: string) => {
      if (!enabledRef.current) return;
      const loggerInstance = createChild([]);
      loggerInstance.timeEnd(label);
    },
    [createChild],
  );

  const timeAsync = useCallback(
    async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
      if (!enabledRef.current) {
        return fn();
      }
      const loggerInstance = createChild([]);
      return loggerInstance.timeAsync(label, fn);
    },
    [createChild],
  );

  // ============ ENFANT ============

  const child = useCallback(
    (childTags: string[]): UseLoggerReturn => {
      const childContext = context
        ? `${context}:${childTags.join(":")}`
        : childTags.join(":");
      const childOptions: UseLoggerOptions = {
        ...options,
        tags: [...fullTags, ...childTags],
        component,
      };
      return useLogger(childContext, childOptions);
    },
    [context, fullTags, component, options],
  );

  // ============ CONFIGURATION ============

  const setLevel = useCallback((newLevel: LogLevel) => {
    levelRef.current = newLevel;
    loggerRef.current.setLevel(newLevel);
  }, []);

  const setEnabled = useCallback((newEnabled: boolean) => {
    enabledRef.current = newEnabled;
    loggerRef.current.setEnabled(newEnabled);
  }, []);

  const getLogger = useCallback(() => {
    return loggerRef.current;
  }, []);

  // ============ NETTOYAGE ============

  const cleanup = useCallback(() => {
    loggerRef.current.flush();
  }, []);

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    debug,
    info,
    warn,
    error,
    exception,
    performance,
    api,
    component: componentLog,
    event,
    group,
    groupCollapsed,
    time,
    timeEnd,
    timeAsync,
    child,
    setLevel,
    setEnabled,
    getLogger,
    cleanup,
  };
};

/**
 * Hook pour créer un logger de composant
 *
 * @param componentName - Nom du composant
 * @param options - Options supplémentaires
 * @returns {Object} Méthodes de logging
 *
 * @example
 * const log = useComponentLogger('ProductCard');
 *
 * // Log automatiquement avec le nom du composant
 * log.render(); // Log le rendu
 * log.propChange('productId', oldValue, newValue); // Log un changement de prop
 * log.stateChange('loading', false); // Log un changement d'état
 * log.mounted(); // Log le montage
 * log.unmounted(); // Log le démontage
 */
export const useComponentLogger = (
  componentName: string,
  options: Omit<UseLoggerOptions, "component"> = {},
): UseLoggerReturn & {
  /** Log le rendu du composant */
  render: (data?: any) => void;
  /** Log un changement de prop */
  propChange: (propName: string, oldValue: any, newValue: any) => void;
  /** Log un changement d'état */
  stateChange: (stateName: string, newValue: any) => void;
  /** Log le montage du composant */
  mounted: () => void;
  /** Log le démontage du composant */
  unmounted: () => void;
  /** Log une action utilisateur */
  userAction: (action: string, data?: any) => void;
} => {
  const log = useLogger(componentName, {
    ...options,
    component: componentName,
  });

  const render = useCallback(
    (data?: any) => {
      log.debug("Render", { ...data, _type: "render" });
    },
    [log],
  );

  const propChange = useCallback(
    (propName: string, oldValue: any, newValue: any) => {
      log.debug(`Prop change: ${propName}`, {
        propName,
        oldValue,
        newValue,
        _type: "propChange",
      });
    },
    [log],
  );

  const stateChange = useCallback(
    (stateName: string, newValue: any) => {
      log.debug(`State change: ${stateName}`, {
        stateName,
        newValue,
        _type: "stateChange",
      });
    },
    [log],
  );

  const mounted = useCallback(() => {
    log.debug("Mounted", { _type: "lifecycle" });
  }, [log]);

  const unmounted = useCallback(() => {
    log.debug("Unmounted", { _type: "lifecycle" });
  }, [log]);

  const userAction = useCallback(
    (action: string, data?: any) => {
      log.info(`User action: ${action}`, {
        action,
        ...data,
        _type: "userAction",
      });
    },
    [log],
  );

  return {
    ...log,
    render,
    propChange,
    stateChange,
    mounted,
    unmounted,
    userAction,
  };
};

/**
 * Hook pour logger les appels API
 *
 * @param baseUrl - URL de base de l'API
 * @param options - Options supplémentaires
 * @returns {Object} Méthodes de logging
 *
 * @example
 * const apiLog = useApiLogger('https://api.example.com');
 *
 * // Logger une requête
 * apiLog.request('GET', '/users');
 *
 * // Logger une réponse
 * apiLog.response('GET', '/users', { data: [] });
 *
 * // Logger une erreur
 * apiLog.error('GET', '/users', error);
 */
export const useApiLogger = (
  baseUrl: string,
  options: Omit<UseLoggerOptions, "component"> = {},
): {
  /** Logger une requête */
  request: (method: string, endpoint: string, data?: any) => void;
  /** Logger une réponse */
  response: (
    method: string,
    endpoint: string,
    response: any,
    duration?: number,
  ) => void;
  /** Logger une erreur API */
  error: (
    method: string,
    endpoint: string,
    error: any,
    duration?: number,
  ) => void;
  /** Logger une requête avec durée */
  timing: (
    method: string,
    endpoint: string,
    duration: number,
    success: boolean,
  ) => void;
  /** Logger une requête complète avec durée */
  logRequest: <T>(
    method: string,
    endpoint: string,
    fn: () => Promise<T>,
  ) => Promise<T>;
} => {
  const log = useLogger("API", {
    ...options,
    component: "ApiLogger",
    tags: ["api", baseUrl],
    metadata: { baseUrl },
  });

  const fullUrl = useCallback(
    (endpoint: string) => {
      return `${baseUrl}${endpoint}`;
    },
    [baseUrl],
  );

  const request = useCallback(
    (method: string, endpoint: string, data?: any) => {
      log.api(method, fullUrl(endpoint), data);
    },
    [log, fullUrl],
  );

  const response = useCallback(
    (
      method: string,
      endpoint: string,
      responseData: any,
      duration?: number,
    ) => {
      log.info(`API Response: ${method} ${endpoint}`, {
        method,
        endpoint: fullUrl(endpoint),
        response: responseData,
        duration,
        _type: "api_response",
      });
    },
    [log, fullUrl],
  );

  const error = useCallback(
    (method: string, endpoint: string, errorData: any, duration?: number) => {
      log.error(`API Error: ${method} ${endpoint}`, {
        method,
        endpoint: fullUrl(endpoint),
        error: errorData,
        duration,
        _type: "api_error",
      });
    },
    [log, fullUrl],
  );

  const timing = useCallback(
    (method: string, endpoint: string, duration: number, success: boolean) => {
      log.performance(`API: ${method} ${endpoint}`, duration, {
        method,
        endpoint: fullUrl(endpoint),
        success,
        _type: "api_timing",
      });
    },
    [log, fullUrl],
  );

  const logRequest = useCallback(
    async <T>(
      method: string,
      endpoint: string,
      fn: () => Promise<T>,
    ): Promise<T> => {
      const startTime = performance.now();
      request(method, endpoint);

      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        response(method, endpoint, result, duration);
        return result;
      } catch (err) {
        const duration = performance.now() - startTime;
        error(method, endpoint, err, duration);
        throw err;
      }
    },
    [request, response, error],
  );

  return {
    request,
    response,
    error,
    timing,
    logRequest,
  };
};

export default useLogger;
