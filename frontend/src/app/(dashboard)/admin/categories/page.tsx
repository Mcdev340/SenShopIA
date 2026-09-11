'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FolderOpen,
  Package,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { EmptyState } from '@/components';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  isActive: boolean;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Électronique', slug: 'electronics', description: 'Smartphones, ordinateurs, accessoires', productCount: 45, isActive: true },
  { id: '2', name: 'Vêtements', slug: 'clothing', description: 'Mode homme et femme', productCount: 32, isActive: true },
  { id: '3', name: 'Maison', slug: 'home', description: 'Meubles et décoration', productCount: 28, isActive: true },
  { id: '4', name: 'Beauté', slug: 'beauty', description: 'Cosmétiques et soins', productCount: 15, isActive: true },
  { id: '5', name: 'Sports', slug: 'sports', description: 'Équipement sportif', productCount: 20, isActive: true },
  { id: '6', name: 'Livres', slug: 'books', description: 'Livres et magazines', productCount: 18, isActive: true },
  { id: '7', name: 'Gaming', slug: 'gaming', description: 'Consoles et jeux vidéo', productCount: 12, isActive: true },
  { id: '8', name: 'Automobile', slug: 'automotive', description: 'Pièces et accessoires', productCount: 10, isActive: false },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.slug.trim()) newErrors.slug = 'Le slug est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        setCategories(categories.map(c => 
          c.id === editingId ? { ...c, ...formData } : c
        ));
      } else {
        const newCategory: Category = {
          id: `cat_${Date.now()}`,
          ...formData,
          productCount: 0,
        };
        setCategories([...categories, newCategory]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      setCategories(categories.filter(c => c.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', isActive: true });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Tag className="w-6 h-6 mr-2 text-primary-600" />
            Catégories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les catégories de produits
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle catégorie
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <button
              onClick={resetForm}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Électronique"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name,
                        slug: editingId ? formData.slug : generateSlug(name)
                      });
                    }}
                    error={errors.name}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="electronics"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    error={errors.slug}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Input
                  placeholder="Description de la catégorie"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Catégorie active
                </label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {editingId ? 'Mettre à jour' : 'Créer'}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Recherche */}
      <Card>
        <CardBody className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardBody>
      </Card>

      {/* Liste */}
      <Card>
        <CardBody className="p-0">
          {filteredCategories.length === 0 ? (
            <EmptyState
              title="Aucune catégorie"
              description={searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune catégorie disponible'}
              icon={<FolderOpen className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Nom</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Slug</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Produits</th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Statut</th>
                    <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-primary-600" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {category.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                        {category.slug}
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Package className="w-3 h-3" />
                          {category.productCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={category.isActive ? 'success' : 'secondary'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteConfirmId(category.id)}
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

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Supprimer la catégorie"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
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