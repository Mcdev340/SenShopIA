'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { Search, Filter, Plus, RefreshCw, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks';

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'open', label: 'Ouvert' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'resolved', label: 'Résolu' },
  { value: 'closed', label: 'Fermé' },
];

const priorityOptions = [
  { value: '', label: 'Toutes les priorités' },
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Élevée' },
  { value: 'urgent', label: 'Urgente' },
];

export default function AdvisorTicketsPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTickets();
  }, [page, statusFilter, priorityFilter, search]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      // Simulation - à remplacer par un vrai appel API
      const mockTickets = [
        { id: '1', customer: 'Jean Dupont', subject: 'Problème de paiement', status: 'open', priority: 'high', createdAt: new Date() },
        { id: '2', customer: 'Marie Diop', subject: 'Question sur une commande', status: 'in_progress', priority: 'medium', createdAt: new Date() },
        { id: '3', customer: 'Oumar Fall', subject: 'Demande de retour', status: 'resolved', priority: 'low', createdAt: new Date() },
        { id: '4', customer: 'Aminata Sow', subject: 'Problème technique', status: 'open', priority: 'urgent', createdAt: new Date() },
        { id: '5', customer: 'Moussa Kane', subject: 'Information produit', status: 'closed', priority: 'low', createdAt: new Date() },
      ];
      setTickets(mockTickets);
      setTotal(mockTickets.length);
      setTotalPages(Math.ceil(mockTickets.length / 10));
    } catch (error) {
      showError('Erreur de chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'warning' | 'info' | 'success' | 'secondary'> = {
      open: 'danger',
      in_progress: 'info',
      resolved: 'success',
      closed: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'danger' | 'warning' | 'info'> = {
      low: 'default',
      medium: 'warning',
      high: 'danger',
      urgent: 'danger',
    };
    return <Badge variant={variants[priority] || 'default'}>{priority}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des tickets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez tous les tickets de support
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTickets}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/dashboard/advisor/tickets/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau ticket
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un ticket..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </CardBody>
      </Card>

      {/* Liste des tickets */}
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/advisor/tickets/${ticket.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ticket.subject}
                        </p>
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>{ticket.customer}</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} ticket{total > 1 ? 's' : ''}
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}