/* eslint-disable no-console */

/**
 * Niveaux de log disponibles
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Configuration du logger
 */
export interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteUrl?: string;
  environment: "development" | "production" | "test";
  tags?: string[];
}

/**
 * Structure d'une entrée de log
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
  tags?: string[];
  context?: Record<string, any>;
}

/**
 * Logger avancé avec support multi-environnement
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private bufferSize: number = 100;
  private flushInterval: number = 5000;

  private constructor() {
    this.config = {
      level:
        process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
      enabled: true,
      enableConsole: true,
      enableRemote: false,
      environment:
        (process.env.NODE_ENV as "development" | "production" | "test") ||
        "development",
      tags: [],
    };

    if (typeof window !== "undefined") {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // ============ CONFIGURATION ============

  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  public addTag(tag: string): void {
    if (!this.config.tags) {
      this.config.tags = [];
    }
    if (!this.config.tags.includes(tag)) {
      this.config.tags.push(tag);
    }
  }

  public removeTag(tag: string): void {
    if (this.config.tags) {
      this.config.tags = this.config.tags.filter((t) => t !== tag);
    }
  }

  // ============ MÉTHODES DE LOG ============

  public debug(message: string, data?: any, tags?: string[]): void {
    this.log(LogLevel.DEBUG, message, data, undefined, tags);
  }

  public info(message: string, data?: any, tags?: string[]): void {
    this.log(LogLevel.INFO, message, data, undefined, tags);
  }

  public warn(message: string, data?: any, tags?: string[]): void {
    this.log(LogLevel.WARN, message, data, undefined, tags);
  }

  public error(message: string, error?: Error | any, tags?: string[]): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, message, undefined, err, tags);
  }

  public exception(error: Error | any, context?: Record<string, any>): void {
    const err = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, err.message, context, err);
  }

  // ============ MÉTHODE PRINCIPALE ============

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error,
    tags?: string[],
  ): void {
    if (!this.config.enabled) return;
    if (level < this.config.level) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      error,
      tags: [...(this.config.tags || []), ...(tags || [])],
      context: {
        environment: this.config.environment,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
      },
    };

    this.buffer.push(entry);

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }

    if (this.config.environment === "production" && level >= LogLevel.ERROR) {
      this.flush();
    }
  }

  // ============ FLUSH ============

  public flush(): void {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.buffer = [];

    if (this.config.enableConsole) {
      this.writeToConsole(entries);
    }

    if (this.config.enableRemote && this.config.remoteUrl) {
      this.sendToRemote(entries);
    }
  }

  private writeToConsole(entries: LogEntry[]): void {
    entries.forEach((entry) => {
      const prefix = `[${entry.timestamp.toISOString()}]`;
      const tagsStr =
        entry.tags && entry.tags.length > 0 ? `[${entry.tags.join(",")}]` : "";
      const message = `${prefix} ${LogLevel[entry.level]} ${tagsStr} ${entry.message}`;

      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(message, entry.data || entry.error);
          break;
        case LogLevel.INFO:
          console.info(message, entry.data || entry.error);
          break;
        case LogLevel.WARN:
          console.warn(message, entry.data || entry.error);
          break;
        case LogLevel.ERROR:
          console.error(message, entry.data || entry.error);
          break;
        default:
          console.log(message, entry.data || entry.error);
      }
    });
  }

  private async sendToRemote(entries: LogEntry[]): Promise<void> {
    if (!this.config.remoteUrl) return;

    try {
      await fetch(this.config.remoteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entries: entries.map((entry) => ({
            ...entry,
            error: entry.error
              ? {
                  name: entry.error.name,
                  message: entry.error.message,
                  stack: entry.error.stack,
                }
              : undefined,
          })),
        }),
      });
    } catch {
      console.error("Failed to send logs to remote");
    }
  }

  // ============ GROUPAGE ============

  public group(name: string, fn: () => void): void {
    if (this.config.enableConsole) {
      console.group(name);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  }

  public groupCollapsed(name: string, fn: () => void): void {
    if (this.config.enableConsole) {
      console.groupCollapsed(name);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  }

  // ============ PERFORMANCE ============

  public time(label: string): void {
    if (this.config.enableConsole) {
      console.time(label);
    }
  }

  public timeEnd(label: string): void {
    if (this.config.enableConsole) {
      console.timeEnd(label);
    }
  }

  public async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.time(label);
    return fn().finally(() => {
      this.timeEnd(label);
    });
  }

  // ============ UTILITAIRES ============

  public withContext(
    context: Record<string, any>,
  ): (message: string, data?: any) => void {
    return (message: string, data?: any) => {
      this.info(message, { ...data, ...context });
    };
  }

  public child(tags: string[]): Logger {
    const child = new Logger();
    child.config = { ...this.config };
    child.config.tags = [...(this.config.tags || []), ...tags];
    return child;
  }

  // ============ STATUS ============

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public getLevel(): LogLevel {
    return this.config.level;
  }

  public getConfig(): LoggerConfig {
    return { ...this.config };
  }

  public clearBuffer(): void {
    this.buffer = [];
  }
}

export const logger = Logger.getInstance();

export const createLogger = (tags: string[]): Logger => {
  return logger.child(tags);
};

export const componentLogger = (componentName: string): Logger => {
  return logger.child([componentName]);
};

export const serviceLogger = (serviceName: string): Logger => {
  return logger.child([`service:${serviceName}`]);
};

export const hookLogger = (hookName: string): Logger => {
  return logger.child([`hook:${hookName}`]);
};

export default Logger;
