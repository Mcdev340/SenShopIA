import { create } from "zustand";
import { persist } from "zustand/middleware";
import React from "react";
import {
  Cart,
  CartItem,
  AddToCartData,
  Coupon,
  ShippingEstimate,
  CartMergeResult,
} from "@/types/cart";
import { cartService } from "@/services/cart.service";
import { ApiError } from "@/lib/api-client";
import { logger } from "@/lib/logger";

// ============ TYPES ============

export interface CartState {
  isValid: any;
  validateCart: any;
  // Données
  cart: Cart | null;
  items: CartItem[];
  savedItems: CartItem[];

  // Calculs
  itemCount: number;
  subtotal: number;
  total: number;
  shippingCost: number;
  tax: number;
  discount: number;
  couponDiscount: number;
  couponCode: string | null;

  // État
  loading: boolean;
  refreshing: boolean;
  isRefreshing: boolean;
  error: string | null;
  status: "idle" | "loading" | "success" | "error";

  // UI
  isOpen: boolean;
  guestCartId: string | null;

  // Sélection
  selectedItems: string[];
  selectAll: boolean;

  // Estimation
  shippingEstimates: ShippingEstimate[];
  selectedShippingMethod: string | null;

  // Coupon
  coupon: Coupon | null;
  availableCoupons: Coupon[];

  // Retry
  retryCount: number;
  maxRetries: number;

  // Actions - Chargement
  loadCart: () => Promise<void>;
  loadCartSummary: () => Promise<void>;
  refresh: () => Promise<void>;

  // Actions - Items
  addItem: (
    productId: string,
    variantId?: string,
    quantity?: number,
  ) => Promise<boolean>;
  addItems: (items: AddToCartData[]) => Promise<boolean>;
  updateItem: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  removeItems: (itemIds: string[]) => Promise<boolean>;
  clearCart: () => Promise<boolean>;

  // Actions - Sélection
  selectItem: (itemId: string, selected: boolean) => Promise<boolean>;
  selectItems: (itemIds: string[], selected: boolean) => Promise<boolean>;
  selectAllItems: (selected: boolean) => Promise<boolean>;
  toggleSelectAll: () => Promise<boolean>;

  // Actions - Sauvegarde
  saveForLater: (itemId: string) => Promise<boolean>;
  moveToCart: (itemId: string) => Promise<boolean>;
  getSavedItems: () => Promise<void>;

  // Actions - Coupon
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => Promise<boolean>;
  getAvailableCoupons: () => Promise<void>;

  // Actions - Livraison
  estimateShipping: (address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) => Promise<boolean>;
  selectShippingMethod: (methodId: string) => Promise<boolean>;
  getShippingOptions: () => Promise<void>;

  // Actions - Fusion
  mergeCarts: (guestCartId: string) => Promise<CartMergeResult | null>;

  // Actions - Guest
  getGuestCartId: () => Promise<string>;
  syncCart: () => Promise<void>;
  saveCart: () => Promise<void>;
  loadSavedCart: () => Promise<void>;

  // Actions - UI
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Actions - Wishlist
  getWishlist: () => Promise<{ items: any[]; total: number }>;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => Promise<boolean>;

  // Actions - Utilitaires
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemById: (itemId: string) => CartItem | null;
  getItemByProductId: (productId: string) => CartItem | null;
  hasItem: (productId: string) => boolean;
  isEmpty: () => boolean;

  clearError: () => void;
  reset: () => void;
}

// ============ INITIAL STATE ============

const initialState: Omit<
  CartState,
  | "loadCart"
  | "loadCartSummary"
  | "refresh"
  | "addItem"
  | "addItems"
  | "updateItem"
  | "removeItem"
  | "removeItems"
  | "clearCart"
  | "selectItem"
  | "selectItems"
  | "selectAllItems"
  | "toggleSelectAll"
  | "saveForLater"
  | "moveToCart"
  | "getSavedItems"
  | "applyCoupon"
  | "removeCoupon"
  | "getAvailableCoupons"
  | "estimateShipping"
  | "selectShippingMethod"
  | "getShippingOptions"
  | "mergeCarts"
  | "getGuestCartId"
  | "syncCart"
  | "saveCart"
  | "loadSavedCart"
  | "openCart"
  | "closeCart"
  | "toggleCart"
  | "getWishlist"
  | "addToWishlist"
  | "removeFromWishlist"
  | "isInWishlist"
  | "getItemCount"
  | "getSubtotal"
  | "getTotal"
  | "getItemById"
  | "getItemByProductId"
  | "hasItem"
  | "isEmpty"
  | "clearError"
  | "reset"
