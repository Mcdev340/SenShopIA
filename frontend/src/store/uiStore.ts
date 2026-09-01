import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

// ============ TYPES ============

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'fr' | 'en';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  icon?: string;
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

export interface UIState {
  // Theme
  theme: Theme;
  isDarkMode: boolean;
  
  // Language
  language: Language;
  
  // Modals
  modals: Record<string, ModalState>;
  activeModal: string | null;
  
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  mobileMenuOpen: boolean;
  
  // Header
  headerHeight: number;
  
  // Loading
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  loadingCount: number;
  loadingQueue: string[];
  
  // Toasts
  toasts: Toast[];
  maxToasts: number;
  
  // Notifications
  notificationBadge: number;
  notificationOpen: boolean;
  
  // Search
  searchOpen: boolean;
  searchQuery: string;
  
  // Scroll
  scrollPosition: number;
  isScrolled: boolean;
  
  // Fullscreen
  isFullscreen: boolean;
  
  // Print
  isPrinting: boolean;
  
  // Breakpoints
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  windowWidth: number;
  windowHeight: number;
  
  // Actions - Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  
  // Actions - Language
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  
  // Actions - Modals
  openModal: (type: string, data?: any) => void;
  closeModal: (type?: string) => void;
  toggleModal: (type: string) => void;
  isModalOpen: (type: string) => boolean;
  getModalData: <T>(type: string) => T | null;
  getActiveModal: () => string | null;
  
  // Actions - Sidebar
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarWidth: (width: number) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  
  // Actions - Header
  setHeaderHeight: (height: number) => void;
  
  // Actions - Loading
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>;
  isAnyLoading: () => boolean;
  getLoadingKeys: () => string[];
  clearLoadingStates: () => void;
  
  // Actions - Toasts
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  getToastById: (id: string) => Toast | null;
  updateToast: (id: string, toast: Partial<Toast>) => void;
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => string;
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => string;
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => string;
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => string;
  
  // Actions - Notifications
  setNotificationBadge: (count: number) => void;
  incrementNotificationBadge: (increment?: number) => void;
  decrementNotificationBadge: (decrement?: number) => void;
  setNotificationOpen: (open: boolean) => void;
  toggleNotificationOpen: () => void;
  
  // Actions - Search
  setSearchOpen: (open: boolean) => void;
  toggleSearchOpen: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Actions - Scroll
  setScrollPosition: (position: number) => void;
  setScrolled: (scrolled: boolean) => void;
  
  // Actions - Fullscreen
  toggleFullscreen: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  
  // Actions - Print
  setPrinting: (printing: boolean) => void;
  
  // Actions - Breakpoints
  updateBreakpoints: (width: number, height: number) => void;
  
  // Actions - Utilities
  clearError: () => void;
  reset: () => void;
}

// ============ INITIAL STATE ============

const initialState: Omit<UIState, 
  | 'setTheme'
  | 'toggleTheme'
  | 'setDarkMode'
  | 'toggleDarkMode'
  | 'setLanguage'
  | 'toggleLanguage'
  | 'openModal'
  | 'closeModal'
  | 'toggleModal'
  | 'isModalOpen'
  | 'getModalData'
  | 'getActiveModal'
  | 'setSidebarOpen'
  | 'toggleSidebar'
  | 'setSidebarCollapsed'
  | 'toggleSidebarCollapsed'
  | 'setSidebarWidth'
  | 'setMobileMenuOpen'
  | 'toggleMobileMenu'
  | 'setHeaderHeight'
  | 'setGlobalLoading'
  | 'setLoading'
  | 'isLoading'
  | 'startLoading'
  | 'stopLoading'
  | 'withLoading'
  | 'isAnyLoading'
  | 'getLoadingKeys'
  | 'clearLoadingStates'
  | 'addToast'
  | 'removeToast'
  | 'clearToasts'
  | 'getToastById'
  | 'updateToast'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'setNotificationBadge'
  | 'incrementNotificationBadge'
  | 'decrementNotificationBadge'
  | 'setNotificationOpen'
  | 'toggleNotificationOpen'
  | 'setSearchOpen'
  | 'toggleSearchOpen'
  | 'setSearchQuery'
  | 'clearSearch'
  | 'setScrollPosition'
  | 'setScrolled'
  | 'toggleFullscreen'
  | 'setFullscreen'
  | 'setPrinting'
  | 'updateBreakpoints'
  | 'clearError'
  | 'reset'
