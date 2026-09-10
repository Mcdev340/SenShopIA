'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useOrders, useAuth, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { OrderStatus } from '@/components/orders/OrderStatus';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { OrderInvoice } from '@/components/orders/OrderInvoice';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Share2,
  Truck,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  User,
  Phone,
  Loader2,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  FileText,
  MessageCircle,
  Home,
  Building,
  Star,
} from 'lucide-react';
import { formatPrice, formatDate, formatDateTime, cn, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { 
    getOrder, 
    cancelOrder, 
    getOrderStatus, 
    getOrderHistory, 
    getOrderItems,
    loading: ordersLoading 
  } = useOrders();
  const { success, error: showError } = useToast();

  const [order, setOrder] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (orderId && isAuthenticated) {
      loadOrder();
    }
  }, [orderId, isAuthenticated]);

  const loadOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orderData, historyData, itemsData, statusData] = await Promise.all([
        getOrder(orderId),
        getOrderHistory(orderId).catch(() => []),
        getOrderItems(orderId).catch(() => []),
        getOrderStatus(orderId).catch(() => null),
      ]);

      if (orderData) {
        setOrder(orderData);
        setOrderHistory(historyData || []);
        setOrderItems(itemsData || []);
        setOrderStatus(statusData);
      } else {
        setError('Commande non trouvée');
      }
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Erreur de chargement de la commande');
      showError('Erreur de chargement de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      success('Commande annulée avec succès');
      setShowCancelConfirm(false);
      await loadOrder();
    } catch (error) {
      showError('Erreur lors de l\'annulation');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCopyTracking = async () => {
    if (!order?.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setIsCopied(true);
      success('Numéro de suivi copié !');
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = order.trackingNumber;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      success('Numéro de suivi copié !');
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Commande #${order?.id?.slice(-8) || ''}`,
          text: 'Suivez ma commande ShopSense AI',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        success('Lien copié dans le presse-papier');
      }
    } catch {
      // Utilisateur a annulé
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReorder = () => {
    router.push('/products');
  };

  if (isLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Commande non trouvée">
          {error || 'La commande que vous recherchez n\'existe pas ou a été supprimée.'}
          <div className="flex gap-3 mt-4">
            <Button onClick={() => router.push('/orders')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux commandes
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Retour
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed';
  const canTrack = !!order.trackingNumber;
  const canReorder = order.status === 'delivered';
  const items = orderItems.length > 0 ? orderItems : (order.items || []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Commande #{order.id?.slice(-8) || 'N/A'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <OrderStatus status={order.status} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowCancelConfirm(true)}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Annuler
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Statut et résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Statut</p>
            <OrderStatus status={order.status} size="md" />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(order.total || 0)}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Articles</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {items.length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Paiement</p>
            <Badge className={cn(
              order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {order.paymentStatus === 'completed' ? 'Payée' :
               order.paymentStatus === 'pending' ? 'En attente' :
               order.paymentStatus === 'failed' ? 'Échoué' :
               order.paymentStatus === 'refunded' ? 'Remboursée' : 'Inconnu'}
            </Badge>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="items">Articles</TabsTrigger>
          {canTrack && <TabsTrigger value="tracking">Suivi</TabsTrigger>}
          <TabsTrigger value="invoice">Facture</TabsTrigger>
        </TabsList>

        {/* Onglet Détails */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  Adresse de livraison
                </h3>
              </CardHeader>
              <CardBody className="space-y-1 text-gray-600 dark:text-gray-300">
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.shippingAddress?.label || 'Adresse'}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                </p>
                <p>{order.shippingAddress?.state}, {order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && (
                  <p className="flex items-center mt-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {order.shippingAddress.phone}
                  </p>
                )}
                {order.deliveryInstructions && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Instructions de livraison:
                    </p>
                    <p className="text-sm">{order.deliveryInstructions}</p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Informations de paiement */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                  Informations de paiement
                </h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Méthode</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.paymentMethod || 'Non renseigné'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Statut</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(order.subtotal || 0)}
                  </span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Livraison</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(order.shippingCost)}
                    </span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Réduction</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Taxes</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-400" />
                  Notes
                </h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 dark:text-gray-300">{order.notes}</p>
              </CardBody>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Articles */}
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-400" />
                Articles commandés ({items.length})
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucun article dans cette commande
                </p>
              ) : (
                <>
                  {items.map((item: any, index: number) => (
                    <div
                      key={item.id || index}
                      className="flex gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      {/* Image */}
                      <Link href={`/products/${item.product?.slug || '#'}`} className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {item.product?.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product?.name || 'Produit'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product?.slug || '#'}`}>
                          <h4 className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate">
                            {item.product?.name || 'Produit'}
                          </h4>
                        </Link>
                        {item.product?.brand && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.product.brand}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Quantité: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Prix unitaire: {formatPrice(item.price || 0)}
                        </p>
                      </div>

                      {/* Prix total */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Totaux */}
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(order.subtotal || 0)}
                      </span>
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Livraison</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(order.shippingCost)}
                        </span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Réduction</span>
                        <span className="text-green-600 dark:text-green-400">
                          -{formatPrice(order.discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        {formatPrice(order.total || 0)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </TabsContent>

        {/* Onglet Suivi */}
        {canTrack && (
          <TabsContent value="tracking">
            <OrderTracking
              trackingNumber={order.trackingNumber}
              status={order.status}
              history={order.trackingHistory || orderHistory || []}
              estimatedDelivery={order.estimatedDelivery}
              actualDelivery={order.actualDelivery}
              currentLocation={order.currentLocation}
              carrier={order.carrier}
              onRefresh={loadOrder}
            />
          </TabsContent>
        )}

        {/* Onglet Facture */}
        <TabsContent value="invoice">
          <OrderInvoice
            orderId={order.id}
            orderNumber={order.id?.slice(-8) || 'N/A'}
            orderDate={order.createdAt}
            customer={{
              name: order.user?.username || user?.username || 'Client',
              email: order.user?.email || user?.email || 'N/A',
              phone: order.user?.phone || order.shippingAddress?.phone,
              address: order.shippingAddress?.street,
            }}
            items={items.map((item: any) => ({
              id: item.id,
              description: item.product?.name || 'Produit',
              quantity: item.quantity,
              unitPrice: item.price,
              total: (item.price || 0) * (item.quantity || 1),
            }))}
            subtotal={order.subtotal || 0}
            shippingCost={order.shippingCost || 0}
            tax={order.tax || 0}
            discount={order.discount || 0}
            total={order.total || 0}
            paymentMethod={order.paymentMethod || 'Non renseigné'}
            paymentStatus={order.paymentStatus || 'pending'}
          />
        </TabsContent>
      </Tabs>

      {/* Historique des statuts */}
      {orderHistory.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Historique des statuts
              </h3>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {isExpanded && (
            <CardBody className="space-y-3">
              {orderHistory.map((history: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {history.toStatus === 'delivered' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : history.toStatus === 'cancelled' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getStatusLabel(history.toStatus)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(history.createdAt)}
                    </p>
                    {history.note && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                        "{history.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardBody>
          )}
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4">
        {canTrack && (
          <Button
            variant="outline"
            onClick={handleCopyTracking}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                Copié
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copier le numéro de suivi
              </>
            )}
          </Button>
        )}
        {canReorder && (
          <Button variant="outline" onClick={handleReorder}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-commander
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => router.push('/chat')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contacter le support
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/products')}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continuer mes achats
        </Button>
      </div>

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Annuler la commande"
        message="Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible."
        confirmText="Annuler la commande"
        cancelText="Conserver"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}