> = {
  // Données
  cart: null,
  items: [],
  savedItems: [],

  // Calculs
  itemCount: 0,
  subtotal: 0,
  total: 0,
  shippingCost: 0,
  tax: 0,
  discount: 0,
  couponDiscount: 0,
  couponCode: null,

  // État
  loading: false,
  refreshing: false,
  isRefreshing: false,
  error: null,
  status: "idle" as const,

  // UI
  isOpen: false,
  guestCartId: null,

  // Sélection
  selectedItems: [],
  selectAll: false,

  // Estimation
  shippingEstimates: [],
  selectedShippingMethod: null,

  // Coupon
  coupon: null,
  availableCoupons: [],

  // Retry
  retryCount: 0,
  maxRetries: 3,
};

// ============ STORE ============

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============ CHARGEMENT ============

      loadCart: async () => {
        // Éviter les doubles chargements
        if (get().loading) return;

        set({ loading: true, error: null, status: "loading" });
        try {
          const cart = await cartService.getCart();

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            shippingCost: cart.shippingCost || 0,
            tax: cart.tax || 0,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
            status: "success",
            retryCount: 0,
          });

          logger.info("Cart loaded", {
            items: cart.items.length,
            count: count,
            total: cart.total,
          });
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Erreur de chargement du panier";
          const retryCount = get().retryCount;

          // Tentative de retry
          if (retryCount < get().maxRetries) {
            set({ retryCount: retryCount + 1 });
            setTimeout(
              () => {
                get().loadCart();
              },
              1000 * (retryCount + 1),
            );
            return;
          }

          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to load cart", error);
        }
      },

      loadCartSummary: async () => {
        try {
          const summary = await cartService.getCartSummary();
          set({
            itemCount: summary.itemCount,
            subtotal: summary.subtotal,
            total: summary.total,
            shippingCost: summary.shipping || 0,
            tax: summary.tax || 0,
            discount: summary.discount || 0,
          });
        } catch (error) {
          logger.warn("Failed to load cart summary", error);
        }
      },

      refresh: async () => {
        if (get().refreshing || get().isRefreshing) return;

        set({ refreshing: true, isRefreshing: true });
        try {
          await get().loadCart();
          await get().loadCartSummary();
          await get().getAvailableCoupons();
          set({ refreshing: false, isRefreshing: false });
        } catch (error) {
          set({ refreshing: false, isRefreshing: false });
          logger.error("Failed to refresh cart", error);
        }
      },

      // ============ ITEMS ============

      addItem: async (
        productId: string,
        variantId?: string,
        quantity: number = 1,
      ) => {
        set({ loading: true, error: null });
        try {
          const cart = await cartService.addToCart({
            productId,
            variantId,
            quantity,
          });

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            shippingCost: cart.shippingCost || 0,
            tax: cart.tax || 0,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
          });

          logger.info("Item added to cart", { productId, variantId, quantity });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Erreur d'ajout au panier";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to add item to cart", error);
          return false;
        }
      },

      addItems: async (items: AddToCartData[]) => {
        if (items.length === 0) return true;

        set({ loading: true, error: null });
        try {
          // Ajouter les items un par un car addMultipleToCart n'existe pas
          let cart = get().cart;
          for (const item of items) {
            cart = await cartService.addToCart(item);
          }

          if (!cart) throw new Error("Failed to add items to cart");

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            shippingCost: cart.shippingCost || 0,
            tax: cart.tax || 0,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
          });

          logger.info("Multiple items added to cart", { count: items.length });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Erreur d'ajout au panier";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to add multiple items to cart", error);
          return false;
        }
      },

      updateItem: async (itemId: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
          const cart = await cartService.updateCartItem(itemId, { quantity });

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            shippingCost: cart.shippingCost || 0,
            tax: cart.tax || 0,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
          });

          logger.info("Cart item updated", { itemId, quantity });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Erreur de mise à jour";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to update cart item", error);
          return false;
        }
      },

      removeItem: async (itemId: string) => {
        set({ loading: true, error: null });
        try {
          const cart = await cartService.removeFromCart(itemId);

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            shippingCost: cart.shippingCost || 0,
            tax: cart.tax || 0,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
          });

          logger.info("Cart item removed", { itemId });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Erreur de suppression";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to remove cart item", error);
          return false;
        }
      },

      removeItems: async (itemIds: string[]) => {
        if (itemIds.length === 0) return true;

        set({ loading: true, error: null });
        try {
          // Supprimer les items un par un car removeMultipleFromCart n'existe pas
          let cart = get().cart;
          for (const itemId of itemIds) {
            cart = await cartService.removeFromCart(itemId);
          }

          if (!cart) throw new Error("Failed to remove items from cart");

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            shippingCost: cart.shippingCost || 0,
            tax: cart.tax || 0,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
          });

          logger.info("Multiple cart items removed", { count: itemIds.length });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Erreur de suppression";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to remove multiple cart items", error);
          return false;
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          await cartService.clearCart();

          set({
            cart: null,
            items: [],
            itemCount: 0,
            subtotal: 0,
            total: 0,
            shippingCost: 0,
            tax: 0,
            discount: 0,
            couponDiscount: 0,
            couponCode: null,
            coupon: null,
            selectedItems: [],
            selectAll: false,
            loading: false,
          });

          logger.info("Cart cleared");
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Erreur de vidage du panier";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to clear cart", error);
          return false;
        }
      },

      // ============ SÉLECTION ============

      selectItem: async (itemId: string, selected: boolean) => {
        set({ loading: true });
        try {
          const currentCart = get().cart;
          const item = currentCart?.items.find((i) => i.id === itemId);
          if (!item) throw new Error("Item not found");

          const cart = await cartService.updateCartItem(itemId, {
            quantity: item.quantity,
            selected,
          });

          if (!cart) throw new Error("Failed to update cart item");

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            loading: false,
          });

          // Mettre à jour la sélection
          set((state) => ({
            selectedItems: state.items
              .filter((item) => item.selected)
              .map((item) => item.id),
            selectAll: state.items.every((item) => item.selected),
          }));

          return true;
        } catch (error) {
          set({ loading: false });
          logger.error("Failed to select cart item", error);
          return false;
        }
      },

      selectItems: async (itemIds: string[], selected: boolean) => {
        set({ loading: true });
        try {
          // Sélectionner les items un par un car selectCartItems existe
          let cart = get().cart;
          if (!cart) throw new Error("Cart is empty");

          for (const itemId of itemIds) {
            const item = cart.items.find((i) => i.id === itemId);
            if (!item) continue;

            cart = await cartService.updateCartItem(itemId, {
              quantity: item.quantity,
              selected,
            });
          }

          if (!cart) throw new Error("Failed to update cart items");

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            loading: false,
          });

          // Mettre à jour la sélection
          set((state) => ({
            selectedItems: state.items
              .filter((item) => item.selected)
              .map((item) => item.id),
            selectAll: state.items.every((item) => item.selected),
          }));

          return true;
        } catch (error) {
          set({ loading: false });
          logger.error("Failed to select cart items", error);
          return false;
        }
      },

      selectAllItems: async (selected: boolean) => {
        set({ loading: true });
        try {
          // Sélectionner tous les items un par un
          let cart = get().cart;
          if (!cart) throw new Error("Cart is empty");

          for (const item of cart.items) {
            cart = await cartService.updateCartItem(item.id, {
              quantity: item.quantity,
              selected,
            });
          }

          if (!cart) throw new Error("Failed to update cart items");

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            loading: false,
            selectAll: selected,
            selectedItems: selected ? cart.items.map((item) => item.id) : [],
          });

          return true;
        } catch (error) {
          set({ loading: false });
          logger.error("Failed to select all cart items", error);
          return false;
        }
      },

      toggleSelectAll: async () => {
        const { selectAll } = get();
        return get().selectAllItems(!selectAll);
      },

      // ============ SAUVEGARDE ============

      saveForLater: async (itemId: string) => {
        set({ loading: true });
        try {
          const cart = await cartService.saveForLater(itemId);

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            loading: false,
          });

          await get().getSavedItems();

          logger.info("Item saved for later", { itemId });
          return true;
        } catch (error) {
          set({ loading: false });
          logger.error("Failed to save item for later", error);
          return false;
        }
      },

      moveToCart: async (itemId: string) => {
        set({ loading: true });
        try {
          const cart = await cartService.moveToCart(itemId);

          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            loading: false,
          });

          await get().getSavedItems();

          logger.info("Item moved to cart", { itemId });
          return true;
        } catch (error) {
          set({ loading: false });
          logger.error("Failed to move item to cart", error);
          return false;
        }
      },

      getSavedItems: async () => {
        try {
          const items = await cartService.getSavedItems();
          set({ savedItems: items });
        } catch (error) {
          logger.warn("Failed to get saved items", error);
        }
      },

      // ============ COUPON ============

      applyCoupon: async (code: string) => {
        set({ loading: true, error: null });
        try {
          const cart = await cartService.applyCoupon(code);

          set({
            cart,
            items: cart.items,
            subtotal: cart.subtotal,
            total: cart.total,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: cart.couponCode || null,
            loading: false,
          });

          // Récupérer les détails du coupon
          try {
            const coupon = await cartService.getCouponDetails(code);
            set({ coupon });
          } catch {
            // Ignorer
          }

          logger.info("Coupon applied", { code });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Coupon invalide";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to apply coupon", error);
          return false;
        }
      },

      removeCoupon: async () => {
        set({ loading: true, error: null });
        try {
          const cart = await cartService.removeCoupon();

          set({
            cart,
            items: cart.items,
            subtotal: cart.subtotal,
            total: cart.total,
            discount: cart.discount || 0,
            couponDiscount: cart.couponDiscount || 0,
            couponCode: null,
            coupon: null,
            loading: false,
          });

          logger.info("Coupon removed");
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Erreur de retrait du coupon";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to remove coupon", error);
          return false;
        }
      },

      getAvailableCoupons: async () => {
        try {
          // Récupérer les coupons disponibles via le service
          const coupons = (await cartService.getAvailableCoupons?.()) || [];
          set({ availableCoupons: coupons });
        } catch (error) {
          logger.warn("Failed to get available coupons", error);
        }
      },

      // ============ LIVRAISON ============

      estimateShipping: async (address: {
        city: string;
        state: string;
        country: string;
        postalCode: string;
      }) => {
        set({ loading: true, error: null });
        try {
          const result = await cartService.estimateShipping(address);
          set({
            shippingEstimates: result.options,
            shippingCost: result.cost,
            loading: false,
          });
          return true;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Erreur d'estimation";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to estimate shipping", error);
          return false;
        }
      },

      selectShippingMethod: async (methodId: string) => {
        set({ loading: true, error: null });
        try {
          // Sélectionner la méthode de livraison
          const cart = await cartService.selectShippingMethod(methodId);

          set({
            cart,
            shippingCost: cart.shippingCost || 0,
            total: cart.total,
            selectedShippingMethod: methodId,
            loading: false,
          });

          return true;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Erreur de sélection";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to select shipping method", error);
          return false;
        }
      },

      getShippingOptions: async () => {
        try {
          const options = await cartService.getShippingOptions();
          set({ shippingEstimates: options });
        } catch (error) {
          logger.warn("Failed to get shipping options", error);
        }
      },

      // ============ FUSION ============

      mergeCarts: async (guestCartId: string) => {
        set({ loading: true, error: null });
        try {
          const result = await cartService.mergeCarts(guestCartId);

          const count = result.cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart: result.cart,
            items: result.cart.items,
            itemCount: count,
            subtotal: result.cart.subtotal,
            total: result.cart.total,
            loading: false,
          });

          logger.info("Carts merged", {
            mergedItems: result.mergedItems,
            conflicts: result.conflicts.length,
          });
          return result;
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : "Erreur de fusion";
          set({
            error: message,
            loading: false,
            status: "error",
          });
          logger.error("Failed to merge carts", error);
          return null;
        }
      },

      // ============ GUEST ============

      getGuestCartId: async () => {
        try {
          const id = await cartService.getGuestCartId();
          set({ guestCartId: id });
          return id;
        } catch (error) {
          logger.error("Failed to get guest cart ID", error);
          return "";
        }
      },

      syncCart: async () => {
        set({ loading: true });
        try {
          const cart = await cartService.syncCart(get().cart);
          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
            loading: false,
          });
          logger.info("Cart synced");
        } catch (error) {
          set({ loading: false });
          logger.error("Failed to sync cart", error);
        }
      },

      saveCart: async () => {
        try {
          const cart = await cartService.saveCart();
          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
          });
          logger.info("Cart saved");
        } catch (error) {
          logger.error("Failed to save cart", error);
        }
      },

      loadSavedCart: async () => {
        try {
          const cart = await cartService.loadSavedCart();
          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );
          set({
            cart,
            items: cart.items,
            itemCount: count,
            subtotal: cart.subtotal,
            total: cart.total,
          });
          logger.info("Saved cart loaded");
        } catch (error) {
          logger.error("Failed to load saved cart", error);
        }
      },

      // ============ UI ============

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // ============ WISHLIST ============

      getWishlist: async () => {
        try {
          const items = await cartService.getWishlist();
          return { items, total: items.length };
        } catch (error) {
          logger.error("Failed to get wishlist", error);
          return { items: [], total: 0 };
        }
      },

      addToWishlist: async (productId: string) => {
        try {
          await cartService.addToWishlist(productId);
          logger.info("Added to wishlist", { productId });
          return true;
        } catch (error) {
          logger.error("Failed to add to wishlist", error);
          return false;
        }
      },

      removeFromWishlist: async (productId: string) => {
        try {
          await cartService.removeFromWishlist(productId);
          logger.info("Removed from wishlist", { productId });
          return true;
        } catch (error) {
          logger.error("Failed to remove from wishlist", error);
          return false;
        }
      },

      isInWishlist: async (productId: string) => {
        try {
          return await cartService.isInWishlist(productId);
        } catch (error) {
          logger.error("Failed to check wishlist", error);
          return false;
        }
      },

      // ============ UTILITAIRES ============

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().subtotal;
      },

      getTotal: () => {
        return get().total;
      },

      getItemById: (itemId: string) => {
        return get().items.find((item) => item.id === itemId) || null;
      },

      getItemByProductId: (productId: string) => {
        return get().items.find((item) => item.productId === productId) || null;
      },

      hasItem: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      isEmpty: () => {
        return get().items.length === 0;
      },

      clearError: () => {
        set({ error: null, status: "idle" });
      },

      reset: () => {
        set({
          ...initialState,
          selectedItems: [],
          selectAll: false,
        });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        items: state.items,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
        total: state.total,
        shippingCost: state.shippingCost,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        selectedItems: state.selectedItems,
        selectAll: state.selectAll,
        savedItems: state.savedItems,
        guestCartId: state.guestCartId,
        isOpen: state.isOpen,
      }),
    },
  ),
);

