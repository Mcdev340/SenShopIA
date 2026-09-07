'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  CreditCard,
  Loader2,
  AlertCircle,
  ChevronRight,
  Tag,
  X,
} from 'lucide-react';
import { useCart, useAuth, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { 
    items, 
    loading, 
    subtotal, 
    total, 
    shippingCost,
    discount,
    couponCode,
    couponDiscount,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    selectItems,
    selectAllItems,
    selectedItems,
    selectAll,
    loadCart,
    isEmpty,
  } = useCart();
  const { success, error: showError } = useToast();

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    setSelectedIds(selectedItems || []);
  }, [selectedItems]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemove = async (itemId: string) => {
    await removeFromCart(itemId);
    success('Article retiré du panier');
  };

  const handleClearCart = async () => {
    if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
      await clearCart();
      success('Panier vidé');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const successResult = await applyCoupon(couponInput.trim().toUpperCase());
      if (successResult) {
        setCouponInput('');
        success('Coupon appliqué avec succès');
      } else {
        setCouponError('Code promo invalide');
      }
    } catch (error) {
      setCouponError('Une erreur est survenue');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    success('Coupon retiré');
  };

  const handleSelectItem = async (itemId: string, selected: boolean) => {
    await selectItems([itemId], selected);
  };

  const handleSelectAll = async (checked: boolean) => {
    await selectAllItems(checked);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isEmpty()) {
    return (
      <EmptyState
        title="Votre panier est vide"
        description="Découvrez nos produits et trouvez ce qui vous plaît."
        actionText="Découvrir les produits"
        actionLink="/products"
        icon={<ShoppingBag className="w-16 h-16 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 text-primary-600" />
          Mon panier
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({itemCount} article{itemCount > 1 ? 's' : ''})
          </span>
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Vider le panier
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sélectionner tout */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Tout sélectionner
              </label>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Articles */}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                className="mt-1"
              />

              {/* Image */}
              <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {item.product.images && item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Informations */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.brand && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.product.brand}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.product.stock <= 5 && item.product.stock > 0 && (
                      <p className="text-xs text-orange-500">
                        Plus que {item.product.stock} en stock
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Résumé de la commande
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Coupon */}
              <div className="space-y-2">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {couponCode}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                        -{formatPrice(couponDiscount)} de réduction
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Code promo"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      disabled={isApplyingCoupon}
                      error={couponError || undefined}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="whitespace-nowrap"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Appliquer'
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Totaux */}
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                  <span className={cn(
                    'font-medium',
                    shippingCost === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                  )}>
                    {shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Réduction</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  TVA incluse
                </p>
              </div>

              {/* Boutons */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Passer à la caisse
              </Button>

              <Link href="/products" className="block">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continuer mes achats
                </Button>
              </Link>
            </CardBody>

            <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="w-full grid grid-cols-3 gap-2 text-center">
                <div>
                  <Truck className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Livraison rapide</p>
                </div>
                <div>
                  <Shield className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paiement sécurisé</p>
                </div>
                <div>
                  <Heart className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Service client</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}