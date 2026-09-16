'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useOrders, useProducts, useNotifications } from '@/hooks';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ChartCard, { useDefaultChartData } from '@/components/dashboard/ChartCard';
import RecentOrders, { useDefaultOrders } from '@/components/dashboard/RecentOrders';
import QuickActions, { useQuickActions } from '@/components/dashboard/QuickActions';
import RecentActivity, { useDefaultActivities } from '@/components/dashboard/RecentActivity';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign, 
  Truck, 
  MessageCircle,
  Clock,
  Star,
  ArrowRight,
  BarChart3,
  Bell,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { orders, loadOrders, loading: ordersLoading } = useOrders();
  const { products, loadProducts, loading: productsLoading } = useProducts();
  const { unreadCount, loadUnreadCount } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartData = useDefaultChartData();
  const defaultOrders = useDefaultOrders();
  const defaultActivities = useDefaultActivities();
  const quickActions = useQuickActions(user?.role || 'client');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    const loadData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          loadOrders({ limit: 5 }),
          loadProducts({ limit: 5 }),
          loadUnreadCount(),
        ]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Erreur de chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, router, loadOrders, loadProducts, loadUnreadCount]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Erreur">
          {error}
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Alert>
      </div>
    );
  }

  // Statistiques selon le rôle
  const getStatsByRole = () => {
    const role = user?.role || 'client';

    if (role === 'admin') {
      return [
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
          onClick: () => router.push('/dashboard/admin/payments'),
        },
        {
          id: 'users',
          title: 'Utilisateurs',
          value: '856',
          icon: <Users className="w-5 h-5" />,
          trend: 5.7,
          trendLabel: 'vs mois dernier',
          color: 'info' as const,
          onClick: () => router.push('/dashboard/admin/users'),
        },
        {
          id: 'products',
          title: 'Produits',
          value: products?.length || 0,
          icon: <Package className="w-5 h-5" />,
          trend: -2.3,
          trendLabel: 'vs mois dernier',
          color: 'warning' as const,
          onClick: () => router.push('/dashboard/admin/products'),
        },
      ];
    }

    if (role === 'delivery') {
      return [
        {
          id: 'deliveries',
          title: 'Livraisons',
          value: 45,
          icon: <Truck className="w-5 h-5" />,
          trend: 15.2,
          trendLabel: 'vs semaine dernière',
          color: 'primary' as const,
        },
        {
          id: 'rating',
          title: 'Évaluation',
          value: '4.8 ★',
          icon: <Star className="w-5 h-5" />,
          trend: 0.3,
          trendLabel: 'vs mois dernier',
          color: 'success' as const,
        },
        {
          id: 'earnings',
          title: 'Gains',
          value: '125,000 FCFA',
          icon: <DollarSign className="w-5 h-5" />,
          trend: 10.5,
          trendLabel: 'vs mois dernier',
          color: 'success' as const,
        },
        {
          id: 'pending',
          title: 'En attente',
          value: 5,
          icon: <Clock className="w-5 h-5" />,
          color: 'warning' as const,
        },
      ];
    }

    if (role === 'advisor') {
      return [
        {
          id: 'tickets',
          title: 'Tickets',
          value: 28,
          icon: <MessageCircle className="w-5 h-5" />,
          trend: 8.7,
          trendLabel: 'vs semaine dernière',
          color: 'primary' as const,
        },
        {
          id: 'satisfaction',
          title: 'Satisfaction',
          value: '94%',
          icon: <Star className="w-5 h-5" />,
          trend: 2.1,
          trendLabel: 'vs mois dernier',
          color: 'success' as const,
        },
        {
          id: 'response_time',
          title: 'Temps réponse',
          value: '2.4h',
          icon: <Clock className="w-5 h-5" />,
          trend: -15.3,
          trendLabel: 'vs mois dernier',
          color: 'success' as const,
        },
        {
          id: 'open_tickets',
          title: 'Tickets ouverts',
          value: 8,
          icon: <MessageCircle className="w-5 h-5" />,
          color: 'warning' as const,
        },
      ];
    }

    // Client par défaut
    return [
      {
        id: 'orders',
        title: 'Mes commandes',
        value: orders?.length || 0,
        icon: <ShoppingBag className="w-5 h-5" />,
        trend: 5.2,
        trendLabel: 'vs mois dernier',
        color: 'primary' as const,
        onClick: () => router.push('/orders'),
      },
      {
        id: 'spent',
        title: 'Total dépensé',
        value: '1,250,000 FCFA',
        icon: <DollarSign className="w-5 h-5" />,
        trend: 12.8,
        trendLabel: 'vs mois dernier',
        color: 'success' as const,
      },
      {
        id: 'wishlist',
        title: 'Liste de souhaits',
        value: 18,
        icon: <Star className="w-5 h-5" />,
        color: 'warning' as const,
        onClick: () => router.push('/wishlist'),
      },
      {
        id: 'notifications',
        title: 'Notifications',
        value: unreadCount || 0,
        icon: <Bell className="w-5 h-5" />,
        color: 'info' as const,
        onClick: () => router.push('/notifications'),
      },
    ];
  };

  const getDashboardTitle = () => {
    const role = user?.role || 'client';
    if (role === 'admin') return 'Tableau de bord administrateur';
    if (role === 'delivery') return 'Tableau de bord livreur';
    if (role === 'advisor') return 'Tableau de bord conseiller';
    return 'Mon tableau de bord';
  };

  const stats = getStatsByRole();
  const isDashboardLoading = isLoading || ordersLoading || productsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-800 border-0 text-white">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {getDashboardTitle()}
              </h1>
              <p className="text-white/80 mt-1">
                Bonjour {user?.firstName || user?.username || 'Utilisateur'}, bienvenue sur votre espace
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30 border-0"
                onClick={() => router.push('/dashboard/admin/analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary-600 hover:bg-gray-100 border-0"
                onClick={() => router.push('/products')}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Voir les produits
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <StatsGrid stats={stats} loading={isDashboardLoading} />

      {/* Charts et commandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Aperçu des ventes"
            subtitle="Évolution des commandes et revenus"
            data={chartData}
            type="line"
            loading={isDashboardLoading}
          />
        </div>
        <div>
          <RecentOrders
            orders={defaultOrders}
            loading={isDashboardLoading}
            limit={5}
            title="Commandes récentes"
            subtitle="Dernières commandes"
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
            loading={isDashboardLoading}
            limit={5}
            title="Activités récentes"
            subtitle="Dernières actions"
          />
        </div>
      </div>

      {/* Notifications récentes */}
      {unreadCount > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-primary-600" />
                Notifications
                <Badge className="ml-2">{unreadCount}</Badge>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/notifications')}
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vous avez {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
