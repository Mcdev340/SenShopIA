'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import StatsGrid from '@/components/dashboard/StatsGrid';
import { 
  MessageCircle, 
  Search, 
  RefreshCw, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Filter,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatRelativeTime, cn } from '@/lib/utils';

interface Ticket {
  id: string;
  customerName: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: Date;
}

const mockTickets: Ticket[] = [
  { id: 'TKT-001', customerName: 'Jean Dupont', subject: 'Problème de paiement', category: 'Paiement', priority: 'high', status: 'open', createdAt: new Date(Date.now() - 1800000) },
  { id: 'TKT-002', customerName: 'Marie Diop', subject: 'Question sur une commande', category: 'Commande', priority: 'medium', status: 'in_progress', assignedTo: 'Awa Ndiaye', createdAt: new Date(Date.now() - 3600000) },
  { id: 'TKT-003', customerName: 'Oumar Sy', subject: 'Demande de retour', category: 'Retour', priority: 'low', status: 'resolved', assignedTo: 'Ibrahima Ba', createdAt: new Date(Date.now() - 7200000) },
  { id: 'TKT-004', customerName: 'Aminata Sow', subject: 'Problème technique', category: 'Technique', priority: 'urgent', status: 'open', createdAt: new Date(Date.now() - 900000) },
  { id: 'TKT-005', customerName: 'Moussa Diallo', subject: 'Information produit', category: 'Produit', priority: 'low', status: 'closed', assignedTo: 'Fatou Sall', createdAt: new Date(Date.now() - 86400000) },
];

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

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Ouvert', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  medium: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  high: { label: 'Élevée', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = tickets.filter(
      (t) =>
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter);
    if (priorityFilter) filtered = filtered.filter(t => t.priority === priorityFilter);
    setFilteredTickets(filtered);
  }, [searchQuery, statusFilter, priorityFilter, tickets]);

  const stats = [
    {
      id: 'total',
      title: 'Total tickets',
      value: tickets.length,
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'open',
      title: 'Ouverts',
      value: tickets.filter(t => t.status === 'open').length,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'danger' as const,
    },
    {
      id: 'in_progress',
      title: 'En cours',
      value: tickets.filter(t => t.status === 'in_progress').length,
      icon: <Clock className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'resolved',
      title: 'Résolus',
      value: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'success' as const,
    },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-primary-600" />
            Support client
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les tickets de support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} columns={4} />

      {/* Filtres */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
                <Select
                  options={priorityOptions}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Liste */}
      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <EmptyState
              title="Aucun ticket"
              description={searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucun ticket disponible'}
              icon={<MessageSquare className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/admin/support/${ticket.id}`)}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {ticket.subject}
                        </p>
                        <Badge className={cn('text-xs', priorityConfig[ticket.priority].color)}>
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>{ticket.customerName}</span>
                        <span>•</span>
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(ticket.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <Badge className={statusConfig[ticket.status].color}>
                      {statusConfig[ticket.status].label}
                    </Badge>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}