// ============ HOOKS PERSONNALISÉS ============

/**
 * Hook pour utiliser le panier
 */
export const useCart = () => {
  const store = useCartStore();

  // Charger le panier au montage
  React.useEffect(() => {
    if (!store.cart) {
      store.loadCart();
    }
    store.getAvailableCoupons();
    store.getSavedItems();
  }, []);

  return {
    // Données
    cart: store.cart,
    items: store.items,
    itemCount: store.itemCount,
    subtotal: store.subtotal,
    total: store.total,
    loading: store.loading,
    error: store.error,
    coupon: store.coupon,
    couponCode: store.couponCode,
    availableCoupons: store.availableCoupons,
    shippingEstimates: store.shippingEstimates,
    selectedShippingMethod: store.selectedShippingMethod,
    savedItems: store.savedItems,
    isOpen: store.isOpen,
    guestCartId: store.guestCartId,

    // Actions
    addItem: store.addItem,
    addItems: store.addItems,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    removeItems: store.removeItems,
    clearCart: store.clearCart,
    refresh: store.refresh,

    // Sélection
    selectItem: store.selectItem,
    selectItems: store.selectItems,
    selectAllItems: store.selectAllItems,
    toggleSelectAll: store.toggleSelectAll,
    selectedItems: store.selectedItems,
    selectAll: store.selectAll,

    // Coupon
    applyCoupon: store.applyCoupon,
    removeCoupon: store.removeCoupon,

    // Livraison
    estimateShipping: store.estimateShipping,
    selectShippingMethod: store.selectShippingMethod,

    // Sauvegarde
    saveForLater: store.saveForLater,
    moveToCart: store.moveToCart,

    // Fusion
    mergeCarts: store.mergeCarts,

    // Guest
    getGuestCartId: store.getGuestCartId,
    syncCart: store.syncCart,
    saveCart: store.saveCart,
    loadSavedCart: store.loadSavedCart,

    // UI
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,

    // Wishlist
    getWishlist: store.getWishlist,
    addToWishlist: store.addToWishlist,
    removeFromWishlist: store.removeFromWishlist,
    isInWishlist: store.isInWishlist,

    // Utilitaires
    getItemById: store.getItemById,
    getItemByProductId: store.getItemByProductId,
    hasItem: store.hasItem,
    isEmpty: store.isEmpty,
    getItemCount: store.getItemCount,
    getSubtotal: store.getSubtotal,
    getTotal: store.getTotal,
  };
};

