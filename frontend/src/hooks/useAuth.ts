import { useAuthStore } from '@/store/authStore';

/**
 * Hook pour l'authentification
 * Utilise le store authStore
 * 
 * @returns {Object} État et actions d'authentification
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * // Connexion
 * await login('email@example.com', 'password');
 * 
 * // Déconnexion
 * await logout();
 */
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // ============ ÉTAT ============
    /** Utilisateur connecté */
    user: store.user,
    /** ID de l'utilisateur */
    userId: store.userId,
    /** Rôle de l'utilisateur */
    userRole: store.userRole,
    /** Est authentifié */
    isAuthenticated: store.isAuthenticated,
    /** Est vérifié */
    isVerified: store.isVerified,
    /** Email vérifié */
    isEmailVerified: store.isEmailVerified,
    /** Téléphone vérifié */
    isPhoneVerified: store.isPhoneVerified,
    /** En cours de chargement */
    loading: store.loading,
    /** Erreur */
    error: store.error,
    /** Statut */
    status: store.status,
    /** Token JWT */
    token: store.token,
    /** Token de rafraîchissement */
    refreshToken: store.refreshToken,
    /** Date d'expiration du token */
    tokenExpiry: store.tokenExpiry,
    /** Dernière connexion */
    lastLogin: store.lastLogin,
    /** Nombre de connexions */
    loginCount: store.loginCount,
    
    // ============ PRÉFÉRENCES ============
    /** Préférences utilisateur */
    preferences: store.preferences,
    /** Charger les préférences */
    loadPreferences: store.loadPreferences,
    /** Mettre à jour les préférences */
    updatePreferences: store.updatePreferences,
    
    // ============ ADRESSES ============
    /** Liste des adresses */
    addresses: store.addresses,
    /** Charger les adresses */
    loadAddresses: store.loadAddresses,
    /** Créer une adresse */
    createAddress: store.createAddress,
    /** Mettre à jour une adresse */
    updateAddress: store.updateAddress,
    /** Supprimer une adresse */
    deleteAddress: store.deleteAddress,
    /** Définir une adresse par défaut */
    setDefaultAddress: store.setDefaultAddress,
    
    // ============ STATISTIQUES ============
    /** Statistiques utilisateur */
    stats: store.stats,
    /** Charger les statistiques */
    loadStats: store.loadStats,
    /** Charger les activités */
    loadActivities: store.loadActivities,
    /** Liste des activités */
    activities: store.activities,
    
    // ============ ACTIONS PRINCIPALES ============
    /** Se connecter */
    login: store.login,
    /** S'inscrire */
    register: store.register,
    /** Se déconnecter */
    logout: store.logout,
    /** Rafraîchir le token */
    refreshTokenAction: store.refreshTokenAction,
    /** Récupérer l'utilisateur courant */
    getCurrentUser: store.getCurrentUser,
    /** Vérifier l'authentification */
    checkAuth: store.checkAuth,
    
    // ============ GESTION DU PROFIL ============
    /** Mettre à jour le profil */
    updateProfile: store.updateProfile,
    /** Changer le mot de passe */
    changePassword: store.changePassword,
    /** Demander une réinitialisation du mot de passe */
    requestPasswordReset: store.requestPasswordReset,
    /** Confirmer la réinitialisation du mot de passe */
    confirmPasswordReset: store.confirmPasswordReset,
    /** Vérifier l'email */
    verifyEmail: store.verifyEmail,
    /** Renvoyer l'email de vérification */
    resendVerificationEmail: store.resendVerificationEmail,
    
    // ============ AGENT DE LIVRAISON ============
    /** Mettre à jour le statut de l'agent */
    updateAgentStatus: store.updateAgentStatus,
    /** Mettre à jour la position de l'agent */
    updateAgentLocation: store.updateAgentLocation,
    /** Récupérer les statistiques de l'agent */
    getAgentStats: store.getAgentStats,
    
    // ============ CONSEILLER ============
    /** Mettre à jour le statut du conseiller */
    updateAdvisorStatus: store.updateAdvisorStatus,
    /** Récupérer les statistiques du conseiller */
    getAdvisorStats: store.getAdvisorStats,
    
    // ============ UTILITAIRES ============
    /** Vérifier si l'utilisateur a un rôle */
    hasRole: store.hasRole,
    /** Est administrateur */
    isAdmin: store.isAdmin,
    /** Est client */
    isClient: store.isClient,
    /** Est livreur */
    isDelivery: store.isDelivery,
    /** Est conseiller */
    isAdvisor: store.isAdvisor,
    /** Récupérer le nom complet */
    getFullName: store.getFullName,
    /** Récupérer les initiales */
    getInitials: store.getInitials,
    /** Récupérer le nom d'affichage */
    getDisplayName: store.getDisplayName,
    /** Récupérer l'avatar */
    getAvatar: store.getAvatar,
    /** Récupérer le token */
    getToken: store.getToken,
    /** Récupérer le refresh token */
    getRefreshToken: store.getRefreshToken,
    /** Vérifier si le token est valide */
    isTokenValid: store.isTokenValid,
    /** Définir la session */
    setSession: store.setSession,
    /** Effacer la session */
    clearSession: store.clearSession,
    /** Effacer l'erreur */
    clearError: store.clearError,
    /** Réinitialiser le store */
    reset: store.reset,
  };
};