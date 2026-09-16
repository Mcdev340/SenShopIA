'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { useToast } from '@/hooks';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  views: number;
  helpful: number;
}

const categoryOptions = [
  { value: 'general', label: 'Général' },
  { value: 'commandes', label: 'Commandes' },
  { value: 'paiement', label: 'Paiement' },
  { value: 'livraison', label: 'Livraison' },
  { value: 'compte', label: 'Compte' },
  { value: 'technique', label: 'Technique' },
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Comment passer une commande ?',
    answer: 'Ajoutez les produits à votre panier, puis passez à la caisse. Remplissez vos informations de livraison, choisissez votre méthode de paiement, et confirmez la commande.',
    category: 'commandes',
    isActive: true,
    views: 1250,
    helpful: 95,
  },
  {
    id: '2',
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), le Mobile Money (Orange Money, Wave, Free, Expresso), et les virements bancaires.',
    category: 'paiement',
    isActive: true,
    views: 980,
    helpful: 87,
  },
  {
    id: '3',
    question: 'Quels sont les délais de livraison ?',
    answer: 'Les délais de livraison varient selon la provenance du produit. En général, comptez entre 7 et 15 jours ouvrés pour les produits internationaux.',
    category: 'livraison',
    isActive: true,
    views: 850,
    helpful: 78,
  },
  {
    id: '4',
    question: 'Comment suivre ma commande ?',
    answer: 'Vous pouvez suivre votre commande dans la section "Mes commandes". Un numéro de suivi vous sera fourni dès l\'expédition de votre colis.',
    category: 'commandes',
    isActive: true,
    views: 720,
    helpful: 65,
  },
  {
    id: '5',
    question: 'Puis-je annuler ma commande ?',
    answer: 'Oui, vous pouvez annuler votre commande tant qu\'elle n\'est pas encore en cours de traitement. Rendez-vous dans la section "Mes commandes" et cliquez sur "Annuler".',
    category: 'commandes',
    isActive: false,
    views: 450,
    helpful: 42,
  },
];

export default function AdvisorFAQPage() {
  const { success, error: showError } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(mockFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (categoryFilter) {
      filtered = filtered.filter(faq => faq.category === categoryFilter);
    }
    setFilteredFaqs(filtered);
  }, [searchQuery, categoryFilter, faqs]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) newErrors.question = 'La question est requise';
    if (!formData.answer.trim()) newErrors.answer = 'La réponse est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingId) {
        setFaqs(faqs.map(f => 
          f.id === editingId ? { ...f, ...formData } : f
        ));
        success('FAQ mise à jour');
      } else {
        const newFaq: FAQ = {
          id: `faq_${Date.now()}`,
          ...formData,
          views: 0,
          helpful: 0,
        };
        setFaqs([newFaq, ...faqs]);
        success('FAQ créée');
      }
      resetForm();
    } catch (error) {
      showError('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
    });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFaqs(faqs.filter(f => f.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      success('FAQ supprimée');
    } catch (error) {
      showError('Erreur de suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = (id: string) => {
    setFaqs(faqs.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    ));
    success('Statut mis à jour');
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: 'general', isActive: true });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const getCategoryLabel = (value: string) => {
    const option = categoryOptions.find(o => o.value === value);
    return option?.label || value;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <HelpCircle className="w-6 h-6 mr-2 text-primary-600" />
            Gestion des FAQ
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez la foire aux questions
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle FAQ
          </Button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Modifier la FAQ' : 'Nouvelle FAQ'}
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
                  Question <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Comment passer une commande ?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  error={errors.question}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Réponse <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Ajoutez les produits à votre panier..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  error={errors.answer}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Catégorie
                  </label>
                  <Select
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      FAQ active
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
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

      {/* Filtres */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher une FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={[{ value: '', label: 'Toutes les catégories' }, ...categoryOptions]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </CardBody>
      </Card>

      {/* Liste */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredFaqs.length === 0 ? (
        <EmptyState
          title="Aucune FAQ"
          description={searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune FAQ disponible'}
          icon={<HelpCircle className="w-16 h-16 text-gray-400" />}
        />
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <Card key={faq.id} className={cn(!faq.isActive && 'opacity-60')}>
              <CardBody className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      {expandedId === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                    </button>
                    
                    <div className="flex items-center gap-2 mt-2 ml-6 flex-wrap">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {getCategoryLabel(faq.category)}
                      </Badge>
                      <Badge variant={faq.isActive ? 'success' : 'secondary'}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {faq.views} vues • {faq.helpful} utiles
                      </span>
                    </div>

                    {expandedId === faq.id && (
                      <div className="mt-3 ml-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(faq.id)}
                      title={faq.isActive ? 'Désactiver' : 'Activer'}
                    >
                      <Check className={cn('w-4 h-4', faq.isActive && 'text-green-500')} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteConfirmId(faq.id)}
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
        title="Supprimer la FAQ"
        message="Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action est irréversible."
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