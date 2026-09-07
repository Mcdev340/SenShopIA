'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderStatus } from '@/components/orders/OrderStatus';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { OrderInvoice } from '@/components/orders/OrderInvoice';
import { Spinner } from '@/components/ui/Spinner';
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Share2,
  Truck,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardBody } from '@/components/ui/Card';

export default function AdminOrderDetailPage() {
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

  const statusActions = [
    { label: 'Confirmer', value: 'confirmed', icon: CheckCircle },
    { label: 'Traiter', value: 'processing', icon: Loader2 },
    { label: 'Expédier', value: 'shipped', icon: Truck },
    { label: 'Livrer', value: 'delivered', icon: CheckCircle },
    { label: 'Annuler', value: 'cancelled', icon: XCircle },
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
            <div className="flex items-center gap-2">
              <OrderStatus status={order.status} size="sm" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
          <Button
            size="sm"
            onClick={loadOrder}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Actions sur le statut */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Changer le statut :
            </span>
            {statusActions.map((action) => (
              <Button
                key={action.value}
                variant="outline"
                size="sm"
                disabled={isUpdating || order.status === action.value}
                onClick={() => handleStatusUpdate(action.value)}
                className="capitalize"
              >
                <action.icon className="w-4 h-4 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Détails de la commande */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="tracking">Suivi</TabsTrigger>
          <TabsTrigger value="invoice">Facture</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <OrderCard order={order} showActions={false} />
        </TabsContent>

        <TabsContent value="tracking">
          {order.trackingNumber ? (
            <OrderTracking
              trackingNumber={order.trackingNumber}
              status={order.status}
              history={order.trackingHistory || []}
              estimatedDelivery={order.estimatedDelivery}
              currentLocation={order.currentLocation}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Aucune information de suivi disponible
              </p>
            </div>
          )}
        </TabsContent>

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
    </div>
  );
}