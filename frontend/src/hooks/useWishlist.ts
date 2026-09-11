import { useCartStore } from '@/store/cartStore';

/**
 * Hook pour la wishlist
 *
 * Les actions de wishlist sont en réalité portées par le cartStore
 * (voir useCart.ts : addToWishlist, removeFromWishlist, isInWishlist, getWishlist).
 * Ce hook les regroupe pour exposer une API dédiée et plus lisible côté composants.
 *
 * @returns {Object} État et actions de la wishlist
 *
 * @example
 * const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
 *
 * await addToWishlist(productId);
 * const inWishlist = await isInWishlist(productId);
 */
export const useWishlist = () => {
  const store = useCartStore();

  return {
    // ============ ÉTAT ============
    /**
     * Liste de la wishlist, si le store l'expose sous ce nom.
     * ⚠️ À vérifier dans cartStore.ts : si le champ s'appelle autrement
     * (ex. wishlistItems, wishlistIds), adapte cette ligne en conséquence.
     * Si le store ne garde aucun état de wishlist en mémoire, retire cette
     * ligne et appelle getWishlist() depuis le composant à la place.
     */
    wishlist: (store as any).wishlist ?? [],
    /** En cours de chargement */
    loading: store.loading,
    /** Erreur */
    error: store.error,

    // ============ ACTIONS ============
    /** Récupérer la wishlist */
    getWishlist: store.getWishlist,
    /** Ajouter un produit à la wishlist */
    addToWishlist: store.addToWishlist,
    /** Retirer un produit de la wishlist */
    removeFromWishlist: store.removeFromWishlist,
    /** Vérifier si un produit est dans la wishlist */
    isInWishlist: store.isInWishlist,
    /** Effacer l'erreur */
    clearError: store.clearError,
  };
};