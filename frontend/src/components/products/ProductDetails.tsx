"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Clock,
  ArrowLeft,
  Minus,
  Plus,
  Loader2,
  Tag,
  Award,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCart, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductImages from "./ProductImages";
import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import ProductRating from "./ProductRating";
import ProductVariant from "./ProductVariant";
import ProductReviews from "./ProductReviews";
import { cn } from "@/lib/utils";

const BadgeComponent = Badge as any;

interface ProductDetailsProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product, quantity: number) => void;
  onWishlist?: (product: Product) => void;
  onBack?: () => void;
}

export default function ProductDetails({
  product,
  className = "",
  onAddToCart,
  onWishlist,
  onBack,
}: ProductDetailsProps) {
  const router = useRouter();
  const { addItem, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart();
  const { success, error: showError } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const isOnSale =
    product.salePrice !== undefined &&
    product.salePrice !== null &&
    product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
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

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = useCallback(async () => {
    if (isOutOfStock) {
      showError("Ce produit est en rupture de stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant || undefined, quantity);
      success(`${product.name} ajouté au panier`);
      if (onAddToCart) {
        onAddToCart(product, quantity);
      }
    } catch (error) {
      showError("Erreur lors de l'ajout au panier");
    } finally {
      setIsAddingToCart(false);
    }
  }, [
    product,
    quantity,
    addItem,
    isOutOfStock,
    success,
    showError,
    onAddToCart,
  ]);

  const handleWishlist = useCallback(async () => {
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
  }, [
    product,
    addToWishlist,
    removeFromWishlist,
    isWishlist,
    isWishlistLoading,
    success,
    showError,
    onWishlist,
  ]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share?.({
        title: product.name,
        text: `Découvrez ${product.name} sur ShopSense AI`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      success("Lien copié dans le presse-papier");
    }
  }, [product, success]);

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
    const variant = product.variants?.find((v) => v.id === variantId);
    if (variant) {
      // Mettre à jour le prix si nécessaire
      if (variant.price !== product.price) {
        // Le prix sera mis à jour via le parent
      }
    }
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Spécifications" },
    { id: "reviews", label: `Avis (${product.reviewsCount || 0})` },
  ];

  const features = [
    {
      icon: Truck,
      label: "Livraison 24-48h",
      description: "Suivi en temps réel",
    },
    { icon: Shield, label: "Paiement sécurisé", description: "Cryptage SSL" },
    {
      icon: Clock,
      label: "Retour 14 jours",
      description: "Satisfait ou remboursé",
    },
    {
      icon: Award,
      label: "Garantie 1 an",
      description: "Pièces et main-d'œuvre",
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      {/* Back button */}
      <button
        onClick={onBack || (() => router.back())}
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <ProductImages images={product.images || []} name={product.name} />
        </div>

        {/* Infos */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            {product.category && (
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {product.category.name}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Marque: {product.brand}
              </p>
            )}
          </div>

          {/* Rating */}
          <ProductRating
            rating={product.rating || 0}
            count={product.reviewsCount || 0}
            size="lg"
          />

          {/* Price */}
          <ProductPrice
            price={product.price}
            salePrice={product.salePrice}
            size="lg"
          />

          {/* Stock */}
          <ProductStock stock={product.stock} size="md" />

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <ProductVariant
              variants={product.variants}
              selectedId={selectedVariant}
              onSelect={handleVariantSelect}
            />
          )}

          {/* Quantity */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-2 px-3 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock || isOutOfStock}
                className="p-2 px-3 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {product.stock > 0
                ? `${product.stock} disponibles`
                : "Rupture de stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="flex-1 min-w-[200px]"
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
            <Button
              variant="outline"
              size="lg"
              className="px-4"
              onClick={handleWishlist}
              disabled={isWishlistLoading}
              aria-label="Wishlist"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isWishlist && "fill-red-500 text-red-500",
                )}
              />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-4"
              onClick={handleShare}
              aria-label="Partager"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {isOnSale && (
              <BadgeComponent className="bg-red-500 text-white border-0">
                <Tag className="w-3 h-3 mr-1" />-{discountPercentage}% Promo
              </BadgeComponent>
            )}
            {product.isNew && (
              <BadgeComponent className="bg-blue-500 text-white border-0">
                Nouveau
              </BadgeComponent>
            )}
            {product.isFeatured && (
              <BadgeComponent className="bg-purple-500 text-white border-0">
                Vedette
              </BadgeComponent>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-2">
                  <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {feature.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Livraison estimée */}
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Livraison estimée
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              2-3 jours ouvrés
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.specifications &&
              Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 px-3 border-b border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">
                  Aucune spécification disponible
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && <ProductReviews productId={product.id} />}
        </div>
      </div>
    </div>
  );
}
