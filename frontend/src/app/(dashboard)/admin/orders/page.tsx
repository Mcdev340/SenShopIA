'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders, useToast } from '@/hooks';
import OrderList from '@/components/orders/OrderList';
import { Button } from '@/components/ui/Button';
import { Plus, FileDown, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { orders, loadOrders, loading, total, page, totalPages } = useOrders();
  const { success } = useToast();

  const [filters, setFilters] = useState({});
  const [setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders({ page: 1, limit: 20 });
  }, [loadOrders]);

  const handlePageChange = (newPage: number) => {
    loadOrders({ page: newPage, limit: 20 });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    loadOrders({ ...newFilters, page: 1, limit: 20 });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadOrders({ search: query, page: 1, limit: 20 });
  };

  const handleRefresh = () => {
    loadOrders({ page: 1, limit: 20 });
    success('Commandes actualisées');
  };

  const handleExport = () => {
    success('Export en cours...');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des commandes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez toutes les commandes de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileDown className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/dashboard/admin/orders/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle commande
          </Button>
        </div>
      </div>

      <OrderList
        orders={orders}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onOrderClick={(order) => router.push(`/dashboard/admin/orders/${order.id}`)}
        variant="default"
        showFilters={true}
        showSearch={true}
        showPagination={true}
      />
    </div>
  );
}