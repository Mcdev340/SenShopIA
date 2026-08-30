import { Product, ProductVariant } from './product';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  selected: boolean;
  savedForLater: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  savedItems: CartItem[];
  subtotal: number;
  total: number;
  shippingCost: number;
  tax: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  currency: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity?: number;
  selected?: boolean;
}

export interface UpdateCartItemData {
  quantity: number;
  selected?: boolean;
  savedForLater?: boolean;
}

export interface CartValidation {
  valid: boolean;
  errors: {
    itemId: string;
    message: string;
  }[];
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount?: number;
  maxDiscount?: number;
  startDate: Date;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  currency: string;
}

export interface ShippingEstimate {
  method: string;
  cost: number;
  duration: string;
  description: string;
  isAvailable: boolean;
}

export interface CartMergeResult {
  cart: Cart;
  mergedItems: number;
  conflicts: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}