import { apiClient } from '@/lib/api-client';
import {
  Product,
  ProductFilter,
  ProductSearchResult,
  ProductReview,
  Category,
  ProductComparison,
  ExternalProductRequest,
  ProductVariant,
  ProductImage,
  ProductTag,
  ProductBulkOperation,
} from '@/types/product';

class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  // ============ PRODUCTS ============

  async getProducts(filters?: ProductFilter): Promise<ProductSearchResult> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    return apiClient.get(`/products/?${params.toString()}`);
  }

  async getProductBySlug(slug: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${slug}/`);
  }

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}/`);
  }

  async searchProducts(query: string, filters?: Partial<ProductFilter>): Promise<ProductSearchResult> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/products/search/?${params.toString()}`);
  }

  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/featured/?limit=${limit}`);
  }

  async getPopularProducts(limit = 10): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/popular/?limit=${limit}`);
  }

  async getNewProducts(limit = 10): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/new/?limit=${limit}`);
  }

  async getOnSaleProducts(limit = 10): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/on-sale/?limit=${limit}`);
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/${productId}/related/?limit=${limit}`);
  }

  async getProductsByCategory(categorySlug: string, filters?: Partial<ProductFilter>): Promise<ProductSearchResult> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/products/category/${categorySlug}/?${params.toString()}`);
  }

  async getProductsByBrand(brand: string, filters?: Partial<ProductFilter>): Promise<ProductSearchResult> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/products/brand/${encodeURIComponent(brand)}/?${params.toString()}`);
  }

  async getProductAvailability(productId: string, variantId?: string): Promise<{
    available: boolean;
    quantity: number;
    variants?: {
      id: string;
      sku: string;
      stock: number;
      attributes: Record<string, string>;
    }[];
  }> {
    const params = new URLSearchParams();
    if (variantId) {
      params.append('variant_id', variantId);
    }
    return apiClient.get(`/products/${productId}/availability/?${params.toString()}`);
  }

  async getPriceHistory(productId: string): Promise<{ date: string; price: number; salePrice?: number }[]> {
    return apiClient.get(`/products/${productId}/price-history/`);
  }

  // ============ CATEGORIES ============

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/products/categories/');
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return apiClient.get<Category>(`/products/categories/${slug}/`);
  }

  async getCategoryProducts(categorySlug: string, filters?: Partial<ProductFilter>): Promise<ProductSearchResult> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/products/categories/${categorySlug}/products/?${params.toString()}`);
  }

  async getCategoryTree(): Promise<Category[]> {
    return apiClient.get<Category[]>('/products/categories/tree/');
  }

  // ============ REVIEWS ============

  async getProductReviews(productId: string, params?: { page?: number; limit?: number; sort?: string }): Promise<{
    reviews: ProductReview[];
    total: number;
    page: number;
    totalPages: number;
    ratingDistribution: { [key: number]: number };
    averageRating: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/products/${productId}/reviews/?${queryParams.toString()}`);
  }

  async createProductReview(productId: string, rating: number, title: string, comment: string, images?: File[]): Promise<ProductReview> {
    const formData = new FormData();
    formData.append('rating', String(rating));
    formData.append('title', title);
    formData.append('comment', comment);
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
    return apiClient.post<ProductReview>(`/products/${productId}/reviews/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateProductReview(reviewId: string, data: { rating?: number; title?: string; comment?: string }): Promise<ProductReview> {
    return apiClient.patch<ProductReview>(`/products/reviews/${reviewId}/`, data);
  }

  async deleteProductReview(reviewId: string): Promise<void> {
    return apiClient.delete(`/products/reviews/${reviewId}/`);
  }

  async markReviewHelpful(reviewId: string, helpful: boolean): Promise<void> {
    return apiClient.post(`/products/reviews/${reviewId}/helpful/`, { helpful });
  }

  // ============ COMPARE ============

  async compareProducts(productIds: string[]): Promise<ProductComparison> {
    return apiClient.post<ProductComparison>('/products/compare/', { product_ids: productIds });
  }

  // ============ EXTERNAL PRODUCTS ============

  async createExternalProductRequest(url: string): Promise<ExternalProductRequest> {
    return apiClient.post<ExternalProductRequest>('/external-products/', { url });
  }

  async getExternalProductRequest(id: string): Promise<ExternalProductRequest> {
    return apiClient.get<ExternalProductRequest>(`/external-products/${id}/`);
  }

  async getExternalProductRequests(params?: { status?: string; page?: number; limit?: number }): Promise<{
    requests: ExternalProductRequest[];
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
    return apiClient.get(`/external-products/?${queryParams.toString()}`);
  }

  async retryExternalProductRequest(id: string): Promise<ExternalProductRequest> {
    return apiClient.post<ExternalProductRequest>(`/external-products/${id}/retry/`);
  }

  // ============ VARIANTS ============

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return apiClient.get<ProductVariant[]>(`/products/${productId}/variants/`);
  }

  async getVariantBySku(sku: string): Promise<ProductVariant> {
    return apiClient.get<ProductVariant>(`/products/variants/sku/${sku}/`);
  }

  // ============ TAGS ============

  async getTags(): Promise<ProductTag[]> {
    return apiClient.get<ProductTag[]>('/products/tags/');
  }

  async getProductsByTag(tagSlug: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/tags/${tagSlug}/`);
  }

  // ============ ADMIN METHODS ============

  async createProduct(data: FormData): Promise<Product> {
    return apiClient.post<Product>('/products/admin/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateProduct(id: string, data: FormData): Promise<Product> {
    return apiClient.patch<Product>(`/products/admin/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete(`/products/admin/${id}/`);
  }

  async updateStock(id: string, stock: number, variantId?: string): Promise<void> {
    return apiClient.patch(`/products/admin/${id}/stock/`, { stock, variant_id: variantId });
  }

  async bulkOperation(data: ProductBulkOperation): Promise<void> {
    return apiClient.post('/products/admin/bulk/', data);
  }

  async updateProductImages(id: string, images: File[]): Promise<ProductImage[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    return apiClient.post<ProductImage[]>(`/products/admin/${id}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteProductImage(imageId: string): Promise<void> {
    return apiClient.delete(`/products/admin/images/${imageId}/`);
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    return apiClient.post<Category>('/products/admin/categories/', data);
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return apiClient.patch<Category>(`/products/admin/categories/${id}/`, data);
  }

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete(`/products/admin/categories/${id}/`);
  }

  async createTag(name: string): Promise<ProductTag> {
    return apiClient.post<ProductTag>('/products/admin/tags/', { name });
  }

  async deleteTag(id: string): Promise<void> {
    return apiClient.delete(`/products/admin/tags/${id}/`);
  }

  // ============ IMPORT/EXPORT ============

  async importProducts(file: File): Promise<{ imported: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/products/admin/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async exportProducts(format: 'csv' | 'excel', filters?: ProductFilter): Promise<Blob> {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/products/admin/export/?${params.toString()}`, {
      responseType: 'blob',
    });
  }
}

export const productsService = ProductsService.getInstance();