> = {
  // Theme
  theme: 'system' as Theme,
  isDarkMode: false,
  
  // Language
  language: 'fr' as Language,
  
  // Modals
  modals: {},
  activeModal: null,
  
  // Sidebar
  sidebarOpen: false,
  sidebarCollapsed: false,
  sidebarWidth: 280,
  mobileMenuOpen: false,
  
  // Header
  headerHeight: 64,
  
  // Loading
  globalLoading: false,
  loadingStates: {},
  loadingCount: 0,
  loadingQueue: [],
  
  // Toasts
  toasts: [],
  maxToasts: 5,
  
  // Notifications
  notificationBadge: 0,
  notificationOpen: false,
  
  // Search
  searchOpen: false,
  searchQuery: '',
  
  // Scroll
  scrollPosition: 0,
  isScrolled: false,
  
  // Fullscreen
  isFullscreen: false,
  
  // Print
  isPrinting: false,
  
  // Breakpoints
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
  windowHeight: typeof window !== 'undefined' ? window.innerHeight : 768,
};

// ============ STORE ============

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============ THEME ============

      setTheme: (theme: Theme) => {
        const isDarkMode = 
          theme === 'dark' || 
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        set({ theme, isDarkMode });
        
        // Appliquer le thème au document
        if (typeof document !== 'undefined') {
          if (isDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', theme);
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const themes: Theme[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        get().setTheme(themes[nextIndex]);
      },

      setDarkMode: (isDark: boolean) => {
        get().setTheme(isDark ? 'dark' : 'light');
      },

      toggleDarkMode: () => {
        const { isDarkMode } = get();
        get().setDarkMode(!isDarkMode);
      },

      // ============ LANGUAGE ============

      setLanguage: (language: Language) => {
        set({ language });
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('language', language);
        }
      },

      toggleLanguage: () => {
        const { language } = get();
        set({ language: language === 'fr' ? 'en' : 'fr' });
      },

      // ============ MODALS ============

      openModal: (type: string, data?: any) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [type]: { isOpen: true, type, data },
          },
          activeModal: type,
        }));
      },

      closeModal: (type?: string) => {
        if (type) {
          set((state) => ({
            modals: {
              ...state.modals,
              [type]: { ...state.modals[type], isOpen: false },
            },
            activeModal: state.activeModal === type ? null : state.activeModal,
          }));
        } else {
          const newModals = { ...get().modals };
          Object.keys(newModals).forEach(key => {
            newModals[key] = { ...newModals[key], isOpen: false };
          });
          set({ modals: newModals, activeModal: null });
        }
      },

      toggleModal: (type: string) => {
        const isOpen = get().isModalOpen(type);
        if (isOpen) {
          get().closeModal(type);
        } else {
          get().openModal(type);
        }
      },

      isModalOpen: (type: string) => {
        return get().modals[type]?.isOpen || false;
      },

      getModalData: <T>(type: string): T | null => {
        return get().modals[type]?.data || null;
      },

      getActiveModal: () => {
        return get().activeModal;
      },

      // ============ SIDEBAR ============

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      toggleSidebarCollapsed: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarWidth: (width: number) => {
        set({ sidebarWidth: width });
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },

      toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      // ============ HEADER ============

      setHeaderHeight: (height: number) => {
        set({ headerHeight: height });
      },

      // ============ LOADING ============

      setGlobalLoading: (loading: boolean) => {
        set((state) => ({
          globalLoading: loading,
          loadingCount: loading ? state.loadingCount + 1 : Math.max(0, state.loadingCount - 1),
        }));
      },

      setLoading: (key: string, loading: boolean) => {
        set((state) => {
          const newLoadingStates = { ...state.loadingStates, [key]: loading };
          if (loading) {
            const queue = state.loadingQueue.includes(key) 
              ? state.loadingQueue 
              : [...state.loadingQueue, key];
            return { loadingStates: newLoadingStates, loadingQueue: queue };
          } else {
            const queue = state.loadingQueue.filter(k => k !== key);
            return { loadingStates: newLoadingStates, loadingQueue: queue };
          }
        });
      },

      isLoading: (key: string) => {
        return get().loadingStates[key] || false;
      },

      startLoading: (key: string) => {
        get().setLoading(key, true);
      },

      stopLoading: (key: string) => {
        get().setLoading(key, false);
      },

      withLoading: async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
        get().startLoading(key);
        try {
          const result = await fn();
          return result;
        } finally {
          get().stopLoading(key);
        }
      },

      isAnyLoading: () => {
        return get().loadingQueue.length > 0 || get().globalLoading;
      },

      getLoadingKeys: () => {
        return get().loadingQueue;
      },

      clearLoadingStates: () => {
        set({ loadingStates: {}, loadingQueue: [], loadingCount: 0 });
      },

      // ============ TOASTS ============

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = {
          ...toast,
          id,
          duration: toast.duration || 5000,
        };

        set((state) => {
          const toasts = [newToast, ...state.toasts];
          if (toasts.length > state.maxToasts) {
            toasts.pop();
          }
          return { toasts };
        });

        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }

        return id;
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      getToastById: (id: string) => {
        return get().toasts.find(t => t.id === id) || null;
      },

      updateToast: (id: string, toast: Partial<Toast>) => {
        set((state) => ({
          toasts: state.toasts.map((t) =>
            t.id === id ? { ...t, ...toast } : t
          ),
        }));
      },

      success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
        return get().addToast({ type: 'success', message, ...options });
      },

      error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
        return get().addToast({ type: 'error', message, ...options });
      },

      warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
        return get().addToast({ type: 'warning', message, ...options });
      },

      info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
        return get().addToast({ type: 'info', message, ...options });
      },

      // ============ NOTIFICATIONS ============

      setNotificationBadge: (count: number) => {
        set({ notificationBadge: Math.max(0, count) });
      },

      incrementNotificationBadge: (increment: number = 1) => {
        set((state) => ({
          notificationBadge: state.notificationBadge + increment,
        }));
      },

      decrementNotificationBadge: (decrement: number = 1) => {
        set((state) => ({
          notificationBadge: Math.max(0, state.notificationBadge - decrement),
        }));
      },

      setNotificationOpen: (open: boolean) => {
        set({ notificationOpen: open });
      },

      toggleNotificationOpen: () => {
        set((state) => ({ notificationOpen: !state.notificationOpen }));
      },

      // ============ SEARCH ============

      setSearchOpen: (open: boolean) => {
        set({ searchOpen: open });
      },

      toggleSearchOpen: () => {
        set((state) => ({ searchOpen: !state.searchOpen }));
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      clearSearch: () => {
        set({ searchQuery: '' });
      },

      // ============ SCROLL ============

      setScrollPosition: (position: number) => {
        set({ scrollPosition: position });
      },

      setScrolled: (scrolled: boolean) => {
        set({ isScrolled: scrolled });
      },

      // ============ FULLSCREEN ============

      toggleFullscreen: () => {
        const { isFullscreen } = get();
        if (!isFullscreen) {
          document.documentElement.requestFullscreen?.();
          set({ isFullscreen: true });
        } else {
          document.exitFullscreen?.();
          set({ isFullscreen: false });
        }
      },

      setFullscreen: (fullscreen: boolean) => {
        if (fullscreen && !get().isFullscreen) {
          document.documentElement.requestFullscreen?.();
          set({ isFullscreen: true });
        } else if (!fullscreen && get().isFullscreen) {
          document.exitFullscreen?.();
          set({ isFullscreen: false });
        }
      },

      // ============ PRINT ============

      setPrinting: (printing: boolean) => {
        set({ isPrinting: printing });
      },

      // ============ BREAKPOINTS ============

      updateBreakpoints: (width: number, height: number) => {
        set({
          windowWidth: width,
          windowHeight: height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
        });
      },

      // ============ UTILITIES ============

      clearError: () => {
        // Pas d'erreur dans ce store
      },

      reset: () => {
        set({
          ...initialState,
          theme: get().theme,
          language: get().language,
          sidebarCollapsed: get().sidebarCollapsed,
          sidebarWidth: get().sidebarWidth,
        });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        notificationBadge: state.notificationBadge,
      }),
    }
  )
);

