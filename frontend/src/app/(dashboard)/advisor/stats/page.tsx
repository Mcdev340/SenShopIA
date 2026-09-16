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
  MessageCircle, 
  Clock, 
  CheckCircle, 
  Users,
  Star,
  Download,
} from 'lucide-react';

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '12m', label: '12 derniers mois' },
];

export default function AdvisorStatsPage() {
  const [period, setPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [period]);

  const stats = [
    {
      id: 'total_tickets',
      title: 'Total tickets',
      value: 156,
      icon: <MessageCircle className="w-5 h-5" />,
      trend: 8.5,
      trendLabel: 'vs période précédente',
      color: 'primary' as const,
    },
    {
      id: 'resolved',
      title: 'Tickets résolus',
      value: 128,
      icon: <CheckCircle className="w-5 h-5" />,
      trend: 12.3,
      trendLabel: 'vs période précédente',
      color: 'success' as const,
    },
    {
      id: 'avg_response',
      title: 'Temps réponse moyen',
      value: '2.4h',
      icon: <Clock className="w-5 h-5" />,
      trend: -15.2,
      trendLabel: 'vs période précédente',
      color: 'info' as const,
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction',
      value: '94%',
      icon: <Star className="w-5 h-5" />,
      trend: 2.1,
      trendLabel: 'vs période précédente',
      color: 'warning' as const,
    },
  ];

  const ticketsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Tickets reçus',
        data: [12, 15, 18, 14, 20, 8, 5],
        color: '#3B82F6',
      },
      {
        label: 'Tickets résolus',
        data: [10, 13, 15, 12, 18, 7, 4],
        color: '#10B981',
      },
    ],
  };

  const responseTimeData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Temps de réponse (h)',
        data: [2.5, 2.3, 2.1, 2.4, 2.0, 3.1, 3.5],
        color: '#8B5CF6',
      },
    ],
  };

  const topAdvisors = [
    { name: 'Awa Ndiaye', tickets: 45, resolved: 42, rating: 4.9 },
    { name: 'Ibrahima Ba', tickets: 38, resolved: 35, rating: 4.7 },
    { name: 'Fatou Sall', tickets: 32, resolved: 28, rating: 4.6 },
    { name: 'Moussa Kane', tickets: 25, resolved: 21, rating: 4.5 },
  ];

  const categoriesData = {
    labels: ['Commandes', 'Paiement', 'Livraison', 'Produit', 'Autres'],
    datasets: [
      {
        label: 'Tickets par catégorie',
        data: [52, 38, 28, 24, 14],
        color: '#F59E0B',
      },
    ],
  };

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
            Statistiques
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analysez vos performances
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
          title="Tickets reçus vs résolus"
          subtitle="Évolution sur la période"
          data={ticketsData}
          type="bar"
          height={300}
        />
        <ChartCard
          title="Temps de réponse moyen"
          subtitle="En heures"
          data={responseTimeData}
          type="line"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Tickets par catégorie"
          subtitle="Répartition"
          data={categoriesData}
          type="bar"
          height={300}
        />

        {/* Top Advisors */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-400" />
              Meilleurs conseillers
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {topAdvisors.map((advisor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                      {advisor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {advisor.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {advisor.tickets} tickets • {advisor.resolved} résolus
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {advisor.rating}
                    </span>
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