'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  StarHalf,
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  Clock,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Tag,
  Award,
  RotateCcw,
  CreditCard,
  Package,
  Sparkles,
} from 'lucide-react';
import { useProducts, useCart, useToast, useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { ProductImages } from '@/components/products/ProductImages';
import { ProductPrice } from '@/components/products/ProductPrice';
import { ProductStock } from '@/components/products/ProductStock';
import { ProductRating } from '@/components/products/ProductRating';
import { ProductVariant } from '@/components/products/ProductVariant';
import { ProductReviews } from '@/components/products/ProductReviews';
import { ProductGrid } from '@/components/products/ProductGrid';
import { formatPrice, cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProductBySlug, getRelatedProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useProducts();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        // Charger les produits similaires
        try {
          const related = await getRelatedProducts(data.id);
          setRelatedProducts(related || []);
        } catch (err) {
          console.error('Error loading related products:', err);
        }
      } else {
        setError('Produit non trouvé');
      }
    } catch (error) {
      setError('Erreur de chargement du produit');
      showError('Erreur de chargement du produit');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si le produit est dans la wishlist
  useEffect(() => {
    if (product && isAuthenticated) {
      const checkWishlist = async () => {
        try {
          const inWishlist = await isInWishlist(product.id);
          setIsWishlist(inWishlist);
        } catch {
          setIsWishlist(false);
        }
      };
      checkWishlist();
    }
  }, [product, isAuthenticated]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock <= 0) {
      showError('Ce produit est en rupture de stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      success(`${product.name} ajouté au panier`);
    } catch (error) {
      showError('Erreur d\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      router.push('/login?redirect=/products/' + slug);
      return;
    }

    if (isWishlistLoading) return;
    setIsWishlistLoading(true);
    try {
      if (isWishlist) {
        await removeFromWishlist(product.id);
        setIsWishlist(false);
        success('Retiré de la wishlist');
      } else {
        await addToWishlist(product.id);
        setIsWishlist(true);
        success('Ajouté à la wishlist');
      }
    } catch (error) {
      showError('Erreur lors de l\'opération');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || 'ShopSense AI',
          text: `Découvrez ${product?.name} sur ShopSense AI`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        success('Lien copié dans le presse-papier');
      }
    } catch {
      // Si l'utilisateur annule le partage, on ignore
    }
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
    const variant = product?.variants?.find((v: any) => v.id === variantId);
    if (variant) {
      // Mettre à jour le prix si nécessaire
      // Le prix sera mis à jour via le parent
    }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Spécifications' },
    { id: 'reviews', label: `Avis (${product?.reviewsCount || 0})` },
  ];

  const features = [
    { icon: Truck, label: 'Livraison 24-48h', description: 'Suivi en temps réel' },
    { icon: Shield, label: 'Paiement sécurisé', description: 'Cryptage SSL' },
    { icon: Clock, label: 'Retour 14 jours', description: 'Satisfait ou remboursé' },
    { icon: Award, label: 'Garantie 1 an', description: 'Pièces et main-d\'œuvre' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Produit non trouvé">
          Le produit que vous recherchez n'existe pas ou a été supprimé.
          <div className="flex gap-3 mt-4">
            <Button onClick={() => router.push('/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voir tous les produits
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Retour
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const isOnSale = product.salePrice !== undefined && product.salePrice !== null && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const discountPercentage = isOnSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600 dark:hover:text-primary-400">Produits</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600 dark:hover:text-primary-400">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
      </nav>

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
              {product.stock > 0 ? `${product.stock} disponibles` : 'Rupture de stock'}
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
              <Heart className={cn(
                'w-5 h-5 transition-colors',
                isWishlist && 'fill-red-500 text-red-500'
              )} />
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
              <Badge className="bg-red-500 text-white border-0">
                <Tag className="w-3 h-3 mr-1" />
                -{discountPercentage}% Promo
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-blue-500 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Nouveau
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-purple-500 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Vedette
              </Badge>
            )}
          </div>

          {/* Delivery info */}
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
                  'py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 px-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">
                  Aucune spécification disponible
                </p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <ProductReviews productId={product.id} />
          )}
        </div>
      </div>

      {/* Produits similaires */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Produits similaires
            </h2>
            <Link href="/products">
              <Button variant="outline" size="sm">
                Voir tout
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={relatedProducts} loading={false} columns={4} />
        </div>
      )}
    </div>
  );
}