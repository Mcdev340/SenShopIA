"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Loader2, Star, Eye, X } from "lucide-react";
import { useCart, useToast, useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import EmptyState from "@/components/shared/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addItem, getWishlist, removeFromWishlist } = useCart();
  const { success, error: showError } = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>(
    {},
  );
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistData();
    }
  }, [isAuthenticated]);

  const loadWishlistData = async () => {
    setIsLoading(true);
    try {
      const result = await getWishlist();
      setItems(result.items || []);
    } catch (error) {
      showError("Erreur de chargement de la wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setIsAddingToCart({ ...isAddingToCart, [productId]: true });
    try {
      await addItem(productId, undefined, 1);
      success("Produit ajouté au panier");
    } catch (error) {
      showError("Erreur d'ajout au panier");
    } finally {
      setIsAddingToCart({ ...isAddingToCart, [productId]: false });
    }
  };

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId);
      setItems(items.filter((item) => item.id !== productId));
      success("Retiré de la wishlist");
    } catch (error) {
      showError("Erreur de suppression");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddAllToCart = async () => {
    for (const item of items) {
      try {
        await addToCart(item.id, 1);
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
    success("Tous les produits ajoutés au panier");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="Votre wishlist est vide"
        description="Ajoutez vos produits préférés à votre wishlist pour les retrouver plus tard."
        actionText="Découvrir les produits"
        actionLink="/products"
        icon={<Heart className="w-16 h-16 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="w-6 h-6 mr-2 text-red-500 fill-red-500" />
            Ma wishlist
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({items.length} produit{items.length > 1 ? "s" : ""})
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vos produits préférés sauvegardés
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAddAllToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Tout ajouter au panier
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-all group"
          >
            <div className="relative">
              <Link href={`/products/${item.slug}`}>
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                  {item.images && item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Remove button */}
              <button
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id}
                className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                aria-label="Retirer de la wishlist"
              >
                {removingId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
              </button>

              {/* Sale badge */}
              {item.salePrice && item.salePrice < item.price && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                    -{Math.round((1 - item.salePrice / item.price) * 100)}%
                  </span>
                </div>
              )}
            </div>

            <CardBody className="p-4 space-y-2">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>

              {item.rating > 0 && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="ml-1 text-xs text-gray-400">
                    ({item.reviewsCount})
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div>
                  {item.salePrice ? (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(item.salePrice)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAddToCart(item.id)}
                  disabled={isAddingToCart[item.id]}
                >
                  {isAddingToCart[item.id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Ajouter
                    </>
                  )}
                </Button>
                <Link href={`/products/${item.slug}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
function addToCart(_id: any, _arg1: number) {
  throw new Error("Function not implemented.");
}

