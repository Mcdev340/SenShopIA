'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ChartCard from '@/components/dashboard/ChartCard';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Eye,
  MousePointer,
  Download,
  RefreshCw,
} from 'lucide-react';

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '12m', label: '12 derniers mois' },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [period]);

  const stats = [
    {
      id: 'visitors',
      title: 'Visiteurs',
      value: '12,450',
      icon: <Users className="w-5 h-5" />,
      trend: 15.3,
      trendLabel: 'vs période précédente',
      color: 'primary' as const,
    },
    {
      id: 'pageviews',
      title: 'Pages vues',
      value: '45,230',
      icon: <Eye className="w-5 h-5" />,
      trend: 8.7,
      trendLabel: 'vs période précédente',
      color: 'info' as const,
    },
    {
      id: 'conversion',
      title: 'Taux de conversion',
      value: '3.8%',
      icon: <MousePointer className="w-5 h-5" />,
      trend: 0.5,
      trendLabel: 'vs période précédente',
      color: 'success' as const,
    },
    {
      id: 'revenue',
      title: 'Revenus',
      value: '2,450,000 FCFA',
      icon: <DollarSign className="w-5 h-5" />,
      trend: 12.4,
      trendLabel: 'vs période précédente',
      color: 'success' as const,
    },
  ];

  const salesData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Ventes',
        data: [120, 150, 180, 140, 200, 250, 190],
        color: '#3B82F6',
      },
      {
        label: 'Revenus (k)',
        data: [1200, 1500, 1800, 1400, 2000, 2500, 1900],
        color: '#10B981',
      },
    ],
  };

  const trafficData = {
    labels: ['Direct', 'Recherche', 'Social', 'Email', 'Autres'],
    datasets: [
      {
        label: 'Trafic',
        data: [4500, 3200, 2100, 1500, 1150],
        color: '#8B5CF6',
      },
    ],
  };

  const topProducts = [
    { name: 'iPhone 15 Pro Max', views: 15420, sales: 234, revenue: 327600000 },
    { name: 'Samsung Galaxy S24', views: 12350, sales: 189, revenue: 245700000 },
    { name: 'MacBook Pro M3', views: 9800, sales: 145, revenue: 333500000 },
    { name: 'Nike Air Max', views: 8750, sales: 320, revenue: 38400000 },
    { name: 'PlayStation 5', views: 7200, sales: 98, revenue: 49000000 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analyse des performances de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={periodOptions}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-48"
          />
          <Button variant="outline" size="sm">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Ventes et revenus"
          subtitle="Évolution sur la période"
          data={salesData}
          type="area"
          height={300}
        />
        <ChartCard
          title="Sources de trafic"
          subtitle="Répartition par canal"
          data={trafficData}
          type="bar"
          height={300}
        />
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Top 5 des produits
          </h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">#</th>
                  <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-medium">Produit</th>
                  <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-medium">Vues</th>
                  <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-medium">Ventes</th>
                  <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-medium">Revenus</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="py-3 text-gray-900 dark:text-white">{product.name}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                      {product.views.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                      {product.sales}
                    </td>
                    <td className="py-3 text-right font-medium text-green-600 dark:text-green-400">
                      {(product.revenue / 1000).toLocaleString('fr-FR')}k
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}