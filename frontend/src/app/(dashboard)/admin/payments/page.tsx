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
  CreditCard, 
  Search, 
  RefreshCw, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Filter,
} from 'lucide-react';
import { formatPrice, formatDate, cn } from '@/lib/utils';

interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  transactionId?: string;
}

const mockPayments: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-1234', customerName: 'Jean Dupont', amount: 125000, method: 'Carte bancaire', status: 'completed', createdAt: new Date(Date.now() - 3600000), transactionId: 'TXN-001' },
  { id: 'PAY-002', orderId: 'ORD-1235', customerName: 'Marie Diop', amount: 75000, method: 'Orange Money', status: 'completed', createdAt: new Date(Date.now() - 7200000), transactionId: 'TXN-002' },
  { id: 'PAY-003', orderId: 'ORD-1236', customerName: 'Oumar Sy', amount: 250000, method: 'Carte bancaire', status: 'pending', createdAt: new Date(Date.now() - 10800000), transactionId: 'TXN-003' },
  { id: 'PAY-004', orderId: 'ORD-1237', customerName: 'Aminata Sow', amount: 45000, method: 'Wave', status: 'completed', createdAt: new Date(Date.now() - 14400000), transactionId: 'TXN-004' },
  { id: 'PAY-005', orderId: 'ORD-1238', customerName: 'Moussa Diallo', amount: 180000, method: 'Virement bancaire', status: 'failed', createdAt: new Date(Date.now() - 18000000), transactionId: 'TXN-005' },
];

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'completed', label: 'Complété' },
  { value: 'failed', label: 'Échoué' },
  { value: 'refunded', label: 'Remboursé' },
];

const methodOptions = [
  { value: '', label: 'Toutes les méthodes' },
  { value: 'Carte bancaire', label: 'Carte bancaire' },
  { value: 'Orange Money', label: 'Orange Money' },
  { value: 'Wave', label: 'Wave' },
  { value: 'Free Money', label: 'Free Money' },
  { value: 'Virement bancaire', label: 'Virement bancaire' },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  completed: { label: 'Complété', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  failed: { label: 'Échoué', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  refunded: { label: 'Remboursé', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: CreditCard },
};

export default function AdminPaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = payments.filter(
      (p) =>
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
    if (methodFilter) filtered = filtered.filter(p => p.method === methodFilter);
    setFilteredPayments(filtered);
  }, [searchQuery, statusFilter, methodFilter, payments]);

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      id: 'revenue',
      title: 'Revenus totaux',
      value: formatPrice(totalRevenue),
      icon: <DollarSign className="w-5 h-5" />,
      trend: 12.5,
      trendLabel: 'vs mois dernier',
      color: 'success' as const,
    },
    {
      id: 'transactions',
      title: 'Transactions',
      value: payments.length,
      icon: <CreditCard className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'completed',
      title: 'Complétées',
      value: payments.filter(p => p.status === 'completed').length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'pending',
      title: 'En attente',
      value: payments.filter(p => p.status === 'pending').length,
      icon: <Clock className="w-5 h-5" />,
      color: 'warning' as const,
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-primary-600" />
            Paiements
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez tous les paiements de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
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
                placeholder="Rechercher par client, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
                <Select
                  options={methodOptions}
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full sm:w-48"
                />
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
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
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              title="Aucun paiement"
              description={searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucun paiement disponible'}
              icon={<CreditCard className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Client</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Commande</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Montant</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Méthode</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => {
                    const config = statusConfig[payment.status];
                    const Icon = config.icon;
                    return (
                      <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{payment.id}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{payment.customerName}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{payment.orderId}</td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{formatPrice(payment.amount)}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{payment.method}</td>
                        <td className="py-3 px-4">
                          <Badge className={cn('flex items-center gap-1 w-fit', config.color)}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{formatDate(payment.createdAt)}</td>
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