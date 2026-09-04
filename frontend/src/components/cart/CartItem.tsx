'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Heart, AlertCircle } from 'lucide-react';
import { useCart, useProducts, useToast } from '@/hooks';
import { formatPrice, cn } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
  className?: string;
}

export default function CartItem({ item, compact = false, className = '' }: CartItemProps) {
  const { updateQuantity, removeFromCart, saveForLater } = useCart();
  const { addToWishlist } = useProducts();
  const { success, error: showError } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      showError(`Stock disponible: ${product.stock}`);
      return;
    }

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart(item.id);
      success('Produit retiré du panier');
    } catch (error) {
      showError('Erreur lors de la suppression');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleSaveForLater = async () => {
    try {
      await saveForLater(item.id);
      success('Produit sauvegardé pour plus tard');
    } catch (error) {
      showError('Erreur lors de la sauvegarde');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(item.productId);
      success('Ajouté à la liste de souhaits');
    } catch (error) {
      showError('Erreur lors de l\'ajout');
    }
  };

  // Version compacte pour le drawer
  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        isOutOfStock && 'opacity-50',
        className
      )}>
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatPrice(item.price)}
          </p>
          {isLowStock && !isOutOfStock && (
            <p className="text-xs text-orange-500">Plus que {product.stock}</p>
          )}
          {isOutOfStock && (
            <p className="text-xs text-red-500">Rupture de stock</p>
          )}
        </div>

        {/* Quantité */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1 || isOutOfStock}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating || item.quantity >= product.stock || isOutOfStock}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Augmenter la quantité"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Total */}
        <div className="text-right min-w-[60px]">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          aria-label="Supprimer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Version complète
  return (
    <div className={cn(
      'flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow',
      isOutOfStock && 'opacity-60',
      className
    )}>
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded">
                Rupture
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.brand}
              </p>
            )}
          </div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {/* Prix unitaire */}
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {formatPrice(item.price)} / unité
        </p>

        {/* Variant */}
        {item.variant && (
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Variante:</span>
            {Object.entries(item.variant.attributes).map(([key, value]) => (
              <span key={key} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {/* Stock */}
        {isLowStock && !isOutOfStock && (
          <div className="mt-1 flex items-center gap-1 text-xs text-orange-500">
            <AlertCircle className="w-3 h-3" />
            <span>Plus que {product.stock} en stock</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center flex-wrap gap-2">
          {/* Quantité */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1 || isOutOfStock}
              className="p-2 px-3 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Diminuer la quantité"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= product.stock || isOutOfStock}
              className="p-2 px-3 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Augmenter la quantité"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleSaveForLater}
              disabled={isUpdating}
              className="p-2 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors disabled:opacity-50"
              aria-label="Sauvegarder pour plus tard"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="sr-only">Sauvegarder pour plus tard</span>
            </button>
            <button
              onClick={handleAddToWishlist}
              disabled={isUpdating}
              className="p-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors disabled:opacity-50"
              aria-label="Ajouter à la wishlist"
            >
              <Heart className="w-4 h-4" />
              <span className="sr-only">Ajouter à la wishlist</span>
            </button>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors disabled:opacity-50"
              aria-label="Supprimer"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}