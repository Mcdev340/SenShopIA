import { useCartStore } from '@/store/cartStore';

/**
 * Hook pour le panier
 * Utilise le store cartStore
 * 
 * @returns {Object} État et actions du panier
 * 
 * @example
 * const { items, addItem, removeItem, itemCount } = useCart();
 * 
 * // Ajouter un produit
 * await addItem('product-id', 'variant-id', 2);
 * 
 * // Supprimer un produit
 * await removeItem('item-id');
 */
export const useCart = () => {
  const store = useCartStore();
  
  return {
    // ============ ÉTAT ============
    /** Panier complet */
    cart: store.cart,
    /** Liste des articles */
    items: store.items,
    /** Articles sauvegardés */
    savedItems: store.savedItems,
    /** Nombre d'articles */
    itemCount: store.itemCount,
    /** Sous-total */
    subtotal: store.subtotal,
    /** Total */
    total: store.total,
    /** Frais de livraison */
    shippingCost: store.shippingCost,
    /** Taxes */
    tax: store.tax,
    /** Réduction */
    discount: store.discount,
    /** Réduction coupon */
    couponDiscount: store.couponDiscount,
    /** Code coupon */
    couponCode: store.couponCode,
    /** En cours de chargement */
    loading: store.loading,
    /** Erreur */
    error: store.error,
    /** Statut */
    status: store.status,
    /** Est valide */
    isValid: store.isValid,
    /** Est ouvert */
    isOpen: store.isOpen,
    /** ID du panier invité */
    guestCartId: store.guestCartId,
    
    // ============ COUPONS ============
    /** Coupon actuel */
    coupon: store.coupon,
    /** Coupons disponibles */
    availableCoupons: store.availableCoupons,
    /** Appliquer un coupon */
    applyCoupon: store.applyCoupon,
    /** Supprimer le coupon */
    removeCoupon: store.removeCoupon,
    /** Récupérer les coupons disponibles */
    getAvailableCoupons: store.getAvailableCoupons,
    
    // ============ LIVRAISON ============
    /** Estimations de livraison */
    shippingEstimates: store.shippingEstimates,
    /** Méthode de livraison sélectionnée */
    selectedShippingMethod: store.selectedShippingMethod,
    /** Estimer la livraison */
    estimateShipping: store.estimateShipping,
    /** Sélectionner une méthode de livraison */
    selectShippingMethod: store.selectShippingMethod,
    /** Récupérer les options de livraison */
    getShippingOptions: store.getShippingOptions,
    
    // ============ SÉLECTION ============
    /** Articles sélectionnés */
    selectedItems: store.selectedItems,
    /** Tout sélectionner */
    selectAll: store.selectAll,
    /** Sélectionner un article */
    selectItem: store.selectItem,
    /** Sélectionner plusieurs articles */
    selectItems: store.selectItems,
    /** Sélectionner tous les articles */
    selectAllItems: store.selectAllItems,
    /** Inverser la sélection */
    toggleSelectAll: store.toggleSelectAll,
    
    // ============ ACTIONS PRINCIPALES ============
    /** Charger le panier */
    loadCart: store.loadCart,
    /** Charger le résumé du panier */
    loadCartSummary: store.loadCartSummary,
    /** Rafraîchir le panier */
    refresh: store.refresh,
    /** Valider le panier */
    validateCart: store.validateCart,
    
    /** Ajouter un article */
    addItem: store.addItem,
    /** Ajouter plusieurs articles */
    addItems: store.addItems,
    /** Mettre à jour un article */
    updateItem: store.updateItem,
    /** Supprimer un article */
    removeItem: store.removeItem,
    /** Supprimer plusieurs articles */
    removeItems: store.removeItems,
    /** Vider le panier */
    clearCart: store.clearCart,
    
    /** Sauvegarder pour plus tard */
    saveForLater: store.saveForLater,
    /** Déplacer vers le panier */
    moveToCart: store.moveToCart,
    /** Récupérer les articles sauvegardés */
    getSavedItems: store.getSavedItems,
    
    // ============ FUSION ============
    /** Fusionner les paniers */
    mergeCarts: store.mergeCarts,
    
    // ============ GUEST ============
    /** Récupérer l'ID du panier invité */
    getGuestCartId: store.getGuestCartId,
    /** Synchroniser le panier */
    syncCart: store.syncCart,
    /** Sauvegarder le panier */
    saveCart: store.saveCart,
    /** Charger le panier sauvegardé */
    loadSavedCart: store.loadSavedCart,
    
    // ============ UI ============
    /** Ouvrir le panier */
    openCart: store.openCart,
    /** Fermer le panier */
    closeCart: store.closeCart,
    /** Basculer le panier */
    toggleCart: store.toggleCart,
    
    // ============ WISHLIST ============
    /** Récupérer la wishlist */
    getWishlist: store.getWishlist,
    /** Ajouter à la wishlist */
    addToWishlist: store.addToWishlist,
    /** Supprimer de la wishlist */
    removeFromWishlist: store.removeFromWishlist,
    /** Vérifier si dans la wishlist */
    isInWishlist: store.isInWishlist,
    
    // ============ UTILITAIRES ============
    /** Récupérer un article par son ID */
    getItemById: store.getItemById,
    /** Récupérer un article par ID produit */
    getItemByProductId: store.getItemByProductId,
    /** Vérifier si un produit est dans le panier */
    hasItem: store.hasItem,
    /** Vérifier si le panier est vide */
    isEmpty: store.isEmpty,
    /** Récupérer le nombre d'articles */
    getItemCount: store.getItemCount,
    /** Récupérer le sous-total */
    getSubtotal: store.getSubtotal,
    /** Récupérer le total */
    getTotal: store.getTotal,
    /** Effacer l'erreur */
    clearError: store.clearError,
    /** Réinitialiser le store */
    reset: store.reset,
  };
};