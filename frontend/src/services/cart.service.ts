import { apiClient } from '@/lib/api-client';
import {
  Cart,
  CartItem,
  AddToCartData,
  UpdateCartItemData,
  Coupon,
  CartSummary,
  ShippingEstimate,
  CartMergeResult,
  CartValidation,
} from '@/types/cart';
import { Product } from '@/types/product';

class CartService {
  private static instance: CartService;

  private constructor() {}

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  // ============ CART MANAGEMENT ============

  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>('/cart/');
  }

  async getCartSummary(): Promise<CartSummary> {
    return apiClient.get<CartSummary>('/cart/summary/');
  }

  async getCartCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>('/cart/count/');
  }

  async getCartTotal(): Promise<{ subtotal: number; total: number; items: number }> {
    return apiClient.get('/cart/total/');
  }

  async validateCart(): Promise<CartValidation> {
    return apiClient.get<CartValidation>('/cart/validate/');
  }

  // ============ CART ITEMS ============

  async addToCart(data: AddToCartData): Promise<Cart> {
    return apiClient.post<Cart>('/cart/items/', data);
  }

  async addMultipleToCart(items: AddToCartData[]): Promise<Cart> {
    return apiClient.post<Cart>('/cart/items/batch/', { items });
  }

  async updateCartItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    return apiClient.patch<Cart>(`/cart/items/${itemId}/`, data);
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/items/${itemId}/`);
  }

  async removeMultipleFromCart(itemIds: string[]): Promise<Cart> {
    return apiClient.post<Cart>('/cart/items/batch/remove/', { item_ids: itemIds });
  }

  async clearCart(): Promise<void> {
    return apiClient.delete('/cart/');
  }

  async selectCartItems(itemIds: string[], selected: boolean): Promise<Cart> {
    return apiClient.post<Cart>('/cart/select-items/', { item_ids: itemIds, selected });
  }

  async selectAllItems(selected: boolean): Promise<Cart> {
    return apiClient.post<Cart>('/cart/select-all/', { selected });
  }

  // ============ SAVE FOR LATER ============

  async saveForLater(itemId: string): Promise<Cart> {
    return apiClient.post<Cart>(`/cart/items/${itemId}/save-for-later/`);
  }

  async moveToCart(itemId: string): Promise<Cart> {
    return apiClient.post<Cart>(`/cart/items/${itemId}/move-to-cart/`);
  }

  async getSavedItems(): Promise<CartItem[]> {
    return apiClient.get<CartItem[]>('/cart/saved/');
  }

  // ============ COUPONS ============

  async applyCoupon(code: string): Promise<Cart> {
    return apiClient.post<Cart>('/cart/apply-coupon/', { code });
  }

  async removeCoupon(): Promise<Cart> {
    return apiClient.delete<Cart>('/cart/coupon/');
  }

  async getCouponDetails(code: string): Promise<Coupon> {
    return apiClient.get<Coupon>(`/cart/coupon/${code}/`);
  }

  async getAvailableCoupons(): Promise<Coupon[]> {
    return apiClient.get<Coupon[]>('/cart/coupons/available/');
  }

  // ============ SHIPPING ============

  async estimateShipping(address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }): Promise<{ cost: number; options: ShippingEstimate[] }> {
    return apiClient.post('/cart/estimate-shipping/', address);
  }

  async getShippingOptions(): Promise<ShippingEstimate[]> {
    return apiClient.get<ShippingEstimate[]>('/cart/shipping-options/');
  }

  async selectShippingMethod(methodId: string): Promise<Cart> {
    return apiClient.post<Cart>('/cart/select-shipping/', { method_id: methodId });
  }

  // ============ MERGE & GUEST ============

  async mergeCarts(guestCartId: string): Promise<CartMergeResult> {
    return apiClient.post<CartMergeResult>('/cart/merge/', { guest_cart_id: guestCartId });
  }

  async getGuestCartId(): Promise<string> {
    return apiClient.get('/cart/guest-id/');
  }

  // ============ WISHLIST ============

  async getWishlist(): Promise<Product[]> {
    return apiClient.get<Product[]>('/cart/wishlist/');
  }

  async addToWishlist(productId: string): Promise<void> {
    return apiClient.post('/cart/wishlist/', { product_id: productId });
  }

  async removeFromWishlist(productId: string): Promise<void> {
    return apiClient.delete(`/cart/wishlist/${productId}/`);
  }

  async isInWishlist(productId: string): Promise<boolean> {
    return apiClient.get(`/cart/wishlist/check/${productId}/`);
  }

  // ============ PERSISTENCE ============

  async saveCart(): Promise<Cart> {
    return apiClient.post<Cart>('/cart/save/');
  }

  async loadSavedCart(): Promise<Cart> {
    return apiClient.get<Cart>('/cart/load/');
  }

  async syncCart(localCart: any): Promise<Cart> {
    return apiClient.post<Cart>('/cart/sync/', { local_cart: localCart });
  }

  // ============ STATISTICS ============

  async getCartStatistics(): Promise<{
    totalItems: number;
    uniqueProducts: number;
    totalValue: number;
    averageItemValue: number;
    categories: { name: string; count: number }[];
  }> {
    return apiClient.get('/cart/statistics/');
  }
}

export const cartService = CartService.getInstance();