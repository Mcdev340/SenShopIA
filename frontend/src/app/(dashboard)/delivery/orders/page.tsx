'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks';
import { OrderList } from '@/components/orders/OrderList';
import { Button } from '@/components/ui/Button';
import { RefreshCw, MapPin, Truck, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardBody } from '@/components/ui/Card';

export default function DeliveryOrdersPage() {
  const router = useRouter();
  const { orders, loadOrders, loading, total, page, totalPages } = useOrders();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadOrders({ page: 1, limit: 20, status: 'pending' });
  }, []);

  const handlePageChange = (newPage: number) => {
    loadOrders({ page: newPage, limit: 20, status: activeTab });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    loadOrders({ page: 1, limit: 20, status: tab });
  };

  const handleRefresh = () => {
    loadOrders({ page: 1, limit: 20, status: activeTab });
    success('Liste actualisée');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes livraisons
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez toutes vos livraisons
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="in_progress">En cours</TabsTrigger>
          <TabsTrigger value="delivered">Livrées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <OrderList
            orders={orders}
            loading={loading}
            total={total}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="compact"
            showFilters={false}
            showSearch={false}
            showPagination={true}
            onOrderClick={(order) => router.push(`/dashboard/delivery/orders/${order.id}`)}
          />
        </TabsContent>

        <TabsContent value="in_progress">
          <OrderList
            orders={orders}
            loading={loading}
            total={total}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="compact"
            showFilters={false}
            showSearch={false}
            showPagination={true}
            onOrderClick={(order) => router.push(`/dashboard/delivery/orders/${order.id}`)}
          />
        </TabsContent>

        <TabsContent value="delivered">
          <OrderList
            orders={orders}
            loading={loading}
            total={total}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="compact"
            showFilters={false}
            showSearch={false}
            showPagination={true}
            onOrderClick={(order) => router.push(`/dashboard/delivery/orders/${order.id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}