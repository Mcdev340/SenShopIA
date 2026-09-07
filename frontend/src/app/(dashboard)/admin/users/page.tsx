'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { Search, Filter, Plus, RefreshCw, MoreVertical, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks';

const roleOptions = [
  { value: '', label: 'Tous les rôles' },
  { value: 'client', label: 'Client' },
  { value: 'admin', label: 'Administrateur' },
  { value: 'delivery', label: 'Livreur' },
  { value: 'advisor', label: 'Conseiller' },
];

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'suspended', label: 'Suspendu' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter, statusFilter, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulation - à remplacer par un vrai appel API
      const mockUsers = [
        { id: '1', username: 'admin', email: 'admin@shopsense.com', role: 'admin', status: 'active', createdAt: new Date() },
        { id: '2', username: 'jean', email: 'jean@example.com', role: 'client', status: 'active', createdAt: new Date() },
        { id: '3', username: 'marie', email: 'marie@example.com', role: 'delivery', status: 'active', createdAt: new Date() },
        { id: '4', username: 'oumar', email: 'oumar@example.com', role: 'advisor', status: 'inactive', createdAt: new Date() },
        { id: '5', username: 'aminata', email: 'aminata@example.com', role: 'client', status: 'suspended', createdAt: new Date() },
      ];
      setUsers(mockUsers);
      setTotal(mockUsers.length);
      setTotalPages(Math.ceil(mockUsers.length / 10));
    } catch (error) {
      showError('Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'info'> = {
      admin: 'danger',
      client: 'default',
      delivery: 'info',
      advisor: 'primary',
    };
    return <Badge variant={variants[role] || 'default'}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'danger' | 'warning'> = {
      active: 'success',
      inactive: 'default',
      suspended: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/dashboard/admin/users/new')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un utilisateur
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
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </CardBody>
      </Card>

      {/* Tableau */}
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date d'inscription</TableCell>
                  <TableCell className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatar}
                          alt={user.username}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} utilisateur{total > 1 ? 's' : ''}
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