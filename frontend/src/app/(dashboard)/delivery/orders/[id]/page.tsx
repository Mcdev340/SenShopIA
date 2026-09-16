'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Navigation,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks';

interface DeliveryDetail {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  amount: number;
  items: number;
  createdAt: Date;
  estimatedDelivery: Date;
  notes?: string;
}

const mockDelivery: DeliveryDetail = {
  id: 'DEL-001',
  orderId: 'ORD-1234',
  customerName: 'Jean Dupont',
  customerPhone: '+221 77 123 45 67',
  customerEmail: 'jean@example.com',
  address: '123 Rue de l\'Indépendance, Dakar, Sénégal',
  status: 'pending',
  amount: 125000,
  items: 3,
  createdAt: new Date(Date.now() - 1800000),
  estimatedDelivery: new Date(Date.now() + 3600000),
  notes: 'Appeler avant d\'arriver. Bâtiment B, 3ème étage.',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Livré', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  failed: { label: 'Échoué', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export default function DeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [delivery, setDelivery] = useState<DeliveryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryId = params?.id as string;

  useEffect(() => {
    if (deliveryId) {
      loadDelivery();
    }
  }, [deliveryId]);

  const loadDelivery = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (deliveryId === mockDelivery.id) {
        setDelivery(mockDelivery);
      } else {
        setError('Livraison non trouvée');
      }
    } catch (err) {
      setError('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: DeliveryDetail['status']) => {
    if (!delivery) return;
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDelivery({ ...delivery, status: newStatus });
      success('Statut mis à jour');
    } catch (err) {
      showError('Erreur de mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCallCustomer = () => {
    if (delivery?.customerPhone) {
      window.location.href = `tel:${delivery.customerPhone}`;
    }
  };

  const handleOpenMap = () => {
    if (delivery?.address) {
      const encodedAddress = encodeURIComponent(delivery.address);
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Livraison non trouvée">
          {error || 'Cette livraison n\'existe pas.'}
          <Button className="mt-4" onClick={() => router.push('/dashboard/delivery/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux livraisons
          </Button>
        </Alert>
      </div>
    );
  }

  const config = statusConfig[delivery.status];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Livraison {delivery.id}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={config.color}>{config.label}</Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Commande {delivery.orderId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {delivery.status === 'pending' && (
        <Card>
          <CardBody className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Truck className="w-4 h-4 mr-2" />
                )}
                Démarrer la livraison
              </Button>
              <Button
                variant="outline"
                onClick={handleCallCustomer}
              >
                <Phone className="w-4 h-4 mr-2" />
                Appeler le client
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {delivery.status === 'in_progress' && (
        <Card>
          <CardBody className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="success"
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Marquer comme livré
              </Button>
              <Button
                variant="danger"
                onClick={() => handleStatusUpdate('failed')}
                disabled={isUpdating}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Échec de livraison
              </Button>
              <Button
                variant="outline"
                onClick={handleCallCustomer}
              >
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenMap}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Itinéraire
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Informations client */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-400" />
            Informations client
          </h3>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {delivery.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
              <a
                href={`tel:${delivery.customerPhone}`}
                className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                {delivery.customerPhone}
              </a>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Adresse de livraison</p>
              <p className="font-medium text-gray-900 dark:text-white flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                {delivery.address}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Détails livraison */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-400" />
            Détails de la livraison
          </h3>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Articles</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {delivery.items} article{delivery.items > 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatPrice(delivery.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Créée le</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(delivery.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Livraison estimée</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(delivery.estimatedDelivery)}
              </p>
            </div>
          </div>

          {delivery.notes && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Instructions de livraison:
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {delivery.notes}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Contact */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCallCustomer}>
              <Phone className="w-4 h-4 mr-2" />
              Appeler le client
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/chat')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contacter le support
            </Button>
            <Button variant="outline" onClick={handleOpenMap}>
              <Navigation className="w-4 h-4 mr-2" />
              Ouvrir dans Maps
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}