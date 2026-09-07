'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { OrderStatus } from '@/components/orders/OrderStatus';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { 
  ArrowLeft, 
  Truck, 
  CheckCircle, 
  XCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
} from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

export default function DeliveryOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrder, updateOrderStatus, loading } = useOrders();
  const { success, error: showError } = useToast();
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const orderId = params?.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrder();
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

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus as any);
      success('Statut mis à jour');
      await loadOrder();
    } catch (error) {
      showError('Erreur de mise à jour du statut');
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

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Commande non trouvée
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

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
              Livraison #{order.id?.slice(-8) || 'N/A'}
            </h1>
            <div className="flex items-center gap-2">
              <OrderStatus status={order.status} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {order.status === 'pending' && (
            <Button
              onClick={() => handleStatusUpdate('in_progress')}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Truck className="w-4 h-4 mr-2" />}
              Démarrer la livraison
            </Button>
          )}
          {order.status === 'in_progress' && (
            <Button
              variant="success"
              onClick={() => handleStatusUpdate('delivered')}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Marquer comme livrée
            </Button>
          )}
          {order.status === 'pending' && (
            <Button
              variant="danger"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isUpdating}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          )}
        </div>
      </div>

      {/* Informations client */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informations client
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {order.user?.username || 'Client'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {order.user?.email || 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {order.user?.phone || 'N/A'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-gray-700 dark:text-gray-300">
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>
              {order.deliveryInstructions && (
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {order.deliveryInstructions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Suivi */}
      {order.trackingNumber && (
        <OrderTracking
          trackingNumber={order.trackingNumber}
          status={order.status}
          history={order.trackingHistory || []}
          estimatedDelivery={order.estimatedDelivery}
          currentLocation={order.currentLocation}
        />
      )}

      {/* Détails de la commande */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Détails de la commande
          </h3>
        </CardHeader>
        <CardBody className="space-y-3">
          {order.items?.map((item: any, index: number) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.product?.name || 'Produit'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  x{item.quantity}
                </p>
              </div>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
          <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-primary-600 dark:text-primary-400">
                {formatPrice(order.total || 0)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}