import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';
import { 
  Product, 
  ProductFilter, 
  ProductSearchResult,
  Category,
  ProductReview,
  ProductComparison,
  ExternalProductRequest,
  ProductVariant,
  ProductTag,
} from '@/types/product';
import { productsService } from '@/services/products.service';
import { ApiError } from '@/lib/api-client';
import { logger } from '@/lib/logger';

// ============ TYPES ============

export interface ProductState {
  // Données
  products: Product[];
  featuredProducts: Product[];
  popularProducts: Product[];
  newProducts: Product[];
  onSaleProducts: Product[];
  categories: Category[];
  categoryTree: Category[];
  tags: ProductTag[];
  
  // État sélectionné
  selectedProduct: Product | null;
  selectedProductId: string | null;
  selectedCategory: Category | null;
  selectedCategoryId: string | null;
  
  // Reviews
  reviews: ProductReview[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
    distribution: { [key: number]: number };
  } | null;
  
  // Comparison
  comparison: ProductComparison | null;
  compareProducts: Product[];
  
  // External product
  externalProductRequest: ExternalProductRequest | null;
  externalProductRequests: ExternalProductRequest[];
  
  // Variants
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  
  // État
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  
  // Pagination
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  
  // Filtres
  filters: ProductFilter;
  
  // Cache
  productCache: Record<string, Product>;
  categoryCache: Record<string, Category>;
  
  // Retry
  retryCount: number;
  maxRetries: number;
  
  // Actions - Chargement
  loadProducts: (filters?: Partial<ProductFilter>) => Promise<void>;
  loadFeaturedProducts: () => Promise<void>;
  loadPopularProducts: () => Promise<void>;
  loadNewProducts: () => Promise<void>;
  loadOnSaleProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadCategoryTree: () => Promise<void>;
  loadTags: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // Actions - Récupération
  getProduct: (id: string, forceRefresh?: boolean) => Promise<Product | null>;
  getProductBySlug: (slug: string, forceRefresh?: boolean) => Promise<Product | null>;
  getCategory: (id: string) => Promise<Category | null>;
  getCategoryBySlug: (slug: string) => Promise<Category | null>;
  
  // Actions - Recherche
  searchProducts: (query: string, filters?: Partial<ProductFilter>) => Promise<void>;
  getProductsByCategory: (categorySlug: string) => Promise<void>;
  getProductsByBrand: (brand: string) => Promise<void>;
  getProductsByTag: (tagSlug: string) => Promise<void>;
  
  // Actions - Reviews
  loadProductReviews: (productId: string) => Promise<void>;
  createProductReview: (productId: string, rating: number, title: string, comment: string, images?: File[]) => Promise<boolean>;
  updateProductReview: (reviewId: string, data: { rating?: number; title?: string; comment?: string }) => Promise<boolean>;
  deleteProductReview: (reviewId: string) => Promise<boolean>;
  markReviewHelpful: (reviewId: string, helpful: boolean) => Promise<boolean>;
  
  // Actions - Comparison
  compareProductsAction: (productIds: string[]) => Promise<ProductComparison | null>;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  
  // Actions - External Product
  createExternalProductRequest: (url: string) => Promise<ExternalProductRequest | null>;
  getExternalProductRequest: (id: string) => Promise<ExternalProductRequest | null>;
  retryExternalProductRequest: (id: string) => Promise<ExternalProductRequest | null>;
  
  // Actions - Variants
  loadProductVariants: (productId: string) => Promise<void>;
  selectVariant: (variantId: string) => void;
  getVariantBySku: (sku: string) => Promise<ProductVariant | null>;
  
  // Actions - Filtres
  setFilters: (filters: Partial<ProductFilter>) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  
  // Actions - Sélection
  selectProduct: (product: Product) => void;
  selectProductById: (id: string) => void;
  selectCategory: (category: Category) => void;
  selectCategoryById: (id: string) => void;
  clearSelected: () => void;
  
  // Actions - Cache
  clearCache: () => void;
  invalidateProduct: (id: string) => void;
  
