'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ChartCard from '@/components/dashboard/ChartCard';
import { 
  Star,  
  ThumbsUp, 
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  MessageCircle,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '12m', label: '12 derniers mois' },
];

const mockFeedbacks = [
  { id: '1', customer: 'Jean Dupont', rating: 5, comment: 'Excellent service, très rapide !', date: new Date(Date.now() - 3600000), category: 'Service' },
  { id: '2', customer: 'Marie Diop', rating: 4, comment: 'Bon service, j\'aurais aimé plus de rapidité.', date: new Date(Date.now() - 7200000), category: 'Livraison' },
  { id: '3', customer: 'Oumar Fall', rating: 5, comment: 'Parfait, je recommande !', date: new Date(Date.now() - 10800000), category: 'Service' },
  { id: '4', customer: 'Aminata Sow', rating: 2, comment: 'Problème de communication avec le support.', date: new Date(Date.now() - 14400000), category: 'Support' },
  { id: '5', customer: 'Moussa Kane', rating: 5, comment: 'Très satisfait de ma commande.', date: new Date(Date.now() - 18000000), category: 'Produit' },
  { id: '6', customer: 'Fatou Ba', rating: 4, comment: 'Bon rapport qualité-prix.', date: new Date(Date.now() - 21600000), category: 'Produit' },
  { id: '7', customer: 'Ibrahima Ndiaye', rating: 5, comment: 'Service client au top !', date: new Date(Date.now() - 25200000), category: 'Support' },
  { id: '8', customer: 'Awa Sall', rating: 3, comment: 'Correct mais peut mieux faire.', date: new Date(Date.now() - 28800000), category: 'Livraison' },
];

export default function AdvisorSatisfactionPage() {
  const [period, setPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks] = useState(mockFeedbacks);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [period]);

  // Calculs
  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  const totalFeedbacks = feedbacks.length;
  const positiveFeedbacks = feedbacks.filter(f => f.rating >= 4).length;
  const negativeFeedbacks = feedbacks.filter(f => f.rating <= 2).length;

  // Distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: (feedbacks.filter(f => f.rating === rating).length / totalFeedbacks) * 100,
  }));

  const stats = [
    {
      id: 'average',
      title: 'Note moyenne',
      value: averageRating.toFixed(1),
      icon: <Star className="w-5 h-5" />,
      trend: 0.3,
      trendLabel: 'vs période précédente',
      color: 'warning' as const,
    },
    {
      id: 'total',
      title: 'Total avis',
      value: totalFeedbacks,
      icon: <MessageCircle className="w-5 h-5" />,
      trend: 12.5,
      trendLabel: 'vs période précédente',
      color: 'primary' as const,
    },
    {
      id: 'positive',
      title: 'Avis positifs',
      value: `${Math.round((positiveFeedbacks / totalFeedbacks) * 100)}%`,
      icon: <ThumbsUp className="w-5 h-5" />,
      trend: 5.2,
      trendLabel: 'vs période précédente',
      color: 'success' as const,
    },
    {
      id: 'negative',
      title: 'Avis négatifs',
      value: `${Math.round((negativeFeedbacks / totalFeedbacks) * 100)}%`,
      icon: <ThumbsDown className="w-5 h-5" />,
      trend: -3.1,
      trendLabel: 'vs période précédente',
      color: 'danger' as const,
    },
  ];

  const satisfactionData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Note moyenne',
        data: [4.2, 4.4, 4.3, 4.5, 4.6, 4.5],
        color: '#F59E0B',
      },
    ],
  };

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <Smile className="w-5 h-5 text-green-500" />;
    if (rating === 3) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating === 3) return 'text-yellow-500';
    return 'text-red-500';
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
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Satisfaction client
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analysez la satisfaction de vos clients
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
          title="Évolution de la satisfaction"
          subtitle="Note moyenne sur la période"
          data={satisfactionData}
          type="line"
          height={300}
        />

        {/* Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Distribution des notes
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.rating}
                  </span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      item.rating >= 4 ? 'bg-green-500' :
                      item.rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-right w-16">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.count}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({Math.round(item.percentage)}%)
                  </span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Feedback récents */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Avis récents
          </h3>
        </CardHeader>
        <CardBody className="space-y-3">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getRatingIcon(feedback.rating)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {feedback.customer}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-3 h-3',
                          star <= feedback.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn('text-sm font-medium', getRatingColor(feedback.rating))}>
                    {feedback.rating}/5
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {feedback.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  "{feedback.comment}"
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {feedback.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}