/**
 * Hook pour le compteur du panier
 */
export const useCartCount = () => {
  const store = useCartStore();

  React.useEffect(() => {
    store.loadCart();
  }, []);

  return store.itemCount;
};

/**
 * Hook pour le total du panier
 */
export const useCartTotal = () => {
  const store = useCartStore();

  React.useEffect(() => {
    store.loadCart();
  }, []);

  return {
    subtotal: store.subtotal,
    total: store.total,
    shippingCost: store.shippingCost,
    discount: store.discount,
  };
};

/**
 * Hook pour les articles sauvegardés
 */
export const useSavedItems = () => {
  const store = useCartStore();

  React.useEffect(() => {
    store.getSavedItems();
  }, []);

  return {
    items: store.savedItems,
    loading: store.loading,
    moveToCart: store.moveToCart,
    removeItem: store.removeItem,
  };
};

/**
 * Hook pour la wishlist
 */
export const useWishlist = () => {
  const store = useCartStore();
  const [wishlist, setWishlist] = React.useState<{
    items: any[];
    total: number;
  }>({ items: [], total: 0 });
  const [loading, setLoading] = React.useState(false);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const result = await store.getWishlist();
      setWishlist(result);
    } catch (error) {
      logger.error("Failed to load wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadWishlist();
  }, []);

  return {
    items: wishlist.items,
    total: wishlist.total,
    loading,
    addToWishlist: store.addToWishlist,
    removeFromWishlist: store.removeFromWishlist,
    isInWishlist: store.isInWishlist,
    refresh: loadWishlist,
  };
};

/**
 * Hook pour le panier mini
 */
export const useMiniCart = () => {
  const store = useCartStore();

  React.useEffect(() => {
    if (!store.cart) {
      store.loadCart();
    }
  }, []);

  return {
    items: store.items.slice(0, 5),
    itemCount: store.itemCount,
    total: store.total,
    loading: store.loading,
    isOpen: store.isOpen,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    removeItem: store.removeItem,
    updateItem: store.updateItem,
    viewCart: () => {
      store.closeCart();
      // Navigation vers la page panier
      window.location.href = "/cart";
    },
    checkout: () => {
      store.closeCart();
      window.location.href = "/checkout";
    },
  };
};

// ============ EXPORT ============

export default useCartStore;
