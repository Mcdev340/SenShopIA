import { apiClient } from '@/lib/api-client';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  UpdateProfileData,
  UserPreferences,
  UserAddress,
  UserStats,
  UserActivity,
} from '@/types/user';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ============ AUTHENTICATION ============

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
    if (response.token && response.refresh) {
      apiClient.setTokens(response.token, response.refresh);
    }
    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/', credentials);
    if (response.token && response.refresh) {
      apiClient.setTokens(response.token, response.refresh);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      apiClient.clearTokens();
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refresh: string }> {
    const response = await apiClient.post<{ token: string; refresh: string }>('/auth/refresh/', {
      refresh: refreshToken,
    });
    if (response.token && response.refresh) {
      apiClient.setTokens(response.token, response.refresh);
    }
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me/');
  }

  // ============ PROFILE ============

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return apiClient.patch<User>('/auth/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return apiClient.post('/auth/change-password/', { oldPassword, newPassword });
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    return apiClient.post('/auth/password-reset/request/', data);
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<void> {
    return apiClient.post('/auth/password-reset/confirm/', data);
  }

  async verifyEmail(token: string): Promise<void> {
    return apiClient.post('/auth/verify-email/', { token });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    return apiClient.post('/auth/resend-verification/', { email });
  }

  // ============ PREFERENCES ============

  async getPreferences(): Promise<UserPreferences> {
    return apiClient.get<UserPreferences>('/auth/preferences/');
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return apiClient.patch<UserPreferences>('/auth/preferences/', preferences);
  }

  // ============ ADDRESSES ============

  async getAddresses(): Promise<UserAddress[]> {
    return apiClient.get<UserAddress[]>('/auth/addresses/');
  }

  async getAddress(id: string): Promise<UserAddress> {
    return apiClient.get<UserAddress>(`/auth/addresses/${id}/`);
  }

  async createAddress(address: Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<UserAddress> {
    return apiClient.post<UserAddress>('/auth/addresses/', address);
  }

  async updateAddress(id: string, address: Partial<UserAddress>): Promise<UserAddress> {
    return apiClient.patch<UserAddress>(`/auth/addresses/${id}/`, address);
  }

  async deleteAddress(id: string): Promise<void> {
    return apiClient.delete(`/auth/addresses/${id}/`);
  }

  async setDefaultAddress(id: string): Promise<void> {
    return apiClient.post(`/auth/addresses/${id}/set-default/`);
  }

  // ============ STATS & ACTIVITY ============

  async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/auth/stats/');
  }

  async getUserActivities(params?: { page?: number; limit?: number; type?: string }): Promise<{
    activities: UserActivity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/auth/activities/?${queryParams.toString()}`);
  }

  // ============ DELIVERY AGENT SPECIFIC ============

  async updateAgentStatus(isAvailable: boolean): Promise<void> {
    return apiClient.patch('/auth/agent/status/', { is_available: isAvailable });
  }

  async updateAgentLocation(lat: number, lng: number): Promise<void> {
    return apiClient.post('/auth/agent/location/', { lat, lng });
  }

  async getAgentStats(): Promise<{
    totalDeliveries: number;
    completedDeliveries: number;
    rating: number;
    earnings: number;
    todayDeliveries: number;
  }> {
    return apiClient.get('/auth/agent/stats/');
  }

  // ============ ADVISOR SPECIFIC ============

  async updateAdvisorStatus(isAvailable: boolean): Promise<void> {
    return apiClient.patch('/auth/advisor/status/', { is_available: isAvailable });
  }

  async getAdvisorStats(): Promise<{
    totalTickets: number;
    resolved: number;
    open: number;
    rating: number;
    averageResponseTime: number;
  }> {
    return apiClient.get('/auth/advisor/stats/');
  }

  // ============ UTILITY ============

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  async checkAuth(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = AuthService.getInstance();