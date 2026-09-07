'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Loader2, Star } from 'lucide-react';
import { useCart, useProducts, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { getWishlist, removeFromWishlist } = useProducts();
  const { success, error: showError } = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const result = await getWishlist();
      setItems(result.items || []);
    } catch (error) {
      showError('Erreur de chargement de la wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setIsAddingToCart({ ...isAddingToCart, [productId]: true });
    try {
      await addToCart(productId, 1);
      success('Produit ajouté au panier');
    } catch (error) {
      showError('Erreur d\'ajout au panier');
    } finally {
      setIsAddingToCart({ ...isAddingToCart, [productId]: false });
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      success('Retiré de la wishlist');
      setItems(items.filter(item => item.id !== productId));
    } catch (error) {
      showError('Erreur de suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Votre wishlist est vide"
        description="Ajoutez vos produits préférés à votre wishlist."
        actionText="Découvrir les produits"
        actionLink="/products"
        icon={<Heart className="w-16 h-16 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-500 fill-red-500" />
          Ma wishlist
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({items.length} produit{items.length > 1 ? 's' : ''})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
            <div className="relative">
              <Link href={`/products/${item.slug}`}>
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                  {item.images && item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </Link>
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Retirer de la wishlist"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div className="p-4 space-y-2">
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
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(item.price)}
                </span>
                <Button
                  size="sm"
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
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}