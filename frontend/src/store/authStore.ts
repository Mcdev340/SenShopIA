import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';
import { 
  User, 
  UserRole, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse,
  UpdateProfileData,
  UserPreferences,
  UserAddress,
  UserStats,
  UserActivity,
} from '@/types/user';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-client';
import { logger } from '@/lib/logger';

// ============ TYPES ============

export interface AuthState {
  // Données utilisateur
  user: User | null;
  userId: string | null;
  userRole: UserRole | null;
  
  // Préférences
  preferences: UserPreferences | null;
  addresses: UserAddress[];
  stats: UserStats | null;
  activities: UserActivity[];
  
  // État d'authentification
  isAuthenticated: boolean;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // État
  loading: boolean;
  refreshing: boolean;
  isRefreshing: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  
  // Token
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: Date | null;
  
  // Session
  sessionId: string | null;
  lastLogin: Date | null;
  loginCount: number;
  
  // Retry
  retryCount: number;
  maxRetries: number;
  
  // Actions - Authentification
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (data: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshTokenAction: () => Promise<boolean>;
  getCurrentUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  
  // Actions - Token
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  isTokenValid: () => boolean;
  
  // Actions - Session
  setSession: (user: User, token: string, refresh: string) => void;
  clearSession: () => void;
  
  // Actions - Profil
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  confirmPasswordReset: (uid: string, token: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  
  // Actions - Préférences
  loadPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  
  // Actions - Adresses
  loadAddresses: () => Promise<void>;
  createAddress: (address: Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<UserAddress | null>;
  updateAddress: (id: string, address: Partial<UserAddress>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
  
  // Actions - Stats
  loadStats: () => Promise<void>;
  loadActivities: (params?: { page?: number; limit?: number; type?: string }) => Promise<void>;
  
  // Actions - Agent spécifique
  updateAgentStatus: (isAvailable: boolean) => Promise<boolean>;
  updateAgentLocation: (lat: number, lng: number) => Promise<boolean>;
  getAgentStats: () => Promise<{ 
    totalDeliveries: number; 
    completedDeliveries: number; 
    rating: number; 
    earnings: number; 
    todayDeliveries: number;
    pendingDeliveries: number;
  } | null>;
  
  // Actions - Advisor spécifique
  updateAdvisorStatus: (isAvailable: boolean) => Promise<boolean>;
  getAdvisorStats: () => Promise<{ 
    totalTickets: number; 
    resolved: number; 
    open: number; 
    inProgress: number;
    rating: number; 
    averageResponseTime: number;
    satisfactionRate: number;
  } | null>;
  
  // Actions - Utilitaires
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isClient: () => boolean;
  isDelivery: () => boolean;
  isAdvisor: () => boolean;
  getFullName: () => string;
  getInitials: () => string;
  getDisplayName: () => string;
  getAvatar: () => string | null;
  
  clearError: () => void;
  reset: () => void;
}

// ============ INITIAL STATE ============

const initialState: Omit<AuthState, 
  | 'login'
  | 'register'
  | 'logout'
  | 'refreshTokenAction'
  | 'getCurrentUser'
  | 'checkAuth'
  | 'getToken'
  | 'getRefreshToken'
  | 'isTokenValid'
  | 'setSession'
  | 'clearSession'
  | 'updateProfile'
  | 'changePassword'
  | 'requestPasswordReset'
  | 'confirmPasswordReset'
  | 'verifyEmail'
  | 'resendVerificationEmail'
  | 'loadPreferences'
  | 'updatePreferences'
  | 'loadAddresses'
  | 'createAddress'
  | 'updateAddress'
  | 'deleteAddress'
  | 'setDefaultAddress'
  | 'loadStats'
  | 'loadActivities'
  | 'updateAgentStatus'
  | 'updateAgentLocation'
  | 'getAgentStats'
  | 'updateAdvisorStatus'
  | 'getAdvisorStats'
  | 'hasRole'
  | 'isAdmin'
  | 'isClient'
  | 'isDelivery'
  | 'isAdvisor'
  | 'getFullName'
  | 'getInitials'
  | 'getDisplayName'
  | 'getAvatar'
  | 'clearError'
  | 'reset'
> = {
  // Données utilisateur
  user: null,
  userId: null,
  userRole: null,
  
  // Préférences
  preferences: null,
  addresses: [],
  stats: null,
  activities: [],
  
  // État d'authentification
  isAuthenticated: false,
  isVerified: false,
  isEmailVerified: false,
  isPhoneVerified: false,
  
  // État
  loading: false,
  refreshing: false,
  isRefreshing: false,
  error: null,
  status: 'idle' as const,
  
  // Token
  token: null,
  refreshToken: null,
  tokenExpiry: null,
  
  // Session
  sessionId: null,
  lastLogin: null,
  loginCount: 0,
  
  // Retry
  retryCount: 0,
  maxRetries: 3,
};

// ============ STORE ============

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============ AUTHENTIFICATION ============

      login: async (email: string, password: string, remember: boolean = false) => {
        set({ loading: true, error: null, status: 'loading' });
        try {
          const response = await authService.login({ email, password });
          
          // Mettre à jour l'état
          set({
            user: response.user,
            userId: response.user.id,
            userRole: response.user.role,
            isAuthenticated: true,
            isVerified: response.user.isVerified || false,
            isEmailVerified: response.user.isEmailVerified || false,
            isPhoneVerified: response.user.isPhoneVerified || false,
            token: response.token,
            refreshToken: response.refresh,
            tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            lastLogin: new Date(),
            loginCount: get().loginCount + 1,
            loading: false,
            status: 'success',
            retryCount: 0,
          });
          
          // Charger les données supplémentaires en arrière-plan
          Promise.all([
            get().loadPreferences(),
            get().loadAddresses(),
            get().loadStats(),
          ]).catch(error => {
            logger.warn('Failed to load additional data', error);
          });
          
          logger.info('User logged in', { 
            userId: response.user.id, 
            email: response.user.email,
            role: response.user.role,
          });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de connexion';
          set({ 
            error: message, 
            loading: false, 
            status: 'error' 
          });
          logger.error('Login failed', error);
          return false;
        }
      },

      register: async (data: RegisterCredentials) => {
        set({ loading: true, error: null, status: 'loading' });
        try {
          const response = await authService.register(data);
          
          set({
            user: response.user,
            userId: response.user.id,
            userRole: response.user.role,
            isAuthenticated: true,
            isVerified: false,
            isEmailVerified: false,
            isPhoneVerified: false,
            token: response.token,
            refreshToken: response.refresh,
            tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            lastLogin: new Date(),
            loginCount: 1,
            loading: false,
            status: 'success',
          });
          
          logger.info('User registered', { 
            userId: response.user.id, 
            email: response.user.email,
            role: response.user.role,
          });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur d\'inscription';
          set({ 
            error: message, 
            loading: false, 
            status: 'error' 
          });
          logger.error('Registration failed', error);
          return false;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
        } catch (error) {
          // Ignorer les erreurs de déconnexion
          logger.warn('Logout error (ignored)', error);
        } finally {
          // Réinitialiser l'état
          get().clearSession();
          logger.info('User logged out');
        }
      },

      refreshTokenAction: async () => {
        // Éviter les doubles refresh
        if (get().isRefreshing) {
          return new Promise<boolean>((resolve) => {
            const unsubscribe = useAuthStore.subscribe((state) => {
              if (!state.isRefreshing) {
                unsubscribe();
                resolve(!!state.token);
              }
            });
          });
        }

        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          logger.error('No refresh token available');
          return false;
        }

        set({ isRefreshing: true, error: null });
        try {
          // Appel direct à l'API de refresh
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Refresh failed');
          }

          const data = await response.json();
          
          set({
            token: data.access,
            refreshToken: data.refresh,
            tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isRefreshing: false,
            loading: false,
          });
          
          logger.info('Token refreshed');
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erreur de rafraîchissement du token';
          set({ 
            error: message, 
            isRefreshing: false,
            loading: false,
            status: 'error',
          });
          logger.error('Token refresh failed', error);
          
          // Si le refresh échoue, déconnecter l'utilisateur
          await get().logout();
          return false;
        }
      },

      getCurrentUser: async () => {
        // Vérifier si le token est expiré
        if (!get().isTokenValid()) {
          const refreshed = await get().refreshTokenAction();
          if (!refreshed) return;
        }

        set({ loading: true, error: null });
        try {
          const user = await authService.getCurrentUser();
          
          set({
            user,
            userId: user.id,
            userRole: user.role,
            isAuthenticated: true,
            isVerified: user.isVerified || false,
            isEmailVerified: user.isEmailVerified || false,
            isPhoneVerified: user.isPhoneVerified || false,
            loading: false,
            status: 'success',
          });
          
          // Charger les données supplémentaires en arrière-plan
          Promise.all([
            get().loadPreferences(),
            get().loadAddresses(),
            get().loadStats(),
          ]).catch(error => {
            logger.warn('Failed to load additional data', error);
          });
          
          logger.info('Current user loaded', { userId: user.id });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to get current user', error);
          
          // Si erreur 401, déconnecter
          if (error instanceof ApiError && error.status === 401) {
            await get().logout();
          }
        }
      },

      checkAuth: async () => {
        if (get().isAuthenticated && get().user) {
          return true;
        }

        if (get().token) {
          await get().getCurrentUser();
          return get().isAuthenticated;
        }

        return false;
      },

      // ============ TOKEN ============

      getToken: () => {
        return get().token;
      },

      getRefreshToken: () => {
        return get().refreshToken;
      },

      isTokenValid: () => {
        const tokenExpiry = get().tokenExpiry;
        if (!tokenExpiry) return false;
        return new Date() < tokenExpiry;
      },

      // ============ SESSION ============

      setSession: (user: User, token: string, refresh: string) => {
        set({
          user,
          userId: user.id,
          userRole: user.role,
          isAuthenticated: true,
          isVerified: user.isVerified || false,
          isEmailVerified: user.isEmailVerified || false,
          isPhoneVerified: user.isPhoneVerified || false,
          token,
          refreshToken: refresh,
          tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'success',
        });
        
        logger.info('Session restored', { userId: user.id });
      },

      clearSession: () => {
        set({
          user: null,
          userId: null,
          userRole: null,
          isAuthenticated: false,
          isVerified: false,
          isEmailVerified: false,
          isPhoneVerified: false,
          token: null,
          refreshToken: null,
          tokenExpiry: null,
          preferences: null,
          addresses: [],
          stats: null,
          activities: [],
          loading: false,
          refreshing: false,
          isRefreshing: false,
          status: 'idle',
        });
      },

      // ============ PROFIL ============

      updateProfile: async (data: UpdateProfileData) => {
        set({ loading: true, error: null });
        try {
          const user = await authService.updateProfile(data);
          
          set({
            user,
            userId: user.id,
            loading: false,
            status: 'success',
          });
          
          logger.info('Profile updated', { userId: user.id });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Profile update failed', error);
          return false;
        }
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        set({ loading: true, error: null });
        try {
          await authService.changePassword(oldPassword, newPassword);
          set({ loading: false });
          logger.info('Password changed');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de changement de mot de passe';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Password change failed', error);
          return false;
        }
      },