  // Actions - Utilitaires
  getProductById: (id: string) => Product | null;
  getProductsByCategoryId: (categoryId: string) => Product[];
  getCategoriesByParent: (parentId: string) => Category[];
  getFilteredProducts: () => Product[];
  isProductInWishlist: (productId: string) => Promise<boolean>;
  
  clearError: () => void;
  reset: () => void;
}

// ============ INITIAL STATE ============

const initialFilters: ProductFilter = {
  page: 1,
  limit: 20,
  sortBy: 'newest',
};

const initialState: Omit<ProductState, 
  | 'loadProducts'
  | 'loadFeaturedProducts'
  | 'loadPopularProducts'
  | 'loadNewProducts'
  | 'loadOnSaleProducts'
  | 'loadCategories'
  | 'loadCategoryTree'
  | 'loadTags'
  | 'refresh'
  | 'getProduct'
  | 'getProductBySlug'
  | 'getCategory'
  | 'getCategoryBySlug'
  | 'searchProducts'
  | 'getProductsByCategory'
  | 'getProductsByBrand'
  | 'getProductsByTag'
  | 'loadProductReviews'
  | 'createProductReview'
  | 'updateProductReview'
  | 'deleteProductReview'
  | 'markReviewHelpful'
  | 'compareProductsAction'
  | 'addToCompare'
  | 'removeFromCompare'
  | 'clearCompare'
  | 'createExternalProductRequest'
  | 'getExternalProductRequest'
  | 'retryExternalProductRequest'
  | 'loadProductVariants'
  | 'selectVariant'
  | 'getVariantBySku'
  | 'setFilters'
  | 'resetFilters'
  | 'goToPage'
  | 'nextPage'
  | 'previousPage'
  | 'selectProduct'
  | 'selectProductById'
  | 'selectCategory'
  | 'selectCategoryById'
  | 'clearSelected'
  | 'clearCache'
  | 'invalidateProduct'
  | 'getProductById'
  | 'getProductsByCategoryId'
  | 'getCategoriesByParent'
  | 'getFilteredProducts'
  | 'isProductInWishlist'
  | 'clearError'
  | 'reset'
> = {
  // Données
  products: [],
  featuredProducts: [],
  popularProducts: [],
  newProducts: [],
  onSaleProducts: [],
  categories: [],
  categoryTree: [],
  tags: [],
  
  // État sélectionné
  selectedProduct: null,
  selectedProductId: null,
  selectedCategory: null,
  selectedCategoryId: null,
  
  // Reviews
  reviews: [],
  reviewStats: null,
  
  // Comparison
  comparison: null,
  compareProducts: [],
  
  // External product
  externalProductRequest: null,
  externalProductRequests: [],
  
  // Variants
  variants: [],
  selectedVariant: null,
  
  // État
  loading: false,
  refreshing: false,
  error: null,
  status: 'idle' as const,
  
  // Pagination
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  
  // Filtres
  filters: initialFilters,
  
  // Cache
  productCache: {},
  categoryCache: {},
  
  // Retry
  retryCount: 0,
  maxRetries: 3,
};

