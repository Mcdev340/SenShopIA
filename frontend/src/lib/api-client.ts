import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

// ============ TYPES D'ERREUR PERSONNALISÉS ============

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly data?: any;

  constructor(status: number, code: string, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Erreur de connexion au serveur") {
    super(message);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class AuthError extends Error {
  constructor(message: string = "Session expirée, veuillez vous reconnecter") {
    super(message);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;

  constructor(
    errors: Record<string, string[]>,
    message: string = "Données invalides",
  ) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// ============ INTERFACES ============

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ============ API CLIENT ============

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private config: ApiClientConfig;
  private cache: Map<string, CacheEntry> = new Map();

  private constructor() {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 1000,
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // ============ INTERCEPTORS ============

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this),
    );

    this.axiosInstance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this),
    );
  }

  private handleRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Éviter le cache pour les requêtes GET
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  }

  private handleRequestError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as RetryableRequest;

    // Erreur réseau
    if (!error.response) {
      toast.error("Erreur de connexion au serveur");
      return Promise.reject(new NetworkError());
    }

    // Token expiré
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return this.handleUnauthorized(originalRequest);
    }

    // Accès interdit
    if (error.response.status === 403) {
      toast.error("Vous n'avez pas les droits pour effectuer cette action");
      return Promise.reject(new ApiError(403, "FORBIDDEN", "Accès interdit"));
    }

    // Ressource non trouvée
    if (error.response.status === 404) {
      return Promise.reject(
        new ApiError(404, "NOT_FOUND", "Ressource non trouvée"),
      );
    }

    // Erreur de validation
    if (error.response.status === 422) {
      const data = error.response.data as any;
      const errors = data?.errors || data?.fields || {};
      const message = data?.message || data?.detail || "Données invalides";
      toast.error(message);
      return Promise.reject(new ValidationError(errors, message));
    }

    // Erreur serveur
    if (error.response.status >= 500) {
      toast.error("Une erreur interne est survenue");
      return Promise.reject(
        new ApiError(500, "SERVER_ERROR", "Erreur interne du serveur"),
      );
    }

    // Autres erreurs
    const data = error.response.data as any;
    const message =
      data?.message ||
      data?.detail ||
      error.message ||
      "Une erreur est survenue";

    if (error.response.status !== 404) {
      toast.error(message);
    }

    return Promise.reject(
      new ApiError(
        error.response.status,
        data?.code || "UNKNOWN_ERROR",
        message,
        data,
      ),
    );
  }

  // ============ TOKEN REFRESH ============

  private async handleUnauthorized(
    originalRequest: RetryableRequest,
  ): Promise<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new AuthError();
        }

        const response = await axios.post(
          `${this.config.baseURL}/auth/refresh/`,
          { refresh: refreshToken },
        );

        const { access, refresh } = response.data;
        this.setToken(access);
        this.setRefreshToken(refresh);
        this.isRefreshing = false;
        this.refreshSubscribers.forEach((cb) => cb(access));
        this.refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return this.axiosInstance(originalRequest);
      } catch (error) {
        this.isRefreshing = false;
        this.clearTokens();
        this.refreshSubscribers = [];
        toast.error("Session expirée, veuillez vous reconnecter");
        window.location.href = "/login";
        return Promise.reject(new AuthError());
      }
    }

    return new Promise((resolve) => {
      this.refreshSubscribers.push((token: string) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(this.axiosInstance(originalRequest));
      });
    });
  }

  // ============ TOKEN MANAGEMENT ============

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  private setRefreshToken(refresh: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("refreshToken", refresh);
    }
  }

  /**
   * Supprime les tokens du localStorage.
   * Méthode interne uniquement.
   */
  private removeTokensFromStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  }

  /**
   * Enregistre les tokens et configure le header Authorization.
   */
  public setTokens(token: string, refresh: string): void {
    this.setToken(token);
    this.setRefreshToken(refresh);

    this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  /**
   * Déconnecte l'utilisateur en supprimant les tokens
   * et le header Authorization.
   */
  public clearTokens(): void {
    this.removeTokensFromStorage();

    delete this.axiosInstance.defaults.headers.common.Authorization;
  }

  // ============ PUBLIC METHODS ============

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  public async upload<T>(
    url: string,
    data: FormData,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
  public async download(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Blob> {
    return this.axiosInstance.get(url, {
      ...config,
      responseType: "blob",
    });
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getBaseURL(): string {
    return this.config.baseURL;
  }

  // ============ CACHE ============

  public cacheSet<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  public cacheGet<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  public cacheClear(): void {
    this.cache.clear();
  }

  public cacheDelete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiClient = ApiClient.getInstance();
