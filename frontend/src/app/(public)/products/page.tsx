'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductList } from '@/components/products/ProductList';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, X, Grid3X3, List, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { 
    products, 
    loading, 
    total, 
    page, 
    totalPages, 
    loadProducts, 
    filters, 
    setFilters, 
    resetFilters 
  } = useProducts();
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams?.get('category') || '';
  const searchQuery = searchParams?.get('search') || '';

  useEffect(() => {
    const initialFilters: any = { page: 1, limit: 20 };
    if (categoryParam) {
      initialFilters.category = categoryParam;
    }
    if (searchQuery) {
      initialFilters.search = searchQuery;
    }
    loadProducts(initialFilters);
  }, [categoryParam, searchQuery]);

  const handlePageChange = (newPage: number) => {
    loadProducts({ page: newPage, limit: 20 });
  };

  const handleSearch = (query: string) => {
    loadProducts({ search: query, page: 1, limit: 20 });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    loadProducts({ ...newFilters, page: 1, limit: 20 });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    loadProducts({ sortBy: sort, page: 1, limit: 20 });
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setViewMode(view);
  };

  const handleResetFilters = () => {
    resetFilters();
    loadProducts({ page: 1, limit: 20 });
    setIsMobileFilterOpen(false);
  };

  const filterSections = [
    {
      id: 'category',
      title: 'Catégories',
      type: 'checkbox' as const,
      options: [
        { id: 'electronics', label: 'Électronique', count: 45 },
        { id: 'clothing', label: 'Vêtements', count: 32 },
        { id: 'home', label: 'Maison', count: 28 },
        { id: 'beauty', label: 'Beauté', count: 15 },
        { id: 'sports', label: 'Sports', count: 20 },
        { id: 'books', label: 'Livres', count: 18 },
        { id: 'gaming', label: 'Gaming', count: 12 },
        { id: 'automotive', label: 'Automobile', count: 10 },
      ],
    },
    {
      id: 'price',
      title: 'Prix',
      type: 'range' as const,
      min: 0,
      max: 500000,
      step: 10000,
    },
    {
      id: 'brand',
      title: 'Marques',
      type: 'checkbox' as const,
      options: [
        { id: 'apple', label: 'Apple', count: 25 },
        { id: 'samsung', label: 'Samsung', count: 20 },
        { id: 'nike', label: 'Nike', count: 15 },
        { id: 'adidas', label: 'Adidas', count: 12 },
        { id: 'sony', label: 'Sony', count: 10 },
        { id: 'dell', label: 'Dell', count: 8 },
      ],
    },
    {
      id: 'rating',
      title: 'Évaluation',
      type: 'radio' as const,
      options: [
        { id: '4', label: '4★ et plus', count: 30 },
        { id: '3', label: '3★ et plus', count: 50 },
        { id: '2', label: '2★ et plus', count: 20 },
      ],
    },
    {
      id: 'availability',
      title: 'Disponibilité',
      type: 'radio' as const,
      options: [
        { id: 'in_stock', label: 'En stock', count: 80 },
        { id: 'out_of_stock', label: 'Rupture de stock', count: 20 },
        { id: 'preorder', label: 'Précommande', count: 5 },
      ],
    },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Meilleure note' },
    { value: 'popular', label: 'Plus populaires' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {categoryParam ? `Catégorie: ${categoryParam}` : searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les produits'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className={cn(
          'hidden md:block w-64 flex-shrink-0 transition-all duration-300',
          showFilters ? 'w-64' : 'w-0 overflow-hidden'
        )}>
          {showFilters && (
            <ProductFilters
              filters={filterSections}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleResetFilters}
              onApply={() => {}}
              className="sticky top-24"
            />
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewChange('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                  aria-label="Vue en grille"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleViewChange('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  )}
                  aria-label="Vue en liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ProductFilters
                  filters={filterSections}
                  selectedFilters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleResetFilters}
                  onApply={() => setIsMobileFilterOpen(false)}
                  isMobile
                />
              </div>
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aucun produit trouvé</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Essayez de modifier vos critères de recherche
              </p>
              <Button className="mt-4" onClick={handleResetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : viewMode === 'list' ? (
            <ProductList
              products={products}
              loading={loading}
              total={total}
              page={page}
              totalPages={totalPages}
              variant="list"
              onPageChange={handlePageChange}
              showFilters={false}
              showSearch={false}
              showPagination={true}
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                loading={loading}
                columns={4}
              />
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Affichage de {((page - 1) * 20) + 1} à {Math.min(page * 20, total)} sur {total} produits
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {page} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}