// ============ HOOKS PERSONNALISÉS ============

/**
 * Hook pour le thème
 */
export const useTheme = () => {
  const store = useUIStore();
  
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme || 'system';
      store.setTheme(savedTheme);
    }
  }, []);
  
  return {
    theme: store.theme,
    isDarkMode: store.isDarkMode,
    setTheme: store.setTheme,
    toggleTheme: store.toggleTheme,
    setDarkMode: store.setDarkMode,
    toggleDarkMode: store.toggleDarkMode,
  };
};

/**
 * Hook pour les modals
 */
export const useModal = (type: string) => {
  const store = useUIStore();
  
  return {
    isOpen: store.isModalOpen(type),
    data: store.getModalData(type),
    open: (data?: any) => store.openModal(type, data),
    close: () => store.closeModal(type),
    toggle: () => store.toggleModal(type),
  };
};

/**
 * Hook pour les toasts
 */
export const useToast = () => {
  const store = useUIStore();
  
  return {
    toasts: store.toasts,
    addToast: store.addToast,
    removeToast: store.removeToast,
    clearToasts: store.clearToasts,
    getToastById: store.getToastById,
    updateToast: store.updateToast,
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,
  };
};

/**
 * Hook pour le chargement
 */
export const useLoading = (key?: string) => {
  const store = useUIStore();
  
  if (key) {
    return {
      loading: store.isLoading(key),
      start: () => store.startLoading(key),
      stop: () => store.stopLoading(key),
      withLoading: <T>(fn: () => Promise<T>) => store.withLoading(key, fn),
    };
  }
  
  return {
    globalLoading: store.globalLoading,
    loadingCount: store.loadingCount,
    loadingQueue: store.loadingQueue,
    isAnyLoading: store.isAnyLoading,
    getLoadingKeys: store.getLoadingKeys,
    setGlobalLoading: store.setGlobalLoading,
    clearLoadingStates: store.clearLoadingStates,
  };
};

