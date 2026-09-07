'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth, useOrders, useProducts, useUI } from '@/hooks';
import { StatsGrid, useDefaultStats } from '@/components/dashboard/StatsGrid';
import { ChartCard, useDefaultChartData } from '@/components/dashboard/ChartCard';
import { RecentOrders, useDefaultOrders } from '@/components/dashboard/RecentOrders';
import { QuickActions, useQuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity, useDefaultActivities } from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, loadOrders, loading: ordersLoading } = useOrders();
  const { products, loadProducts, loading: productsLoading } = useProducts();
  const { success } = useUI();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultStats = useDefaultStats();
  const chartData = useDefaultChartData();
  const defaultOrders = useDefaultOrders();
  const defaultActivities = useDefaultActivities();
  const quickActions = useQuickActions('admin');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadOrders({ limit: 5 }),
          loadProducts({ limit: 5 }),
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Statistiques calculées
  const adminStats = [
    {
      id: 'orders',
      title: 'Commandes',
      value: orders?.length || 0,
      icon: <ShoppingBag className="w-5 h-5" />,
      trend: 12.5,
      trendLabel: 'vs mois dernier',
      color: 'primary' as const,
      onClick: () => router.push('/dashboard/admin/orders'),
    },
    {
      id: 'revenue',
      title: 'Revenus',
      value: '2,450,000 FCFA',
      icon: <DollarSign className="w-5 h-5" />,
      trend: 8.2,
      trendLabel: 'vs mois dernier',
      color: 'success' as const,
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      value: '856',
      icon: <Users className="w-5 h-5" />,
      trend: 5.7,
      trendLabel: 'vs mois dernier',
      color: 'info' as const,
    },
    {
      id: 'products',
      title: 'Produits',
      value: products?.length || 0,
      icon: <Package className="w-5 h-5" />,
      trend: -2.3,
      trendLabel: 'vs mois dernier',
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={adminStats} loading={isLoading} />

      {/* Graphiques et commandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Aperçu des ventes"
            subtitle="Évolution des commandes et revenus"
            data={chartData}
            type="line"
            loading={isLoading}
          />
        </div>
        <div>
          <RecentOrders
            orders={defaultOrders}
            loading={isLoading}
            limit={5}
          />
        </div>
      </div>

      {/* Actions rapides et activités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions
            actions={quickActions}
            title="Actions rapides"
            subtitle="Accédez rapidement aux fonctionnalités principales"
            columns={4}
          />
        </div>
        <div>
          <RecentActivity
            activities={defaultActivities}
            loading={isLoading}
            limit={5}
          />
        </div>
      </div>
    </div>
  );
}