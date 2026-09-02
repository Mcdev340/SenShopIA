import { useProductStore } from '@/store/productStore';

/**
 * Hook pour les produits
 * Utilise le store productStore
 * 
 * @returns {Object} État et actions des produits
 * 
 * @example
 * const { products, loadProducts, loading } = useProducts();
 * 
 * // Charger les produits avec filtres
 * await loadProducts({ category: 'electronics', sortBy: 'price_asc' });
 */
export const useProducts = () => {
  const store = useProductStore();
  
  return {
    // ============ ÉTAT ============
    /** Liste des produits */
    products: store.products,
    /** Produits en vedette */
    featuredProducts: store.featuredProducts,
    /** Produits populaires */
    popularProducts: store.popularProducts,
    /** Nouveaux produits */
    newProducts: store.newProducts,
    /** Produits en promotion */
    onSaleProducts: store.onSaleProducts,
    /** Catégories */
    categories: store.categories,
    /** Arborescence des catégories */
    categoryTree: store.categoryTree,
    /** Tags */
    tags: store.tags,
    /** Produit sélectionné */
    selectedProduct: store.selectedProduct,
    /** ID du produit sélectionné */
    selectedProductId: store.selectedProductId,
    /** Catégorie sélectionnée */
    selectedCategory: store.selectedCategory,
    /** ID de la catégorie sélectionnée */
    selectedCategoryId: store.selectedCategoryId,
    /** Avis du produit */
    reviews: store.reviews,
    /** Statistiques des avis */
    reviewStats: store.reviewStats,
    /** En cours de chargement */
    loading: store.loading,
    /** Erreur */
    error: store.error,
    /** Statut */
    status: store.status,
    
    // ============ PAGINATION ============
    /** Total des produits */
    total: store.total,
    /** Page actuelle */
    page: store.page,
    /** Limite par page */
    limit: store.limit,
    /** Nombre total de pages */
    totalPages: store.totalPages,
    /** Filtres actuels */
    filters: store.filters,
    
    // ============ COMPARAISON ============
    /** Produits comparés */
    compareProducts: store.compareProducts,
    /** Résultat de la comparaison */
    comparison: store.comparison,
    
    // ============ PRODUITS EXTERNES ============
    /** Demande de produit externe */
    externalProductRequest: store.externalProductRequest,
    /** Liste des demandes */
    externalProductRequests: store.externalProductRequests,
    
    // ============ VARIANTS ============
    /** Variantes du produit */
    variants: store.variants,
    /** Variante sélectionnée */
    selectedVariant: store.selectedVariant,
    
    // ============ ACTIONS PRINCIPALES ============
    /** Charger les produits */
    loadProducts: store.loadProducts,
    /** Charger les produits en vedette */
    loadFeaturedProducts: store.loadFeaturedProducts,
    /** Charger les produits populaires */
    loadPopularProducts: store.loadPopularProducts,
    /** Charger les nouveaux produits */
    loadNewProducts: store.loadNewProducts,
    /** Charger les produits en promotion */
    loadOnSaleProducts: store.loadOnSaleProducts,
    /** Charger les catégories */
    loadCategories: store.loadCategories,
    /** Charger l'arborescence des catégories */
    loadCategoryTree: store.loadCategoryTree,
    /** Charger les tags */
    loadTags: store.loadTags,
    /** Rafraîchir les données */
    refresh: store.refresh,
    
    // ============ RECHERCHE ============
    /** Rechercher des produits */
    searchProducts: store.searchProducts,
    /** Charger les produits par catégorie */
    getProductsByCategory: store.getProductsByCategory,
    /** Charger les produits par marque */
    getProductsByBrand: store.getProductsByBrand,
    /** Charger les produits par tag */
    getProductsByTag: store.getProductsByTag,
    
    // ============ RÉCUPÉRATION INDIVIDUELLE ============
    /** Récupérer un produit par ID */
    getProduct: store.getProduct,
    /** Récupérer un produit par slug */
    getProductBySlug: store.getProductBySlug,
    /** Récupérer une catégorie */
    getCategory: store.getCategory,
    /** Récupérer une catégorie par slug */
    getCategoryBySlug: store.getCategoryBySlug,
    
    // ============ AVIS ============
    /** Charger les avis d'un produit */
    loadProductReviews: store.loadProductReviews,
    /** Créer un avis */
    createProductReview: store.createProductReview,
    /** Mettre à jour un avis */
    updateProductReview: store.updateProductReview,
    /** Supprimer un avis */
    deleteProductReview: store.deleteProductReview,
    /** Marquer un avis comme utile */
    markReviewHelpful: store.markReviewHelpful,
    
    // ============ COMPARAISON ============
    /** Comparer des produits */
    compareProductsAction: store.compareProductsAction,
    /** Ajouter à la comparaison */
    addToCompare: store.addToCompare,
    /** Supprimer de la comparaison */
    removeFromCompare: store.removeFromCompare,
    /** Vider la comparaison */
    clearCompare: store.clearCompare,
    
    // ============ PRODUITS EXTERNES ============
    /** Créer une demande de produit externe */
    createExternalProductRequest: store.createExternalProductRequest,
    /** Récupérer une demande */
    getExternalProductRequest: store.getExternalProductRequest,
    /** Réessayer une demande */
    retryExternalProductRequest: store.retryExternalProductRequest,
    
    // ============ VARIANTS ============
    /** Charger les variantes d'un produit */
    loadProductVariants: store.loadProductVariants,
    /** Sélectionner une variante */
    selectVariant: store.selectVariant,
    /** Récupérer une variante par SKU */
    getVariantBySku: store.getVariantBySku,
    
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
    
    // ============ SÉLECTION ============
    /** Sélectionner un produit */
    selectProduct: store.selectProduct,
    /** Sélectionner un produit par ID */
    selectProductById: store.selectProductById,
    /** Sélectionner une catégorie */
    selectCategory: store.selectCategory,
    /** Sélectionner une catégorie par ID */
    selectCategoryById: store.selectCategoryById,
    /** Effacer la sélection */
    clearSelected: store.clearSelected,
    
    // ============ CACHE ============
    /** Vider le cache */
    clearCache: store.clearCache,
    /** Invalider un produit */
    invalidateProduct: store.invalidateProduct,
    
    // ============ UTILITAIRES ============
    /** Récupérer un produit par ID (depuis le cache) */
    getProductById: store.getProductById,
    /** Récupérer les produits par catégorie */
    getProductsByCategoryId: store.getProductsByCategoryId,
    /** Récupérer les catégories par parent */
    getCategoriesByParent: store.getCategoriesByParent,
    /** Récupérer les produits filtrés */
    getFilteredProducts: store.getFilteredProducts,
    /** Vérifier si un produit est dans la wishlist */
    isProductInWishlist: store.isProductInWishlist,
    /** Effacer l'erreur */
    clearError: store.clearError,
    /** Réinitialiser le store */
    reset: store.reset,
  };
};