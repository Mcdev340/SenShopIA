'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useOrders } from '@/hooks';
import { StatsGrid, useDeliveryStats } from '@/components/dashboard/StatsGrid';
import { QuickActions, useQuickActions } from '@/components/dashboard/QuickActions';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Phone,
  User,
} from 'lucide-react';
import { formatRelativeTime, cn } from '@/lib/utils';

interface Delivery {
  id: string;
  customer: string;
  phone: string;
  address: string;
  status: 'pending' | 'in_progress' | 'completed';
  time: string;
  amount: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Truck },
  completed: { label: 'Livré', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
};

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { loadOrders, loading } = useOrders();

  const [stats] = useState(useDeliveryStats());
  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const quickActions = useQuickActions('delivery');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadOrders({ limit: 5 });
        setDeliveries([
          { id: 'DEL-001', customer: 'Jean Dupont', phone: '+221 77 123 45 67', address: 'Dakar, Sénégal', status: 'pending', time: '10:00', amount: 125000 },
          { id: 'DEL-002', customer: 'Marie Diop', phone: '+221 77 234 56 78', address: 'Thiès, Sénégal', status: 'in_progress', time: '13:30', amount: 75000 },
          { id: 'DEL-003', customer: 'Oumar Fall', phone: '+221 77 345 67 89', address: 'Saint-Louis, Sénégal', status: 'completed', time: '09:00', amount: 250000 },
        ]);
      } catch (error) {
        console.error('Error loading delivery data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [loadOrders]);

  const handleAcceptDelivery = (id: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id ? { ...d, status: 'in_progress' } : d
    ));
  };

  const handleCompleteDelivery = (id: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id ? { ...d, status: 'completed' } : d
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={stats} loading={isLoading} />

      {/* Livraisons du jour et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Livraisons du jour
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {deliveries.length} livraison{deliveries.length > 1 ? 's' : ''} à effectuer
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/delivery/orders')}
                >
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner />
                </div>
              ) : deliveries.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucune livraison aujourd'hui
                </p>
              ) : (
                deliveries.map((delivery) => {
                  const config = statusConfig[delivery.status];
                  const Icon = config.icon;
                  return (
                    <div
                      key={delivery.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {delivery.customer}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {delivery.address}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {delivery.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {delivery.time}
                        </span>
                        <Badge className={cn('flex items-center gap-1', config.color)}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                        {delivery.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleAcceptDelivery(delivery.id)}
                          >
                            Accepter
                          </Button>
                        )}
                        {delivery.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleCompleteDelivery(delivery.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <QuickActions
            actions={quickActions}
            title="Actions rapides"
            subtitle="Gérez vos livraisons"
            columns={1}
          />
        </div>
      </div>
    </div>
  );
}