/**
 * Hook pour le sidebar
 */
export const useSidebar = () => {
  const store = useUIStore();
  
  return {
    isOpen: store.sidebarOpen,
    isCollapsed: store.sidebarCollapsed,
    width: store.sidebarWidth,
    open: () => store.setSidebarOpen(true),
    close: () => store.setSidebarOpen(false),
    toggle: store.toggleSidebar,
    setCollapsed: store.setSidebarCollapsed,
    toggleCollapsed: store.toggleSidebarCollapsed,
    setWidth: store.setSidebarWidth,
  };
};

/**
 * Hook pour le header
 */
export const useHeader = () => {
  const store = useUIStore();
  
  return {
    height: store.headerHeight,
    setHeight: store.setHeaderHeight,
  };
};

/**
 * Hook pour le mobile
 */
export const useMobileMenu = () => {
  const store = useUIStore();
  
  return {
    isOpen: store.mobileMenuOpen,
    open: () => store.setMobileMenuOpen(true),
    close: () => store.setMobileMenuOpen(false),
    toggle: store.toggleMobileMenu,
  };
};

/**
 * Hook pour les breakpoints
 */
export const useBreakpoints = () => {
  const store = useUIStore();
  
  React.useEffect(() => {
    const handleResize = () => {
      store.updateBreakpoints(window.innerWidth, window.innerHeight);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile: store.isMobile,
    isTablet: store.isTablet,
    isDesktop: store.isDesktop,
    width: store.windowWidth,
    height: store.windowHeight,
  };
};

/**
 * Hook pour la recherche
 */
export const useSearch = () => {
  const store = useUIStore();
  
  return {
    isOpen: store.searchOpen,
    query: store.searchQuery,
    open: () => store.setSearchOpen(true),
    close: () => store.setSearchOpen(false),
    toggle: store.toggleSearchOpen,
    setQuery: store.setSearchQuery,
    clear: store.clearSearch,
  };
};

/**
 * Hook pour les notifications
 */
export const useNotifications = () => {
  const store = useUIStore();
  
  return {
    badge: store.notificationBadge,
    isOpen: store.notificationOpen,
    setBadge: store.setNotificationBadge,
    incrementBadge: store.incrementNotificationBadge,
    decrementBadge: store.decrementNotificationBadge,
    open: () => store.setNotificationOpen(true),
    close: () => store.setNotificationOpen(false),
    toggle: store.toggleNotificationOpen,
  };
};

/**
 * Hook pour le scroll
 */
export const useScroll = () => {
  const store = useUIStore();
  
  React.useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const scrolled = position > 50;
      store.setScrollPosition(position);
      store.setScrolled(scrolled);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return {
    position: store.scrollPosition,
    isScrolled: store.isScrolled,
  };
};

/**
 * Hook pour le plein écran
 */
export const useFullscreen = () => {
  const store = useUIStore();
  
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      store.setFullscreen(isFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return {
    isFullscreen: store.isFullscreen,
    toggle: store.toggleFullscreen,
    set: store.setFullscreen,
  };
};

/**
 * Hook pour l'impression
 */
export const usePrint = () => {
  const store = useUIStore();
  
  const print = () => {
    store.setPrinting(true);
    window.print();
    setTimeout(() => {
      store.setPrinting(false);
    }, 1000);
  };
  
  return {
    isPrinting: store.isPrinting,
    print,
  };
};

// ============ INITIALISATION ============

if (typeof window !== 'undefined') {
  // Theme
  const savedTheme = localStorage.getItem('theme') as Theme || 'system';
  useUIStore.getState().setTheme(savedTheme);
  
  // Breakpoints
  useUIStore.getState().updateBreakpoints(
    window.innerWidth,
    window.innerHeight
  );
  
  // Fullscreen
  if (document.fullscreenElement) {
    useUIStore.getState().setFullscreen(true);
  }
  
  // Event listeners
  window.addEventListener('resize', () => {
    useUIStore.getState().updateBreakpoints(
      window.innerWidth,
      window.innerHeight
    );
  });
  
  document.addEventListener('fullscreenchange', () => {
    useUIStore.getState().setFullscreen(!!document.fullscreenElement);
  });
  
  window.addEventListener('beforeprint', () => {
    useUIStore.getState().setPrinting(true);
  });
  
  window.addEventListener('afterprint', () => {
    useUIStore.getState().setPrinting(false);
  });
}

// ============ EXPORT ============

export default useUIStore;