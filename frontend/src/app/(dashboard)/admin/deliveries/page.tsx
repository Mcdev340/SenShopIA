'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import StatsGrid from '@/components/dashboard/StatsGrid';
import { 
  Truck, 
  Search, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle,
  XCircle,
  User,
  Eye,
  Filter,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'failed';
  agentName?: string;
  estimatedDelivery: Date;
  createdAt: Date;
  amount: number;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'DEL-001',
    orderId: 'ORD-1234',
    customerName: 'Jean Dupont',
    customerPhone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    status: 'in_progress',
    agentName: 'Moussa Kane',
    estimatedDelivery: new Date(Date.now() + 3600000),
    createdAt: new Date(Date.now() - 7200000),
    amount: 125000,
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-1235',
    customerName: 'Marie Diop',
    customerPhone: '+221 77 234 56 78',
    address: 'Thiès, Sénégal',
    status: 'assigned',
    agentName: 'Oumar Fall',
    estimatedDelivery: new Date(Date.now() + 7200000),
    createdAt: new Date(Date.now() - 3600000),
    amount: 75000,
  },
  {
    id: 'DEL-003',
    orderId: 'ORD-1236',
    customerName: 'Oumar Sy',
    customerPhone: '+221 77 345 67 89',
    address: 'Saint-Louis, Sénégal',
    status: 'delivered',
    agentName: 'Ibrahima Ndiaye',
    estimatedDelivery: new Date(Date.now() - 3600000),
    createdAt: new Date(Date.now() - 86400000),
    amount: 250000,
  },
  {
    id: 'DEL-004',
    orderId: 'ORD-1237',
    customerName: 'Aminata Sow',
    customerPhone: '+221 77 456 78 90',
    address: 'Ziguinchor, Sénégal',
    status: 'pending',
    estimatedDelivery: new Date(Date.now() + 14400000),
    createdAt: new Date(Date.now() - 1800000),
    amount: 45000,
  },
  {
    id: 'DEL-005',
    orderId: 'ORD-1238',
    customerName: 'Moussa Diallo',
    customerPhone: '+221 77 567 89 01',
    address: 'Touba, Sénégal',
    status: 'failed',
    agentName: 'Fatou Ba',
    estimatedDelivery: new Date(Date.now() - 7200000),
    createdAt: new Date(Date.now() - 172800000),
    amount: 180000,
  },
];

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'assigned', label: 'Assignée' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'failed', label: 'Échouée' },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  assigned: { label: 'Assignée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: User },
  in_progress: { label: 'En cours', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  failed: { label: 'Échouée', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

export default function AdminDeliveriesPage() {
  const router = useRouter();
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = deliveries.filter(
      (d) =>
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter) {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    setFilteredDeliveries(filtered);
  }, [searchQuery, statusFilter, deliveries]);

  const stats = [
    {
      id: 'total',
      title: 'Total livraisons',
      value: deliveries.length,
      icon: <Truck className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'pending',
      title: 'En attente',
      value: deliveries.filter(d => d.status === 'pending').length,
      icon: <Clock className="w-5 h-5" />,
      color: 'warning' as const,
    },
    {
      id: 'in_progress',
      title: 'En cours',
      value: deliveries.filter(d => d.status === 'in_progress' || d.status === 'assigned').length,
      icon: <Truck className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'delivered',
      title: 'Livrées',
      value: deliveries.filter(d => d.status === 'delivered').length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'success' as const,
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleViewDelivery = (id: string) => {
    router.push(`/dashboard/admin/deliveries/${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Truck className="w-6 h-6 mr-2 text-primary-600" />
            Livraisons
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez toutes les livraisons de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} columns={4} />

      {/* Filtres */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par client, ID, commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48"
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Liste */}
      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredDeliveries.length === 0 ? (
            <EmptyState
              title="Aucune livraison"
              description={searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune livraison disponible'}
              icon={<Truck className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Adresse</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Livreur</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Statut</th>
                    <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((delivery) => {
                    const config = statusConfig[delivery.status];
                    const Icon = config.icon;
                    return (
                      <tr
                        key={delivery.id}
                        className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {delivery.id}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {delivery.customerName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {delivery.customerPhone}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">{delivery.address}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {delivery.agentName || 'Non assigné'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={cn('flex items-center gap-1 w-fit', config.color)}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDelivery(delivery.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}