      requestPasswordReset: async (email: string) => {
        set({ loading: true, error: null });
        try {
          await authService.requestPasswordReset({ email });
          set({ loading: false });
          logger.info('Password reset requested', { email });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de demande';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Password reset request failed', error);
          return false;
        }
      },

      confirmPasswordReset: async (uid: string, token: string, newPassword: string, confirmPassword: string) => {
        set({ loading: true, error: null });
        try {
          await authService.confirmPasswordReset({ uid, token, newPassword, confirmPassword });
          set({ loading: false });
          logger.info('Password reset confirmed');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de réinitialisation';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Password reset confirmation failed', error);
          return false;
        }
      },

      verifyEmail: async (token: string) => {
        set({ loading: true, error: null });
        try {
          await authService.verifyEmail(token);
          set({ 
            isEmailVerified: true,
            isVerified: true,
            loading: false,
          });
          logger.info('Email verified');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de vérification';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Email verification failed', error);
          return false;
        }
      },

      resendVerificationEmail: async (email: string) => {
        set({ loading: true, error: null });
        try {
          // Utiliser l'endpoint de vérification direct
          await authService.resendVerificationEmail(email);
          set({ loading: false });
          logger.info('Verification email resent', { email });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur d\'envoi';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Resend verification failed', error);
          return false;
        }
      },

      // ============ PRÉFÉRENCES ============

      loadPreferences: async () => {
        try {
          const preferences = await authService.getPreferences();
          set({ preferences });
        } catch (error) {
          logger.warn('Failed to load preferences', error);
        }
      },

      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        set({ loading: true, error: null });
        try {
          const updated = await authService.updatePreferences(preferences);
          set({ 
            preferences: updated, 
            loading: false,
          });
          logger.info('Preferences updated');
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Preferences update failed', error);
          return false;
        }
      },

      // ============ ADRESSES ============

      loadAddresses: async () => {
        try {
          const addresses = await authService.getAddresses();
          set({ addresses });
        } catch (error) {
          logger.warn('Failed to load addresses', error);
        }
      },

      createAddress: async (address: Omit<UserAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        set({ loading: true, error: null });
        try {
          const newAddress = await authService.createAddress(address);
          set((state) => ({
            addresses: [...state.addresses, newAddress],
            loading: false,
          }));
          logger.info('Address created');
          return newAddress;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de création';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Address creation failed', error);
          return null;
        }
      },

      updateAddress: async (id: string, address: Partial<UserAddress>) => {
        set({ loading: true, error: null });
        try {
          const updated = await authService.updateAddress(id, address);
          set((state) => ({
            addresses: state.addresses.map((a) => (a.id === id ? updated : a)),
            loading: false,
          }));
          logger.info('Address updated', { addressId: id });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Address update failed', error);
          return false;
        }
      },

      deleteAddress: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await authService.deleteAddress(id);
          set((state) => ({
            addresses: state.addresses.filter((a) => a.id !== id),
            loading: false,
          }));
          logger.info('Address deleted', { addressId: id });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de suppression';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Address deletion failed', error);
          return false;
        }
      },

      setDefaultAddress: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await authService.setDefaultAddress(id);
          set((state) => ({
            addresses: state.addresses.map((a) => ({
              ...a,
              isDefault: a.id === id,
            })),
            loading: false,
          }));
          logger.info('Default address set', { addressId: id });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Set default address failed', error);
          return false;
        }
      },

      // ============ STATISTIQUES ============

      loadStats: async () => {
        try {
          const stats = await authService.getUserStats();
          set({ stats });
        } catch (error) {
          logger.warn('Failed to load stats', error);
        }
      },

      loadActivities: async (params?: { page?: number; limit?: number; type?: string }) => {
        try {
          const result = await authService.getUserActivities(params);
          set({ activities: result.activities });
        } catch (error) {
          logger.warn('Failed to load activities', error);
        }
      },

      // ============ AGENT SPÉCIFIQUE ============

      updateAgentStatus: async (isAvailable: boolean) => {
        set({ loading: true, error: null });
        try {
          await authService.updateAgentStatus(isAvailable);
          set({ loading: false });
          logger.info('Agent status updated', { isAvailable });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Update agent status failed', error);
          return false;
        }
      },

      updateAgentLocation: async (lat: number, lng: number) => {
        try {
          await authService.updateAgentLocation(lat, lng);
          logger.info('Agent location updated', { lat, lng });
          return true;
        } catch (error) {
          logger.error('Update agent location failed', error);
          return false;
        }
      },

      getAgentStats: async () => {
        try {
          const stats = await authService.getAgentStats();
          return stats;
        } catch (error) {
          logger.error('Get agent stats failed', error);
          return null;
        }
      },

      // ============ ADVISOR SPÉCIFIQUE ============

      updateAdvisorStatus: async (isAvailable: boolean) => {
        set({ loading: true, error: null });
        try {
          await authService.updateAdvisorStatus(isAvailable);
          set({ loading: false });
          logger.info('Advisor status updated', { isAvailable });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Update advisor status failed', error);
          return false;
        }
      },

      getAdvisorStats: async () => {
        try {
          const stats = await authService.getAdvisorStats();
          return stats;
        } catch (error) {
          logger.error('Get advisor stats failed', error);
          return null;
        }
      },

      // ============ UTILITAIRES ============

      hasRole: (role: UserRole | UserRole[]) => {
        const userRole = get().userRole;
        if (!userRole) return false;
        if (Array.isArray(role)) {
          return role.includes(userRole);
        }
        return userRole === role;
      },

      isAdmin: () => {
        return get().userRole === UserRole.ADMIN;
      },

      isClient: () => {
        return get().userRole === UserRole.CLIENT;
      },

      isDelivery: () => {
        return get().userRole === UserRole.DELIVERY;
      },

      isAdvisor: () => {
        return get().userRole === UserRole.ADVISOR;
      },

      getFullName: () => {
        const user = get().user;
        if (!user) return '';
        if (user.firstName && user.lastName) {
          return `${user.firstName} ${user.lastName}`;
        }
        return user.username || user.email || '';
      },

      getInitials: () => {
        const fullName = get().getFullName();
        if (!fullName) return '';
        const parts = fullName.split(' ');
        if (parts.length === 1) {
          return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      },

      getDisplayName: () => {
        const user = get().user;
        if (!user) return 'Utilisateur';
        if (user.firstName) {
          return user.firstName;
        }
        return user.username || user.email?.split('@')[0] || 'Utilisateur';
      },

      getAvatar: () => {
        const user = get().user;
        return user?.avatar || null;
      },

      clearError: () => {
        set({ error: null, status: 'idle' });
      },

      reset: () => {
        set({
          ...initialState,
          preferences: get().preferences,
          addresses: get().addresses,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        userId: state.userId,
        userRole: state.userRole,
        isAuthenticated: state.isAuthenticated,
        isVerified: state.isVerified,
        isEmailVerified: state.isEmailVerified,
        isPhoneVerified: state.isPhoneVerified,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        lastLogin: state.lastLogin,
        loginCount: state.loginCount,
        preferences: state.preferences,
        addresses: state.addresses,
        stats: state.stats,
      }),
    }
  )
);