// ============ STORE ============

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============ CHARGEMENT ============

      loadProducts: async (filters?: Partial<ProductFilter>) => {
        // Éviter les doubles chargements
        if (get().loading) return;
        
        set({ loading: true, error: null, status: 'loading' });
        try {
          const currentFilters = { ...get().filters, ...filters };
          const result = await productsService.getProducts(currentFilters);
          
          // Mettre à jour le cache
          const newCache = { ...get().productCache };
          result.products.forEach(product => {
            newCache[product.id] = product;
          });
          
          set({
            products: result.products,
            total: result.total,
            page: result.page,
            limit: result.limit || 20,
            totalPages: result.totalPages,
            filters: currentFilters,
            productCache: newCache,
            loading: false,
            status: 'success',
            retryCount: 0,
          });
          
          logger.info('Products loaded', { 
            count: result.products.length, 
            total: result.total,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des produits';
          const retryCount = get().retryCount;
          
          // Tentative de retry
          if (retryCount < get().maxRetries) {
            set({ retryCount: retryCount + 1 });
            setTimeout(() => {
              get().loadProducts(filters);
            }, 1000 * (retryCount + 1));
            return;
          }
          
          set({ 
            error: message, 
            loading: false, 
            status: 'error' 
          });
          logger.error('Failed to load products', error);
        }
      },

      loadFeaturedProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await productsService.getFeaturedProducts();
          set({ featuredProducts: products, loading: false });
          logger.info('Featured products loaded', { count: products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load featured products', error);
        }
      },

      loadPopularProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await productsService.getPopularProducts();
          set({ popularProducts: products, loading: false });
          logger.info('Popular products loaded', { count: products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load popular products', error);
        }
      },

      loadNewProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await productsService.getNewProducts();
          set({ newProducts: products, loading: false });
          logger.info('New products loaded', { count: products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load new products', error);
        }
      },

      loadOnSaleProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await productsService.getOnSaleProducts();
          set({ onSaleProducts: products, loading: false });
          logger.info('On sale products loaded', { count: products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load on sale products', error);
        }
      },

      loadCategories: async () => {
        set({ loading: true, error: null });
        try {
          const categories = await productsService.getCategories();
          
          // Mettre à jour le cache
          const newCache = { ...get().categoryCache };
          categories.forEach(category => {
            newCache[category.id] = category;
          });
          
          set({ 
            categories, 
            categoryCache: newCache,
            loading: false 
          });
          logger.info('Categories loaded', { count: categories.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des catégories';
          set({ error: message, loading: false });
          logger.error('Failed to load categories', error);
        }
      },

      loadCategoryTree: async () => {
        set({ loading: true, error: null });
        try {
          const tree = await productsService.getCategoryTree();
          set({ categoryTree: tree, loading: false });
          logger.info('Category tree loaded');
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load category tree', error);
        }
      },

      loadTags: async () => {
        set({ loading: true, error: null });
        try {
          const tags = await productsService.getTags();
          set({ tags, loading: false });
          logger.info('Tags loaded', { count: tags.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des tags';
          set({ error: message, loading: false });
          logger.error('Failed to load tags', error);
        }
      },

      refresh: async () => {
        if (get().refreshing) return;
        
        set({ refreshing: true });
        try {
          await Promise.all([
            get().loadProducts(),
            get().loadFeaturedProducts(),
            get().loadPopularProducts(),
            get().loadNewProducts(),
            get().loadOnSaleProducts(),
            get().loadCategories(),
            get().loadTags(),
          ]);
          set({ refreshing: false });
        } catch (error) {
          set({ refreshing: false });
          logger.error('Failed to refresh products', error);
        }
      },

      // ============ RÉCUPÉRATION ============

      getProduct: async (id: string, forceRefresh: boolean = false) => {
        // Vérifier le cache
        if (!forceRefresh && get().productCache[id]) {
          const cached = get().productCache[id];
          set({ selectedProduct: cached, selectedProductId: id });
          return cached;
        }
        
        set({ loading: true, error: null });
        try {
          const product = await productsService.getProductById(id);
          
          // Mettre à jour le cache
          set((state) => ({
            selectedProduct: product,
            selectedProductId: id,
            productCache: { ...state.productCache, [id]: product },
            loading: false,
            status: 'success',
          }));
          
          logger.info('Product retrieved', { productId: id });
          return product;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Produit non trouvé';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to get product', error);
          return null;
        }
      },

      getProductBySlug: async (slug: string, forceRefresh: boolean = false) => {
        // Vérifier le cache
        const cachedId = Object.keys(get().productCache).find(
          key => get().productCache[key].slug === slug
        );
        if (!forceRefresh && cachedId) {
          const cached = get().productCache[cachedId];
          set({ selectedProduct: cached, selectedProductId: cachedId });
          return cached;
        }
        
        set({ loading: true, error: null });
        try {
          const product = await productsService.getProductBySlug(slug);
          
          set((state) => ({
            selectedProduct: product,
            selectedProductId: product.id,
            productCache: { ...state.productCache, [product.id]: product },
            loading: false,
            status: 'success',
          }));
          
          logger.info('Product retrieved by slug', { slug });
          return product;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Produit non trouvé';
          set({ 
            error: message, 
            loading: false,
            status: 'error',
          });
          logger.error('Failed to get product by slug', error);
          return null;
        }
      },

      getCategory: async (id: string) => {
        // Vérifier le cache
        if (get().categoryCache[id]) {
          const cached = get().categoryCache[id];
          set({ selectedCategory: cached, selectedCategoryId: id });
          return cached;
        }
        
        set({ loading: true, error: null });
        try {
          const category = await productsService.getCategoryBySlug(id);
          
          set((state) => ({
            selectedCategory: category,
            selectedCategoryId: category.id,
            categoryCache: { ...state.categoryCache, [category.id]: category },
            loading: false,
          }));
          
          return category;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Catégorie non trouvée';
          set({ error: message, loading: false });
          logger.error('Failed to get category', error);
          return null;
        }
      },

      getCategoryBySlug: async (slug: string) => {
        set({ loading: true, error: null });
        try {
          const category = await productsService.getCategoryBySlug(slug);
          
          set((state) => ({
            selectedCategory: category,
            selectedCategoryId: category.id,
            categoryCache: { ...state.categoryCache, [category.id]: category },
            loading: false,
          }));
          
          return category;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Catégorie non trouvée';
          set({ error: message, loading: false });
          logger.error('Failed to get category by slug', error);
          return null;
        }
      },

      // ============ RECHERCHE ============

      searchProducts: async (query: string, filters?: Partial<ProductFilter>) => {
        set({ loading: true, error: null });
        try {
          const result = await productsService.searchProducts(query, filters);
          
          set({
            products: result.products,
            total: result.total,
            page: result.page,
            limit: result.limit || 20,
            totalPages: result.totalPages,
            loading: false,
            status: 'success',
          });
          
          logger.info('Products searched', { query, count: result.products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de recherche';
          set({ error: message, loading: false });
          logger.error('Failed to search products', error);
        }
      },

      getProductsByCategory: async (categorySlug: string) => {
        set({ loading: true, error: null });
        try {
          const result = await productsService.getProductsByCategory(categorySlug);
          
          set({
            products: result.products,
            total: result.total,
            page: result.page,
            limit: result.limit || 20,
            totalPages: result.totalPages,
            loading: false,
          });
          
          logger.info('Products by category loaded', { categorySlug, count: result.products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load products by category', error);
        }
      },

      getProductsByBrand: async (brand: string) => {
        set({ loading: true, error: null });
        try {
          const result = await productsService.getProductsByBrand(brand);
          
          set({
            products: result.products,
            total: result.total,
            page: result.page,
            limit: result.limit || 20,
            totalPages: result.totalPages,
            loading: false,
          });
          
          logger.info('Products by brand loaded', { brand, count: result.products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load products by brand', error);
        }
      },

      getProductsByTag: async (tagSlug: string) => {
        set({ loading: true, error: null });
        try {
          const products = await productsService.getProductsByTag(tagSlug);
          set({ products, loading: false });
          logger.info('Products by tag loaded', { tagSlug, count: products.length });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement';
          set({ error: message, loading: false });
          logger.error('Failed to load products by tag', error);
        }
      },

      // ============ REVIEWS ============

      loadProductReviews: async (productId: string) => {
        set({ loading: true, error: null });
        try {
          const result = await productsService.getProductReviews(productId);
          set({ 
            reviews: result.reviews,
            reviewStats: {
              averageRating: result.averageRating,
              totalReviews: result.total,
              distribution: result.ratingDistribution,
            },
            loading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des avis';
          set({ error: message, loading: false });
          logger.error('Failed to load product reviews', error);
        }
      },

      createProductReview: async (productId: string, rating: number, title: string, comment: string, images?: File[]) => {
        set({ loading: true, error: null });
        try {
          const review = await productsService.createProductReview(productId, rating, title, comment);
          
          // Mettre à jour la liste des avis
          set((state) => ({
            reviews: [review, ...state.reviews],
            loading: false,
          }));
          
          // Mettre à jour les statistiques
          await get().loadProductReviews(productId);
          
          logger.info('Review created', { productId, rating });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur d\'envoi de l\'avis';
          set({ error: message, loading: false });
          logger.error('Failed to create review', error);
          return false;
        }
      },

      updateProductReview: async (reviewId: string, data: { rating?: number; title?: string; comment?: string }) => {
        set({ loading: true, error: null });
        try {
          const review = await productsService.updateProductReview(reviewId, data);
          
          set((state) => ({
            reviews: state.reviews.map((r) => (r.id === reviewId ? review : r)),
            loading: false,
          }));
          
          logger.info('Review updated', { reviewId });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de mise à jour';
          set({ error: message, loading: false });
          logger.error('Failed to update review', error);
          return false;
        }
      },

      deleteProductReview: async (reviewId: string) => {
        set({ loading: true, error: null });
        try {
          await productsService.deleteProductReview(reviewId);
          
          set((state) => ({
            reviews: state.reviews.filter((r) => r.id !== reviewId),
            loading: false,
          }));
          
          logger.info('Review deleted', { reviewId });
          return true;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de suppression';
          set({ error: message, loading: false });
          logger.error('Failed to delete review', error);
          return false;
        }
      },

      markReviewHelpful: async (reviewId: string, helpful: boolean) => {
        try {
          await productsService.markReviewHelpful(reviewId, helpful);
          logger.info('Review marked as helpful', { reviewId, helpful });
          return true;
        } catch (error) {
          logger.error('Failed to mark review helpful', error);
          return false;
        }
      },

      // ============ COMPARISON ============

      compareProductsAction: async (productIds: string[]) => {
        set({ loading: true, error: null });
        try {
          const comparison = await productsService.compareProducts(productIds);
          set({ 
            comparison, 
            compareProducts: comparison.products,
            loading: false,
          });
          return comparison;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de comparaison';
          set({ error: message, loading: false });
          logger.error('Failed to compare products', error);
          return null;
        }
      },

      addToCompare: (productId: string) => {
        const { compareProducts } = get();
        if (compareProducts.length >= 4) {
          logger.warn('Maximum 4 products can be compared');
          return;
        }
        if (compareProducts.some(p => p.id === productId)) {
          return;
        }
        
        const product = get().productCache[productId] || 
                       get().products.find(p => p.id === productId);
        if (product) {
          set((state) => ({
            compareProducts: [...state.compareProducts, product],
          }));
          logger.info('Product added to compare', { productId });
        }
      },

      removeFromCompare: (productId: string) => {
        set((state) => ({
          compareProducts: state.compareProducts.filter(p => p.id !== productId),
        }));
        logger.info('Product removed from compare', { productId });
      },

      clearCompare: () => {
        set({ compareProducts: [], comparison: null });
        logger.info('Compare cleared');
      },

      // ============ EXTERNAL PRODUCT ============

      createExternalProductRequest: async (url: string) => {
        set({ loading: true, error: null });
        try {
          const request = await productsService.createExternalProductRequest(url);
          set({ 
            externalProductRequest: request,
            loading: false,
          });
          logger.info('External product request created', { url });
          return request;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de traitement';
          set({ error: message, loading: false });
          logger.error('Failed to create external product request', error);
          return null;
        }
      },

      getExternalProductRequest: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const request = await productsService.getExternalProductRequest(id);
          set({ 
            externalProductRequest: request,
            loading: false,
          });
          return request;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Requête non trouvée';
          set({ error: message, loading: false });
          logger.error('Failed to get external product request', error);
          return null;
        }
      },

      retryExternalProductRequest: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const request = await productsService.retryExternalProductRequest(id);
          set({ 
            externalProductRequest: request,
            loading: false,
          });
          logger.info('External product request retried', { id });
          return request;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de re-traitement';
          set({ error: message, loading: false });
          logger.error('Failed to retry external product request', error);
          return null;
        }
      },

      // ============ VARIANTS ============

      loadProductVariants: async (productId: string) => {
        set({ loading: true, error: null });
        try {
          const variants = await productsService.getProductVariants(productId);
          set({ 
            variants,
            selectedVariant: variants.find(v => v.isDefault) || variants[0] || null,
            loading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Erreur de chargement des variantes';
          set({ error: message, loading: false });
          logger.error('Failed to load product variants', error);
        }
      },

      selectVariant: (variantId: string) => {
        const variant = get().variants.find(v => v.id === variantId);
        if (variant) {
          set({ selectedVariant: variant });
          logger.info('Variant selected', { variantId });
        }
      },

      getVariantBySku: async (sku: string) => {
        try {
          const variant = await productsService.getVariantBySku(sku);
          return variant;
        } catch (error) {
          logger.error('Failed to get variant by SKU', error);
          return null;
        }
      },

      // ============ FILTRES ============

      setFilters: (filters: Partial<ProductFilter>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
        get().loadProducts();
      },

      resetFilters: () => {
        set({ filters: initialFilters });
        get().loadProducts();
      },

      goToPage: (page: number) => {
        const { totalPages } = get();
        if (page < 1 || page > totalPages) return;
        set({ page });
        get().loadProducts({ page });
      },

      nextPage: () => {
        const { page, totalPages } = get();
        if (page < totalPages) {
          get().goToPage(page + 1);
        }
      },

      previousPage: () => {
        const { page } = get();
        if (page > 1) {
          get().goToPage(page - 1);
        }
      },

      // ============ SÉLECTION ============

      selectProduct: (product: Product) => {
        set({ 
          selectedProduct: product,
          selectedProductId: product.id,
        });
      },

      selectProductById: (id: string) => {
        const product = get().productCache[id] || 
                       get().products.find(p => p.id === id) || null;
        if (product) {
          set({ 
            selectedProduct: product,
            selectedProductId: id,
          });
        }
      },

      selectCategory: (category: Category) => {
        set({ 
          selectedCategory: category,
          selectedCategoryId: category.id,
        });
      },

      selectCategoryById: (id: string) => {
        const category = get().categoryCache[id] || 
                        get().categories.find(c => c.id === id) || null;
        if (category) {
          set({ 
            selectedCategory: category,
            selectedCategoryId: id,
          });
        }
      },

      clearSelected: () => {
        set({ 
          selectedProduct: null,
          selectedProductId: null,
          selectedCategory: null,
          selectedCategoryId: null,
          reviews: [],
          reviewStats: null,
          variants: [],
          selectedVariant: null,
          comparison: null,
          compareProducts: [],
        });
      },

      // ============ CACHE ============

      clearCache: () => {
        set({ 
          productCache: {},
          categoryCache: {},
        });
      },

      invalidateProduct: (id: string) => {
        set((state) => {
          const newCache = { ...state.productCache };
          delete newCache[id];
          return { productCache: newCache };
        });
        logger.info('Product cache invalidated', { productId: id });
      },

      // ============ UTILITAIRES ============

      getProductById: (id: string) => {
        return get().productCache[id] || 
               get().products.find(p => p.id === id) || null;
      },

      getProductsByCategoryId: (categoryId: string) => {
        return get().products.filter(p => p.categoryId === categoryId);
      },

      getCategoriesByParent: (parentId: string) => {
        return get().categories.filter(c => c.parentId === parentId);
      },

      getFilteredProducts: () => {
        return get().products;
      },

      isProductInWishlist: async (productId: string) => {
        try {
          return await productsService.getProductAvailability(productId).then(() => false);
        } catch {
          return false;
        }
      },

      clearError: () => {
        set({ error: null, status: 'idle' });
      },

      reset: () => {
        set({
          ...initialState,
          filters: get().filters,
          productCache: get().productCache,
          categoryCache: get().categoryCache,
        });
      },
    }),
    {
      name: 'product-storage',
      partialize: (state) => ({
        filters: state.filters,
        productCache: state.productCache,
        categoryCache: state.categoryCache,
        compareProducts: state.compareProducts,
      }),
    }
  )
);

// ============ HOOKS PERSONNALISÉS ============

/**
 * Hook pour utiliser les produits avec filtres
 */
export const useProducts = (filters?: Partial<ProductFilter>) => {
  const store = useProductStore();
  
  React.useEffect(() => {
    if (filters) {
      store.setFilters(filters);
    } else {
      store.loadProducts();
    }
    store.loadCategories();
    store.loadTags();
  }, [JSON.stringify(filters)]);
  
  return {
    products: store.products,
    loading: store.loading,
    refreshing: store.refreshing,
    error: store.error,
    total: store.total,
    page: store.page,
    totalPages: store.totalPages,
    filters: store.filters,
    categories: store.categories,
    tags: store.tags,
    refresh: store.refresh,
    goToPage: store.goToPage,
    nextPage: store.nextPage,
    previousPage: store.previousPage,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
  };
};

/**
 * Hook pour les produits en vedette
 */
export const useFeaturedProducts = () => {
  const store = useProductStore();
  
  React.useEffect(() => {
    store.loadFeaturedProducts();
  }, []);
  
  return {
    products: store.featuredProducts,
    loading: store.loading,
    refresh: store.loadFeaturedProducts,
  };
};

/**
 * Hook pour les produits populaires
 */
export const usePopularProducts = () => {
  const store = useProductStore();
  
  React.useEffect(() => {
    store.loadPopularProducts();
  }, []);
  
  return {
    products: store.popularProducts,
    loading: store.loading,
    refresh: store.loadPopularProducts,
  };
};

/**
 * Hook pour les nouveaux produits
 */
export const useNewProducts = () => {
  const store = useProductStore();
  
  React.useEffect(() => {
    store.loadNewProducts();
  }, []);
  
  return {
    products: store.newProducts,
    loading: store.loading,
    refresh: store.loadNewProducts,
  };
};

/**
 * Hook pour les produits en promotion
 */
export const useOnSaleProducts = () => {
  const store = useProductStore();
  
  React.useEffect(() => {
    store.loadOnSaleProducts();
  }, []);
  
  return {
    products: store.onSaleProducts,
    loading: store.loading,
    refresh: store.loadOnSaleProducts,
  };
};

/**
 * Hook pour un produit spécifique
 */
export const useProduct = (id: string) => {
  const store = useProductStore();
  
  React.useEffect(() => {
    if (id) {
      store.getProduct(id);
      store.loadProductReviews(id);
      store.loadProductVariants(id);
    }
  }, [id]);
  
  return {
    product: store.selectedProduct,
    reviews: store.reviews,
    reviewStats: store.reviewStats,
    variants: store.variants,
    selectedVariant: store.selectedVariant,
    loading: store.loading,
    error: store.error,
    selectVariant: store.selectVariant,
    refresh: () => {
      store.getProduct(id, true);
      store.loadProductReviews(id);
      store.loadProductVariants(id);
    },
    createReview: (rating: number, title: string, comment: string, images?: File[]) => {
      return store.createProductReview(id, rating, title, comment, images);
    },
  };
};

/**
 * Hook pour les catégories
 */
export const useCategories = () => {
  const store = useProductStore();
  
  React.useEffect(() => {
    store.loadCategories();
    store.loadCategoryTree();
  }, []);
  
  return {
    categories: store.categories,
    categoryTree: store.categoryTree,
    loading: store.loading,
    getCategory: store.getCategory,
    getCategoryBySlug: store.getCategoryBySlug,
    selectCategory: store.selectCategory,
    selectedCategory: store.selectedCategory,
  };
};

/**
 * Hook pour la comparaison de produits
 */
export const useProductComparison = () => {
  const store = useProductStore();
  
  return {
    compareProducts: store.compareProducts,
    comparison: store.comparison,
    loading: store.loading,
    addToCompare: store.addToCompare,
    removeFromCompare: store.removeFromCompare,
    clearCompare: store.clearCompare,
    compare: store.compareProductsAction,
    canCompare: store.compareProducts.length >= 2,
    maxReached: store.compareProducts.length >= 4,
  };
};

/**
 * Hook pour l'import de produits externes
 */
export const useExternalProduct = () => {
  const store = useProductStore();
  
  return {
    request: store.externalProductRequest,
    requests: store.externalProductRequests,
    loading: store.loading,
    error: store.error,
    createRequest: store.createExternalProductRequest,
    getRequest: store.getExternalProductRequest,
    retryRequest: store.retryExternalProductRequest,
  };
};

// ============ EXPORT ============

export default useProductStore;