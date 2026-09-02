import { useOrderStore } from '@/store/orderStore';

/**
 * Hook pour les commandes
 * Utilise le store orderStore
 * 
 * @returns {Object} État et actions des commandes
 * 
 * @example
 * const { orders, createOrder, loading } = useOrders();
 * 
 * // Créer une commande
 * await createOrder({
 *   items: [{ productId: '123', quantity: 2 }],
 *   shippingAddress: { ... }
 * });
 */
export const useOrders = () => {
  const store = useOrderStore();
  
  return {
    // ============ ÉTAT ============
    /** Liste des commandes */
    orders: store.orders,
    /** Commande sélectionnée */
    selectedOrder: store.selectedOrder,
    /** ID de la commande sélectionnée */
    selectedOrderId: store.selectedOrderId,
    /** Articles de la commande */
    orderItems: store.orderItems,
    /** Historique de la commande */
    orderHistory: store.orderHistory,
    /** Facture de la commande */
    orderInvoice: store.orderInvoice,
    /** Retour de la commande */
    orderReturn: store.orderReturn,
    /** Remboursements de la commande */
    orderRefunds: store.orderRefunds,
    /** Expédition de la commande */
    orderShipment: store.orderShipment,
    /** En cours de chargement */
    loading: store.loading,
    /** Erreur */
    error: store.error,
    /** Statut */
    status: store.status,
    
    // ============ STATISTIQUES ============
    /** Statistiques des commandes */
    stats: store.stats,
    /** Résumé des commandes */
    summary: store.summary,
    
    // ============ PAGINATION ============
    /** Total des commandes */
    total: store.total,
    /** Page actuelle */
    page: store.page,
    /** Limite par page */
    limit: store.limit,
    /** Nombre total de pages */
    totalPages: store.totalPages,
    /** Filtres actuels */
    filters: store.filters,
    
    // ============ ACTIONS PRINCIPALES ============
    /** Charger les commandes */
    loadOrders: store.loadOrders,
    /** Charger les statistiques */
    loadOrderStats: store.loadOrderStats,
    /** Charger le résumé */
    loadOrderSummary: store.loadOrderSummary,
    /** Rafraîchir */
    refresh: store.refresh,
    
    // ============ RÉCUPÉRATION ============
    /** Récupérer une commande */
    getOrder: store.getOrder,
    /** Récupérer une commande par référence */
    getOrderByReference: store.getOrderByReference,
    /** Récupérer le statut d'une commande */
    getOrderStatus: store.getOrderStatus,
    /** Récupérer les articles d'une commande */
    getOrderItems: store.getOrderItems,
    /** Récupérer l'historique d'une commande */
    getOrderHistory: store.getOrderHistory,
    /** Récupérer la facture d'une commande */
    getOrderInvoice: store.getOrderInvoice,
    /** Télécharger la facture */
    downloadInvoice: store.downloadInvoice,
    
    // ============ CRÉATION ET MODIFICATION ============
    /** Créer une commande */
    createOrder: store.createOrder,
    /** Annuler une commande */
    cancelOrder: store.cancelOrder,
    /** Mettre à jour le statut d'une commande */
    updateOrderStatus: store.updateOrderStatus,
    
    // ============ RETOURS ============
    /** Créer un retour */
    createReturn: store.createReturn,
    /** Récupérer un retour */
    getReturn: store.getReturn,
    /** Annuler un retour */
    cancelReturn: store.cancelReturn,
    
    // ============ REMBOURSEMENTS ============
    /** Récupérer les remboursements */
    getRefunds: store.getRefunds,
    
    // ============ EXPÉDITIONS ============
    /** Récupérer l'expédition */
    getShipment: store.getShipment,
    /** Récupérer les informations de suivi */
    getTrackingInfo: store.getTrackingInfo,
    
    // ============ FILTRES ET PAGINATION ============
    /** Définir les filtres */
    setFilters: store.setFilters,
    /** Réinitialiser les filtres */
    resetFilters: store.resetFilters,
    /** Aller à une page */
    goToPage: store.goToPage,
    /** Page suivante */
    nextPage: store.nextPage,
    /** Page précédente */
    previousPage: store.previousPage,
    
    // ============ UTILITAIRES ============
    /** Récupérer les commandes par statut */
    getOrdersByStatus: store.getOrdersByStatus,
    /** Récupérer les commandes par date */
    getOrdersByDateRange: store.getOrdersByDateRange,
    /** Récupérer le total dépensé */
    getTotalSpent: store.getTotalSpent,
    /** Récupérer le nombre de commandes en attente */
    getPendingCount: store.getPendingCount,
    /** Vérifier si des commandes existent */
    hasOrders: store.hasOrders,
    
    // ============ SÉLECTION ============
    /** Sélectionner une commande */
    selectOrder: store.selectOrder,
    /** Sélectionner une commande par ID */
    selectOrderById: store.selectOrderById,
    /** Effacer la sélection */
    clearSelected: store.clearSelected,
    /** Effacer les articles de la commande */
    clearOrderItems: store.clearOrderItems,
    
    // ============ CACHE ============
    /** Vider le cache */
    clearCache: store.clearCache,
    
    /** Effacer l'erreur */
    clearError: store.clearError,
    /** Réinitialiser le store */
    reset: store.reset,
  };
};