// ============ HOOKS PERSONNALISÉS ============

/**
 * Hook pour l'authentification
 */
export const useAuth = () => {
  const store = useAuthStore();
  
  // Vérifier l'authentification au montage
  React.useEffect(() => {
    if (store.token && !store.user) {
      store.getCurrentUser();
    }
  }, []);
  
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    updateProfile: store.updateProfile,
    changePassword: store.changePassword,
    getFullName: store.getFullName,
    getInitials: store.getInitials,
    getDisplayName: store.getDisplayName,
    getAvatar: store.getAvatar,
    isAdmin: store.isAdmin,
    isClient: store.isClient,
    isDelivery: store.isDelivery,
    isAdvisor: store.isAdvisor,
    hasRole: store.hasRole,
    checkAuth: store.checkAuth,
    getToken: store.getToken,
    isTokenValid: store.isTokenValid,
  };
};

/**
 * Hook pour les préférences utilisateur
 */
export const useUserPreferences = () => {
  const store = useAuthStore();
  
  React.useEffect(() => {
    store.loadPreferences();
  }, []);
  
  return {
    preferences: store.preferences,
    loading: store.loading,
    updatePreferences: store.updatePreferences,
  };
};

/**
 * Hook pour les adresses utilisateur
 */
export const useUserAddresses = () => {
  const store = useAuthStore();
  
  React.useEffect(() => {
    store.loadAddresses();
  }, []);
  
  return {
    addresses: store.addresses,
    loading: store.loading,
    createAddress: store.createAddress,
    updateAddress: store.updateAddress,
    deleteAddress: store.deleteAddress,
    setDefaultAddress: store.setDefaultAddress,
  };
};

