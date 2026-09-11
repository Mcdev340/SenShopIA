'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks';
import ProductGrid from '@/components/products/ProductGrid';
import ProductList from '@/components/products/ProductList';
import SearchBar from '@/components/shared/SearchBar';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Filter, X, Grid3X3, List, Search } from 'lucide-react';
import ProductFilters from '@/components/products/ProductFilters';
import { cn } from '@/lib/utils';
import { SortOption, isSortOption } from '@/types/product';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { searchProducts, products, loading, filters, setFilters, resetFilters } = useProducts();
  
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    await searchProducts(query, { page: 1, limit: 20, sortBy });
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters({ ...filters, [filterId]: value });
    searchProducts(query, { ...filters, [filterId]: value, page: 1, limit: 20 });
  };

  const handleClearAll = () => {
    resetFilters();
    searchProducts(query, { page: 1, limit: 20 });
  };

  const handleApplyFilters = () => {
    searchProducts(query, { ...filters, page: 1, limit: 20 });
    setIsFilterOpen(false);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    searchProducts(query, { sortBy: sort, page: 1, limit: 20 });
  };

  const handlePageChange = (newPage: number) => {
    searchProducts(query, { ...filters, page: newPage, limit: 20 });
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
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'newest', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Meilleure note' },
    { value: 'popular', label: 'Plus populaires' },
  ];

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!query) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <SearchBar
          value={query}
          onSearch={handleSearch}
          placeholder="Rechercher un produit..."
          size="lg"
          showButton={true}
          autoFocus={true}
        />
        <div className="mt-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Que recherchez-vous ?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Recherchez des produits, des marques ou des catégories.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['Smartphone', 'Basket', 'Ordinateur', 'T-shirt', 'Montre'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <SearchBar
          value={query}
          onSearch={handleSearch}
          placeholder="Rechercher un produit..."
          size="lg"
          showButton={true}
        />
        <div className="mt-8">
          <EmptyState
            title={`Aucun résultat pour "${query}"`}
            description="Essayez de modifier vos termes de recherche ou utilisez des mots-clés différents."
            actionText="Effacer la recherche"
            onAction={() => {
              setQuery('');
              router.push('/search');
            }}
            icon={<Search className="w-16 h-16 text-gray-400" />}
          />
          <Alert variant="info" title="Suggestions" className="mt-4">
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Vérifiez l'orthographe de votre recherche</li>
              <li>Utilisez des termes plus généraux</li>
              <li>Essayez une catégorie différente</li>
              <li>Consultez nos marques populaires</li>
            </ul>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SearchBar
        value={query}
        onSearch={handleSearch}
        placeholder="Rechercher un produit..."
        size="lg"
        showButton={true}
        className="mb-6"
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters
            filters={filterSections}
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            onApply={() => {}}
            className="sticky top-24"
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {products.length} résultat{products.length > 1 ? 's' : ''} pour "<span className="font-medium text-gray-700 dark:text-gray-300">{query}</span>"
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  if (isSortOption(e.target.value)) {
                    handleSortChange(e.target.value);
                  }
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
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
                  onClick={() => setViewMode('list')}
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
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
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
                  onClearAll={handleClearAll}
                  onApply={handleApplyFilters}
                  isMobile
                />
              </div>
            </div>
          )}

          {/* Products */}
          {viewMode === 'list' ? (
            <ProductList
              products={products}
              loading={loading}
              variant="list"
              showFilters={false}
              showSearch={false}
              showPagination={true}
              onPageChange={handlePageChange}
            />
          ) : (
            <>
              <ProductGrid products={products} loading={loading} columns={4} />
              {/* Pagination - sera gérée par ProductList ou ajoutée ici */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}