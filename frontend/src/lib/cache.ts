/**
 * Configuration du cache
 */
export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
}

/**
 * Options pour une entrée de cache
 */
export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  priority?: 'low' | 'normal' | 'high';
  compress?: boolean;
}

/**
 * Entrée de cache
 */
interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt: number;
  tags: string[];
  priority: 'low' | 'normal' | 'high';
  size: number;
  accessCount: number;
  lastAccess: number;
}

/**
 * Statistiques du cache
 */
export interface CacheStats {
  size: number;
  maxSize: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  evictions: number;
  oldestEntry: Date;
  newestEntry: Date;
}

/**
 * Gestionnaire de cache avancé
 */
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private hitCount: number = 0;
  private missCount: number = 0;
  private evictions: number = 0;
  private cleanupTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      defaultTTL: 5 * 60 * 1000,
      maxSize: 1000,
      cleanupInterval: 60 * 1000,
    };

    if (typeof window !== 'undefined') {
      this.startCleanup();
    }
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // ============ CONFIGURATION ============

  public configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // ============ OPÉRATIONS PRINCIPALES ============

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.hitCount++;

    return entry.value as T;
  }

  public async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, options);
    return value;
  }

  public getOrSetSync<T>(key: string, fetchFn: () => T, options?: CacheOptions): T {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = fetchFn();
    this.set(key, value, options);
    return value;
  }

  public set<T>(key: string, value: T, options?: CacheOptions): boolean {
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    const ttl = options?.ttl || this.config.defaultTTL;
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      tags: options?.tags || [],
      priority: options?.priority || 'normal',
      size: this.calculateSize(value),
      accessCount: 0,
      lastAccess: Date.now(),
    };

    this.cache.set(key, entry);
    return true;
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.evictions = 0;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  // ============ INVALIDATION ============

  public invalidateTag(tag: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (entry.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public invalidateTags(tags: string[]): void {
    tags.forEach(tag => this.invalidateTag(tag));
  }

  public invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public invalidateOlderThan(date: Date): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < date.getTime()) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  public invalidateExpired(): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (entry.expiresAt < Date.now()) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // ============ STATISTIQUES ============

  public getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const sortedByTimestamp = entries.sort((a, b) => a.timestamp - b.timestamp);

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.hitCount + this.missCount > 0
        ? this.hitCount / (this.hitCount + this.missCount)
        : 0,
      evictions: this.evictions,
      oldestEntry: sortedByTimestamp.length > 0
        ? new Date(sortedByTimestamp[0].timestamp)
        : new Date(),
      newestEntry: sortedByTimestamp.length > 0
        ? new Date(sortedByTimestamp[sortedByTimestamp.length - 1].timestamp)
        : new Date(),
    };
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  public entries(): [string, any][] {
    const result: [string, any][] = [];
    this.cache.forEach((entry, key) => {
      result.push([key, entry.value]);
    });
    return result;
  }

  // ============ ÉVICTION ============

  private evict(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.priority === 'high') return;
      if (entry.lastAccess < oldestAccess) {
        oldestAccess = entry.lastAccess;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.evictions++;
    } else if (this.cache.size > 0) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        this.evictions++;
      }
    }
  }

  // ============ NETTOYAGE ============

  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cleanupTimer = setInterval(() => {
      this.invalidateExpired();
    }, this.config.cleanupInterval);
  }

  public stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // ============ UTILITAIRES ============

  private calculateSize(value: any): number {
    try {
      const str = JSON.stringify(value);
      return str.length;
    } catch {
      return 0;
    }
  }

  public serialize(): string {
    const data: Record<string, any> = {};
    this.cache.forEach((entry, key) => {
      data[key] = {
        value: entry.value,
        timestamp: entry.timestamp,
        expiresAt: entry.expiresAt,
        tags: entry.tags,
        priority: entry.priority,
      };
    });
    return JSON.stringify(data);
  }

  public deserialize(json: string): void {
    try {
      const data = JSON.parse(json);
      this.clear();
      Object.entries(data).forEach(([key, entry]: [string, any]) => {
        this.cache.set(key, {
          ...entry,
          accessCount: 0,
          lastAccess: Date.now(),
          size: this.calculateSize(entry.value),
        });
      });
    } catch {
      // Ignorer les erreurs de désérialisation
    }
  }
}

export const cache = CacheManager.getInstance();

export const createCache = <T>(ttl: number = 5 * 60 * 1000) => {
  const cacheMap = new Map<string, { value: T; expiresAt: number }>();

  return {
    get: (key: string): T | null => {
      const entry = cacheMap.get(key);
      if (!entry) return null;
      if (entry.expiresAt < Date.now()) {
        cacheMap.delete(key);
        return null;
      }
      return entry.value;
    },
    set: (key: string, value: T): void => {
      cacheMap.set(key, {
        value,
        expiresAt: Date.now() + ttl,
      });
    },
    delete: (key: string): boolean => {
      return cacheMap.delete(key);
    },
    clear: (): void => {
      cacheMap.clear();
    },
    has: (key: string): boolean => {
      return cacheMap.has(key);
    },
  };
};

export default CacheManager;