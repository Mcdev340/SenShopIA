import { useUIStore } from '@/store/uiStore';

/**
 * Hook pour l'interface utilisateur
 * Utilise le store uiStore
 * 
 * @returns {Object} État et actions UI
 * 
 * @example
 * const { theme, toggleTheme, isDarkMode } = useUI();
 * 
 * // Basculer le thème
 * toggleTheme();
 */
export const useUI = () => {
  const store = useUIStore();
  
  return {
    // ============ THÈME ============
    /** Thème actuel */
    theme: store.theme,
    /** Est en mode sombre */
    isDarkMode: store.isDarkMode,
    /** Définir le thème */
    setTheme: store.setTheme,
    /** Basculer le thème */
    toggleTheme: store.toggleTheme,
    /** Définir le mode sombre */
    setDarkMode: store.setDarkMode,
    /** Basculer le mode sombre */
    toggleDarkMode: store.toggleDarkMode,
    
    // ============ LANGUE ============
    /** Langue actuelle */
    language: store.language,
    /** Définir la langue */
    setLanguage: store.setLanguage,
    /** Basculer la langue */
    toggleLanguage: store.toggleLanguage,
    
    // ============ MODALS ============
    /** État des modales */
    modals: store.modals,
    /** Modale active */
    activeModal: store.activeModal,
    /** Ouvrir une modale */
    openModal: store.openModal,
    /** Fermer une modale */
    closeModal: store.closeModal,
    /** Basculer une modale */
    toggleModal: store.toggleModal,
    /** Vérifier si une modale est ouverte */
    isModalOpen: store.isModalOpen,
    /** Récupérer les données d'une modale */
    getModalData: store.getModalData,
    /** Récupérer la modale active */
    getActiveModal: store.getActiveModal,
    
    // ============ SIDEBAR ============
    /** Sidebar ouvert */
    sidebarOpen: store.sidebarOpen,
    /** Sidebar réduit */
    sidebarCollapsed: store.sidebarCollapsed,
    /** Largeur du sidebar */
    sidebarWidth: store.sidebarWidth,
    /** Ouvrir le sidebar */
    setSidebarOpen: store.setSidebarOpen,
    /** Basculer le sidebar */
    toggleSidebar: store.toggleSidebar,
    /** Réduire le sidebar */
    setSidebarCollapsed: store.setSidebarCollapsed,
    /** Basculer la réduction du sidebar */
    toggleSidebarCollapsed: store.toggleSidebarCollapsed,
    /** Définir la largeur du sidebar */
    setSidebarWidth: store.setSidebarWidth,
    
    // ============ MOBILE ============
    /** Menu mobile ouvert */
    mobileMenuOpen: store.mobileMenuOpen,
    /** Ouvrir le menu mobile */
    setMobileMenuOpen: store.setMobileMenuOpen,
    /** Basculer le menu mobile */
    toggleMobileMenu: store.toggleMobileMenu,
    
    // ============ HEADER ============
    /** Hauteur du header */
    headerHeight: store.headerHeight,
    /** Définir la hauteur du header */
    setHeaderHeight: store.setHeaderHeight,
    
    // ============ CHARGEMENT ============
    /** Chargement global */
    globalLoading: store.globalLoading,
    /** Nombre de chargements */
    loadingCount: store.loadingCount,
    /** File d'attente des chargements */
    loadingQueue: store.loadingQueue,
    /** Définir le chargement global */
    setGlobalLoading: store.setGlobalLoading,
    /** Définir un chargement */
    setLoading: store.setLoading,
    /** Vérifier si un chargement est en cours */
    isLoading: store.isLoading,
    /** Démarrer un chargement */
    startLoading: store.startLoading,
    /** Arrêter un chargement */
    stopLoading: store.stopLoading,
    /** Exécuter avec chargement */
    withLoading: store.withLoading,
    /** Vérifier si un chargement est en cours */
    isAnyLoading: store.isAnyLoading,
    /** Récupérer les clés de chargement */
    getLoadingKeys: store.getLoadingKeys,
    /** Effacer les états de chargement */
    clearLoadingStates: store.clearLoadingStates,
    
    // ============ TOASTS ============
    /** Liste des toasts */
    toasts: store.toasts,
    /** Ajouter un toast */
    addToast: store.addToast,
    /** Supprimer un toast */
    removeToast: store.removeToast,
    /** Effacer les toasts */
    clearToasts: store.clearToasts,
    /** Récupérer un toast par ID */
    getToastById: store.getToastById,
    /** Mettre à jour un toast */
    updateToast: store.updateToast,
    /** Toast de succès */
    success: store.success,
    /** Toast d'erreur */
    error: store.error,
    /** Toast d'avertissement */
    warning: store.warning,
    /** Toast d'information */
    info: store.info,
    
    // ============ NOTIFICATIONS ============
    /** Badge de notification */
    notificationBadge: store.notificationBadge,
    /** Notifications ouvertes */
    notificationOpen: store.notificationOpen,
    /** Définir le badge */
    setNotificationBadge: store.setNotificationBadge,
    /** Incrémenter le badge */
    incrementNotificationBadge: store.incrementNotificationBadge,
    /** Décrémenter le badge */
    decrementNotificationBadge: store.decrementNotificationBadge,
    /** Ouvrir les notifications */
    setNotificationOpen: store.setNotificationOpen,
    /** Basculer les notifications */
    toggleNotificationOpen: store.toggleNotificationOpen,
    
    // ============ RECHERCHE ============
    /** Recherche ouverte */
    searchOpen: store.searchOpen,
    /** Requête de recherche */
    searchQuery: store.searchQuery,
    /** Ouvrir la recherche */
    setSearchOpen: store.setSearchOpen,
    /** Basculer la recherche */
    toggleSearchOpen: store.toggleSearchOpen,
    /** Définir la requête */
    setSearchQuery: store.setSearchQuery,
    /** Effacer la recherche */
    clearSearch: store.clearSearch,
    
    // ============ SCROLL ============
    /** Position de défilement */
    scrollPosition: store.scrollPosition,
    /** Est défilé */
    isScrolled: store.isScrolled,
    /** Définir la position */
    setScrollPosition: store.setScrollPosition,
    /** Définir l'état de défilement */
    setScrolled: store.setScrolled,
    
    // ============ PLEIN ÉCRAN ============
    /** Est en plein écran */
    isFullscreen: store.isFullscreen,
    /** Basculer le plein écran */
    toggleFullscreen: store.toggleFullscreen,
    /** Définir le plein écran */
    setFullscreen: store.setFullscreen,
    
    // ============ IMPRESSION ============
    /** Est en cours d'impression */
    isPrinting: store.isPrinting,
    /** Définir l'état d'impression */
    setPrinting: store.setPrinting,
    
    // ============ BREAKPOINTS ============
    /** Est mobile */
    isMobile: store.isMobile,
    /** Est tablette */
    isTablet: store.isTablet,
    /** Est desktop */
    isDesktop: store.isDesktop,
    /** Largeur de la fenêtre */
    windowWidth: store.windowWidth,
    /** Hauteur de la fenêtre */
    windowHeight: store.windowHeight,
    /** Mettre à jour les breakpoints */
    updateBreakpoints: store.updateBreakpoints,
    
    // ============ UTILITAIRES ============
    /** Effacer l'erreur */
    clearError: store.clearError,
    /** Réinitialiser le store */
    reset: store.reset,
  };
};