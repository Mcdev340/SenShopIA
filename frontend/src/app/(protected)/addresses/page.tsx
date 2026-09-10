'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  Home, 
  Building, 
  Phone,
  Loader2,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { UserAddress } from '@/types/user';
import { cn } from '@/lib/utils';

interface AddressFormData {
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  instructions?: string;
}

const initialFormData: AddressFormData = {
  label: '',
  street: '',
  city: '',
  state: '',
  country: 'SN',
  postalCode: '',
  phone: '',
  isDefault: false,
  instructions: '',
};

export default function AddressesPage() {
  const router = useRouter();
  const { 
    user, 
    addresses, 
    loading: authLoading, 
    loadAddresses, 
    createAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAuth();
  const { success, error: showError } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAddressesData();
  }, []);

  const loadAddressesData = async () => {
    setIsLoading(true);
    try {
      await loadAddresses();
    } catch (error) {
      showError('Erreur de chargement des adresses');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) newErrors.label = 'Le libellé est requis';
    if (!formData.street.trim()) newErrors.street = 'La rue est requise';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.state.trim()) newErrors.state = 'La région est requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    else if (!/^(\+?[0-9]{1,3})?[0-9]{9,12}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAddress(editingId, formData);
        success('Adresse mise à jour');
      } else {
        await createAddress(formData);
        success('Adresse ajoutée');
      }
      resetForm();
      await loadAddressesData();
    } catch (error) {
      showError('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
      instructions: address.instructions || '',
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteAddress(deleteConfirmId);
      success('Adresse supprimée');
      setDeleteConfirmId(null);
      await loadAddressesData();
    } catch (error) {
      showError('Erreur de suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      success('Adresse par défaut définie');
      await loadAddressesData();
    } catch (error) {
      showError('Erreur');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-primary-600" />
            Mes adresses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez vos adresses de livraison
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une adresse
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
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
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Libellé <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Maison, Bureau, etc."
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    error={errors.label}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rue / Adresse <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="123 Rue de l'Indépendance"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  error={errors.street}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Dakar"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    error={errors.city}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Région <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Dakar"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    error={errors.state}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Code postal <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="10000"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    error={errors.postalCode}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="77 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors.phone}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instructions de livraison (optionnel)
                </label>
                <Input
                  placeholder="Bâtiment, étage, code..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: !!checked })}
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Définir comme adresse par défaut
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {editingId ? 'Mettre à jour' : 'Ajouter'}
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

      {/* Liste des adresses */}
      {!addresses || addresses.length === 0 ? (
        <EmptyState
          title="Aucune adresse"
          description="Vous n'avez pas encore ajouté d'adresse de livraison."
          actionText="Ajouter une adresse"
          onAction={() => setShowForm(true)}
          icon={<MapPin className="w-16 h-16 text-gray-400" />}
        />
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className={cn(
              'transition-all',
              address.isDefault && 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10'
            )}>
              <CardBody className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        {address.label.toLowerCase().includes('bureau') || address.label.toLowerCase().includes('office') ? (
                          <Building className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <Home className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {address.label}
                      </h3>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-primary-600" />
                          Par défaut
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                      <p>{address.street}</p>
                      <p>{address.postalCode} {address.city}, {address.state}</p>
                      <p>{address.country}</p>
                      <p className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {address.phone}
                      </p>
                      {address.instructions && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                          "{address.instructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        title="Définir par défaut"
                      >
                        <StarOff className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                      onClick={() => setDeleteConfirmId(address.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Supprimer cette adresse"
        message="Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est irréversible."
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