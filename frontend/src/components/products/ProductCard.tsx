"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Share2,
  Loader2,
  Truck,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCart, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPrice, cn } from "@/lib/utils";

const BadgeComponent = Badge as any;

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "minimal";
  showActions?: boolean;
  showRating?: boolean;
  showStock?: boolean;
  showCategory?: boolean;
  showQuickView?: boolean;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export default function ProductCard({
  product,
  variant = "default",
  showActions = true,
  showRating = true,
  showStock = true,
  showCategory = true,
  showQuickView = true,
  onAddToCart,
  onView: _onView,
  onWishlist,
  onQuickView,
  className = "",
}: ProductCardProps) {
  const { addItem, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart();
  const { success, error: showError } = useToast();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const isOnSale =
    product.salePrice !== undefined &&
    product.salePrice !== null &&
    product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const discountPercentage = isOnSale
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;

  // Vérifier si le produit est dans la wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const inWishlist = await isInWishlist(product.id);
        setIsWishlist(inWishlist);
      } catch {
        setIsWishlist(false);
      }
    };
    checkWishlist();
  }, [product.id, isInWishlist]);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock) {
        showError("Ce produit est en rupture de stock");
        return;
      }

      setIsAddingToCart(true);
      try {
        await addItem(product.id, undefined, 1);
        success("Produit ajouté au panier");
        if (onAddToCart) {
          onAddToCart(product);
        }
      } catch (error) {
        showError("Erreur lors de l'ajout au panier");
      } finally {
        setIsAddingToCart(false);
      }
    },
    [product, addItem, isOutOfStock, success, showError, onAddToCart],
  );

  const handleWishlist = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isWishlistLoading) return;

      setIsWishlistLoading(true);
      try {
        if (isWishlist) {
          await removeFromWishlist(product.id);
          setIsWishlist(false);
          success("Retiré de la wishlist");
        } else {
          await addToWishlist(product.id);
          setIsWishlist(true);
          success("Ajouté à la wishlist");
        }
        if (onWishlist) {
          onWishlist(product);
        }
      } catch (error) {
        showError("Erreur lors de l'opération");
      } finally {
        setIsWishlistLoading(false);
      }
    },
    [
      product,
      addToWishlist,
      removeFromWishlist,
      isWishlist,
      isWishlistLoading,
      success,
      showError,
      onWishlist,
    ],
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onQuickView) {
        onQuickView(product);
      }
    },
    [product, onQuickView],
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.share?.({
          title: product.name,
          text: `Découvrez ${product.name} sur ShopSense AI`,
          url: `${window.location.origin}/products/${product.slug}`,
        });
      } catch {
        navigator.clipboard.writeText(
          `${window.location.origin}/products/${product.slug}`,
        );
        success("Lien copié");
      }
    },
    [product, success],
  );

  // Version minimal
  if (variant === "minimal") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "group block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          className,
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No img
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatPrice(product.finalPrice || product.price)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Version compact
  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-0.5",
          className,
        )}
      >
        <div className="flex gap-3">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No img
              </div>
            )}
            {isOnSale && (
              <BadgeComponent className="absolute top-1 left-1 text-xs bg-red-500 border-0">
                -{discountPercentage}%
              </BadgeComponent>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {showCategory && product.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {product.category.name}
              </p>
            )}
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </p>
            <div className="flex items-center justify-between mt-1">
              <div>
                {isOnSale ? (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {formatPrice(product.salePrice!)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {showRating && product.rating > 0 && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Version par défaut
  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">Pas d'image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && (
              <BadgeComponent className="bg-red-500 text-white border-0 shadow-lg">
                -{discountPercentage}%
              </BadgeComponent>
            )}
            {product.isNew && (
              <BadgeComponent className="bg-blue-500 text-white border-0 shadow-lg">
                Nouveau
              </BadgeComponent>
            )}
            {product.isFeatured && (
              <BadgeComponent className="bg-purple-500 text-white border-0 shadow-lg">
                Vedette
              </BadgeComponent>
            )}
          </div>

          {/* Actions au hover */}
          {showActions && (
            <div
              className={cn(
                "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              {showQuickView && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                  onClick={handleQuickView}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                onClick={handleWishlist}
                disabled={isWishlistLoading}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isWishlist && "fill-red-500 text-red-500",
                  )}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Stock */}
          {showStock && isOutOfStock && (
            <div className="absolute bottom-2 left-2 right-2">
              <BadgeComponent className="w-full justify-center bg-red-500/90 text-white border-0 shadow-lg py-1">
                Rupture de stock
              </BadgeComponent>
            </div>
          )}
          {showStock && isLowStock && !isOutOfStock && (
            <div className="absolute bottom-2 left-2 right-2">
              <BadgeComponent className="w-full justify-center bg-orange-500/90 text-white border-0 shadow-lg py-1">
                Plus que {product.stock} en stock
              </BadgeComponent>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          {/* Catégorie */}
          {showCategory && product.category && (
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {product.category.name}
            </p>
          )}

          {/* Nom */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Description courte */}
          {product.shortDescription && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Prix */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {isOnSale ? (
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(product.salePrice!)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Rating */}
            {showRating && product.rating > 0 && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="ml-1 text-xs text-gray-400">
                  ({product.reviewsCount})
                </span>
              </div>
            )}
          </div>

          {/* Livraison */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Truck className="w-3 h-3 mr-1" />
            <span>Livraison 24-48h</span>
          </div>
        </div>
      </Link>

      {/* Bouton Ajouter au panier */}
      {showActions && !isOutOfStock && (
        <div className="p-4 pt-0">
          <Button
            className="w-full transition-all"
            size="sm"
            disabled={isAddingToCart || isOutOfStock}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ajout...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter au panier
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
