'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import OrderStatus from '@/components/orders/OrderStatus';
import OrderTracking from '@/components/orders/OrderTracking';
import OrderInvoice from '@/components/orders/OrderInvoice';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  ArrowLeft, 
  Printer, 
  Truck,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  MapPin,
  CreditCard,
  Clock,
} from 'lucide-react';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrder, getOrderItems, getOrderHistory, updateOrderStatus } = useOrders();
  const { success, error: showError } = useToast();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orderData, itemsData, historyData] = await Promise.all([
        getOrder(orderId),
        getOrderItems(orderId).catch(() => []),
        getOrderHistory(orderId).catch(() => []),
      ]);

      if (orderData) {
        setOrder(orderData);
        setItems(itemsData || []);
        setHistory(historyData || []);
      } else {
        setError('Commande non trouvée');
      }
    } catch (err) {
      setError('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus as any);
      success('Statut mis à jour');
      await loadOrder();
    } catch (error) {
      showError('Erreur de mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Commande non trouvée">
          {error || 'Cette commande n\'existe pas.'}
          <Button className="mt-4" onClick={() => router.push('/dashboard/admin/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux commandes
          </Button>
        </Alert>
      </div>
    );
  }

  const statusActions = [
    { label: 'Confirmer', value: 'confirmed', icon: CheckCircle, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Traiter', value: 'processing', icon: Loader2, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'Expédier', value: 'shipped', icon: Truck, color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Livrer', value: 'delivered', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Annuler', value: 'cancelled', icon: XCircle, color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
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
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm" onClick={loadOrder}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Actions statut */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Changer le statut :
            </span>
            {statusActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.value}
                  size="sm"
                  disabled={isUpdating || order.status === action.value}
                  onClick={() => handleStatusUpdate(action.value)}
                  className={action.color + ' text-white'}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Infos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
            </div>
            <p className="font-medium text-gray-900 dark:text-white">
              {order.user?.username || 'Client'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {order.user?.email}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Livraison</p>
            </div>
            <p className="text-sm text-gray-900 dark:text-white">
              {order.shippingAddress?.street}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {order.shippingAddress?.city}, {order.shippingAddress?.country}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Paiement</p>
            </div>
            <p className="font-medium text-gray-900 dark:text-white">
              {order.paymentMethod || 'Non renseigné'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {order.paymentStatus || 'pending'}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="items">Articles ({items.length})</TabsTrigger>
          {order.trackingNumber && <TabsTrigger value="tracking">Suivi</TabsTrigger>}
          <TabsTrigger value="invoice">Facture</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Résumé de la commande
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(order.subtotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Livraison</span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(order.shippingCost || 0)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Réduction</span>
                  <span className="text-green-600 dark:text-green-400">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formatPrice(order.total || 0)}
                </span>
              </div>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardBody className="space-y-3">
              {items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product?.name || 'Produit'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      x{item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
        </TabsContent>

        {order.trackingNumber && (
          <TabsContent value="tracking">
            <OrderTracking
              trackingNumber={order.trackingNumber}
              status={order.status}
              history={order.trackingHistory || []}
              estimatedDelivery={order.estimatedDelivery}
              currentLocation={order.currentLocation}
              onRefresh={loadOrder}
            />
          </TabsContent>
        )}

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
            items={items.map((item: any) => ({
              id: item.id,
              description: item.product?.name || 'Produit',
              quantity: item.quantity,
              unitPrice: item.price,
              total: item.price * item.quantity,
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

      {/* Historique */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              Historique
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {history.map((h: any, index: number) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {h.toStatus || h.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(h.createdAt)}
                  </p>
                  {h.note && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                      "{h.note}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}