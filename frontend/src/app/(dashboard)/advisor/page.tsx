'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks';
import StatsGrid, { useAdvisorStats } from '@/components/dashboard/StatsGrid';
import QuickActions, { useQuickActions } from '@/components/dashboard/QuickActions';
import RecentActivity, { useDefaultActivities } from '@/components/dashboard/RecentActivity';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface Ticket {
  id: string;
  customerName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  medium: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  high: { label: 'Élevée', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Ouvert', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
};

export default function AdvisorDashboardPage() {
  const router = useRouter();
  const { loadOrders } = useOrders();

  const [stats] = useState(useAdvisorStats());
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const quickActions = useQuickActions('advisor');
  const activities = useDefaultActivities();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadOrders({ limit: 5 });
        setTickets([
          { id: 'TKT-001', customerName: 'Jean Dupont', subject: 'Problème de paiement', priority: 'high', status: 'open', createdAt: new Date(Date.now() - 1800000) },
          { id: 'TKT-002', customerName: 'Marie Diop', subject: 'Question sur une commande', priority: 'medium', status: 'in_progress', createdAt: new Date(Date.now() - 3600000) },
          { id: 'TKT-003', customerName: 'Oumar Fall', subject: 'Demande de retour', priority: 'low', status: 'resolved', createdAt: new Date(Date.now() - 7200000) },
          { id: 'TKT-004', customerName: 'Aminata Sow', subject: 'Problème technique', priority: 'urgent', status: 'open', createdAt: new Date(Date.now() - 900000) },
        ]);
      } catch (error) {
        console.error('Error loading advisor data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [loadOrders]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={stats} loading={isLoading} />

      {/* Tickets et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tickets récents
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tickets.filter(t => t.status === 'open').length} tickets ouverts
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/advisor/tickets')}
                >
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/advisor/tickets/${ticket.id}`)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {ticket.subject}
                        </p>
                        <Badge className={priorityConfig[ticket.priority].color}>
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {ticket.customerName} • {formatRelativeTime(ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusConfig[ticket.status].color}>
                    {statusConfig[ticket.status].label}
                  </Badge>
                </div>
              ))}
              {tickets.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucun ticket récent
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <QuickActions
            actions={quickActions}
            title="Actions rapides"
            subtitle="Gérez les tickets"
            columns={1}
          />
        </div>
      </div>

      {/* Activités récentes */}
      <RecentActivity
        activities={activities}
        loading={isLoading}
        limit={5}
        title="Activités récentes"
        subtitle="Dernières interactions avec les clients"
      />
    </div>
  );
}