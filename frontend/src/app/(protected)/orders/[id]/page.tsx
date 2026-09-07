'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders, useToast, useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { OrderStatus } from '@/components/orders/OrderStatus';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { OrderInvoice } from '@/components/orders/OrderInvoice';
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
} from 'lucide-react';
import { formatDate, formatPrice, formatDateTime, cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrder, cancelOrder, getOrderStatus, getOrderHistory, loading } = useOrders();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  const [order, setOrder] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const orderId = params?.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrder();
      loadOrderHistory();
      loadOrderStatus();
    }
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const data = await getOrder(orderId);
      setOrder(data);
    } catch (error) {
      showError('Erreur de chargement de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderHistory = async () => {
    try {
      const history = await getOrderHistory(orderId);
      setOrderHistory(history || []);
    } catch (error) {
      console.error('Erreur de chargement de l\'historique:', error);
    }
  };

  const loadOrderStatus = async () => {
    try {
      const status = await getOrderStatus(orderId);
      setOrderStatus(status);
    } catch (error) {
      console.error('Erreur de chargement du statut:', error);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;

    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      success('Commande annulée');
      await loadOrder();
      await loadOrderStatus();
    } catch (error) {
      showError('Erreur d\'annulation');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCopyTracking = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      success('Numéro de suivi copié');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Commande non trouvée
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          La commande que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button className="mt-4" onClick={() => router.push('/orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux commandes
        </Button>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed';
  const canTrack = order.trackingNumber;

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
              onClick={handleCancel}
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
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
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
              {order.items?.length || 0}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(order.createdAt)}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Détails avec Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="items">Articles</TabsTrigger>
          <TabsTrigger value="tracking">Suivi</TabsTrigger>
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
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && (
                  <p className="flex items-center mt-2">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.shippingAddress.phone}
                  </p>
                )}
                {order.deliveryInstructions && (
                  <p className="flex items-start mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">📝</span>
                    {order.deliveryInstructions}
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Informations client */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  Informations client
                </h3>
              </CardHeader>
              <CardBody className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  {order.user?.username || 'Client'}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {order.user?.email || 'N/A'}
                </p>
                {order.user?.phone && (
                  <p className="text-gray-500 dark:text-gray-400 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.user.phone}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Méthode de paiement:</span> {order.paymentMethod || 'Non renseigné'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Statut du paiement:</span>
                    <Badge className={cn(
                      'ml-2',
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                      {order.paymentStatus === 'completed' ? 'Payée' :
                       order.paymentStatus === 'pending' ? 'En attente' :
                       order.paymentStatus === 'failed' ? 'Échoué' : 'Remboursée'}
                    </Badge>
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                Articles commandés
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.product?.name || 'Produit'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Réf: {item.product?.sku || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantité: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              {/* Totaux */}
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(order.subtotal || 0)}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Livraison</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.shippingCost)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Réduction</span>
                    <span className="text-green-600 dark:text-green-400">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Taxes</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(order.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </TabsContent>

        {/* Onglet Suivi */}
        <TabsContent value="tracking">
          {canTrack ? (
            <OrderTracking
              trackingNumber={order.trackingNumber}
              status={order.status}
              history={order.trackingHistory || []}
              estimatedDelivery={order.estimatedDelivery}
              currentLocation={order.currentLocation}
              onRefresh={loadOrder}
            />
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <Truck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Aucun suivi disponible
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Le suivi de cette commande n'est pas encore disponible.
                </p>
              </CardBody>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Facture */}
        <TabsContent value="invoice">
          <OrderInvoice
            orderId={order.id}
            orderNumber={order.id?.slice(-8) || 'N/A'}
            orderDate={order.createdAt}
            customer={{
              name: order.user?.username || 'Client',
              email: order.user?.email || 'N/A',
              phone: order.user?.phone,
              address: order.shippingAddress?.street,
            }}
            items={order.items?.map((item: any) => ({
              id: item.id,
              description: item.product?.name || 'Produit',
              quantity: item.quantity,
              unitPrice: item.price,
              total: item.price * item.quantity,
            })) || []}
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
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </CardHeader>
          {isExpanded && (
            <CardBody className="space-y-3">
              {orderHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {history.toStatus === 'delivered' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : history.toStatus === 'cancelled' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {history.toStatus === 'pending' && 'Commande créée'}
                      {history.toStatus === 'confirmed' && 'Commande confirmée'}
                      {history.toStatus === 'processing' && 'Commande en traitement'}
                      {history.toStatus === 'shipped' && 'Commande expédiée'}
                      {history.toStatus === 'in_transit' && 'Colis en transit'}
                      {history.toStatus === 'delivered' && 'Commande livrée'}
                      {history.toStatus === 'cancelled' && 'Commande annulée'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(history.createdAt)}
                    </p>
                    {history.note && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
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
            Copier le numéro de suivi
          </Button>
        )}
        {order.status === 'delivered' && (
          <Button
            variant="outline"
          >
            <Package className="w-4 h-4 mr-2" />
            Re-commander
          </Button>
        )}
        <Button
          variant="outline"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contacter le support
        </Button>
      </div>
    </div>
  );
}