/**
 * Hook pour les statistiques utilisateur
 */
export const useUserStats = () => {
  const store = useAuthStore();
  
  React.useEffect(() => {
    store.loadStats();
  }, []);
  
  return {
    stats: store.stats,
    loading: store.loading,
    refresh: store.loadStats,
  };
};

/**
 * Hook pour les activités utilisateur
 */
export const useUserActivities = (params?: { page?: number; limit?: number; type?: string }) => {
  const store = useAuthStore();
  
  React.useEffect(() => {
    store.loadActivities(params);
  }, [JSON.stringify(params)]);
  
  return {
    activities: store.activities,
    loading: store.loading,
    refresh: () => store.loadActivities(params),
  };
};

/**
 * Hook pour les agents de livraison
 */
export const useDeliveryAgent = () => {
  const store = useAuthStore();
  
  return {
    updateStatus: store.updateAgentStatus,
    updateLocation: store.updateAgentLocation,
    getStats: store.getAgentStats,
    loading: store.loading,
    error: store.error,
  };
};

/**
 * Hook pour les conseillers
 */
export const useAdvisor = () => {
  const store = useAuthStore();
  
  return {
    updateStatus: store.updateAdvisorStatus,
    getStats: store.getAdvisorStats,
    loading: store.loading,
    error: store.error,
  };
};

// ============ EXPORT ============

export default useAuthStore;