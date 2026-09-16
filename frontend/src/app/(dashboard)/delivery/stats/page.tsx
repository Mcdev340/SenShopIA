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
  Truck, 
  CheckCircle, 
  Star, 
  DollarSign,
  Download,
  Award,
} from 'lucide-react';

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '12m', label: '12 derniers mois' },
];

export default function DeliveryStatsPage() {
  const [period, setPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [period]);

  const stats = [
    {
      id: 'total_deliveries',
      title: 'Livraisons totales',
      value: 156,
      icon: <Truck className="w-5 h-5" />,
      trend: 12.5,
      trendLabel: 'vs période précédente',
      color: 'primary' as const,
    },
    {
      id: 'completed',
      title: 'Livrées',
      value: 142,
      icon: <CheckCircle className="w-5 h-5" />,
      trend: 10.2,
      trendLabel: 'vs période précédente',
      color: 'success' as const,
    },
    {
      id: 'rating',
      title: 'Note moyenne',
      value: '4.8',
      icon: <Star className="w-5 h-5" />,
      trend: 0.3,
      trendLabel: 'vs période précédente',
      color: 'warning' as const,
    },
    {
      id: 'earnings',
      title: 'Gains totaux',
      value: '450,000 FCFA',
      icon: <DollarSign className="w-5 h-5" />,
      trend: 15.8,
      trendLabel: 'vs période précédente',
      color: 'success' as const,
    },
  ];

  const deliveriesData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Livraisons',
        data: [12, 15, 18, 14, 20, 8, 5],
        color: '#3B82F6',
      },
    ],
  };

  const earningsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Gains (FCFA)',
        data: [45000, 52000, 60000, 48000, 65000, 32000, 25000],
        color: '#10B981',
      },
    ],
  };

  const ratingsData = {
    labels: ['5★', '4★', '3★', '2★', '1★'],
    datasets: [
      {
        label: 'Avis',
        data: [95, 42, 12, 5, 2],
        color: '#F59E0B',
      },
    ],
  };

  const topPerformances = [
    { day: 'Lundi', deliveries: 12, earnings: 45000 },
    { day: 'Mardi', deliveries: 15, earnings: 52000 },
    { day: 'Mercredi', deliveries: 18, earnings: 60000 },
    { day: 'Jeudi', deliveries: 14, earnings: 48000 },
    { day: 'Vendredi', deliveries: 20, earnings: 65000 },
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
            Mes statistiques
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analysez vos performances de livraison
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
          title="Livraisons effectuées"
          subtitle="Évolution sur la période"
          data={deliveriesData}
          type="bar"
          height={300}
        />
        <ChartCard
          title="Gains"
          subtitle="Revenus sur la période"
          data={earningsData}
          type="line"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Distribution des notes"
          subtitle="Avis clients"
          data={ratingsData}
          type="bar"
          height={300}
        />

        {/* Top Performances */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Meilleures performances
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {topPerformances.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.day}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.deliveries} livraisons
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {(item.earnings / 1000).toLocaleString('fr-FR')}k FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}