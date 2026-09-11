'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { 
  Search, 
  Filter, 
  UserPlus, 
  RefreshCw, 
  Edit, 
  Trash2,
  Users,
} from 'lucide-react';
import { useToast } from '@/hooks';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: Date;
}

const mockUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@shopsense.com', phone: '+221 77 000 00 00', role: 'admin', status: 'active', createdAt: new Date('2023-01-15') },
  { id: '2', username: 'jean', email: 'jean@example.com', phone: '+221 77 123 45 67', role: 'client', status: 'active', createdAt: new Date('2023-06-20') },
  { id: '3', username: 'marie', email: 'marie@example.com', phone: '+221 77 234 56 78', role: 'delivery', status: 'active', createdAt: new Date('2023-08-10') },
  { id: '4', username: 'oumar', email: 'oumar@example.com', phone: '+221 77 345 67 89', role: 'advisor', status: 'inactive', createdAt: new Date('2023-09-05') },
  { id: '5', username: 'aminata', email: 'aminata@example.com', phone: '+221 77 456 78 90', role: 'client', status: 'suspended', createdAt: new Date('2023-10-12') },
  { id: '6', username: 'moussa', email: 'moussa@example.com', phone: '+221 77 567 89 01', role: 'client', status: 'active', createdAt: new Date('2023-11-20') },
];

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

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  client: { label: 'Client', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  delivery: { label: 'Livreur', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  advisor: { label: 'Conseiller', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  suspended: { label: 'Suspendu', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (roleFilter) filtered = filtered.filter(u => u.role === roleFilter);
    if (statusFilter) filtered = filtered.filter(u => u.status === statusFilter);
    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      setUsers(users.filter(u => u.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      success('Utilisateur supprimé');
    } catch (error) {
      showError('Erreur de suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary-600" />
            Utilisateurs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button size="sm" onClick={() => router.push('/dashboard/admin/users/new')}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <>
                <Select
                  options={roleOptions}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40"
                />
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
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
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              title="Aucun utilisateur"
              description={searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucun utilisateur disponible'}
              icon={<Users className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Utilisateur</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Rôle</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Inscription</th>
                    <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} alt={user.username} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge className={roleConfig[user.role].color}>
                          {roleConfig[user.role].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig[user.status].color}>
                          {statusConfig[user.status].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteConfirmId(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}