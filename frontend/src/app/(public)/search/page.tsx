'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks';
import ProductGrid from '@/components/products/ProductGrid';
import SearchBar from '@/components/shared/SearchBar';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Filter, X } from 'lucide-react';
import ProductFilters from '@/components/products/ProductFilters';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { searchProducts, products, loading, filters, setFilters, resetFilters } = useProducts();
  
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    await searchProducts(query, { page: 1, limit: 20 });
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

  const filterSections = [
    {
      id: 'category',
      title: 'Catégories',
      type: 'checkbox' as const,
      options: [
        { id: 'electronics', label: 'Électronique', count: 45 },
        { id: 'clothing', label: 'Vêtements', count: 32 },
        { id: 'home', label: 'Maison', count: 28 },
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
          <p className="text-gray-500 dark:text-gray-400">
            Recherchez des produits, des marques ou des catégories.
          </p>
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
        <EmptyState
          title={`Aucun résultat pour "${query}"`}
          description="Essayez de modifier vos termes de recherche ou utilisez des mots-clés différents."
          actionText="Effacer la recherche"
          onAction={() => {
            setQuery('');
            router.push('/search');
          }}
        />
        <Alert variant="info" title="Suggestions">
          <ul className="list-disc list-inside space-y-1">
            <li>Vérifiez l'orthographe de votre recherche</li>
            <li>Utilisez des termes plus généraux</li>
            <li>Essayez une catégorie différente</li>
          </ul>
        </Alert>
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
      />

      <div className="flex items-center justify-between mt-6 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {products.length} résultat{products.length > 1 ? 's' : ''} pour "{query}"
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Filtres</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
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

      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
}