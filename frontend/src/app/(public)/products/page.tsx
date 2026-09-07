"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks";
import ProductList from "@/components/products/ProductList";
import ProductFilters from "@/components/products/ProductFilters";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LoadProductsParams, SortOption } from "@/types/product";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const {
    products,
    loading,
    total,
    page,
    totalPages,
    loadProducts,
    filters,
    setFilters,
    resetFilters,
  } = useProducts();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryParam = searchParams?.get("category") || "";

  useEffect(() => {
    const initialFilters: LoadProductsParams = { page: 1, limit: 20 };
    if (categoryParam) {
      initialFilters.category = categoryParam;
    }
    loadProducts(initialFilters);
  }, [categoryParam]);

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

  const handleSortChange = (sort: SortOption) => {
    loadProducts({
      sortBy: sort,
      page: 1,
      limit: 20,
    });
  };

  const handleViewChange = (view: "grid" | "list") => {
    setViewMode(view);
  };

  // Configuration des filtres
  const filterSections = [
    {
      id: "category",
      title: "Catégories",
      type: "checkbox" as const,
      options: [
        { id: "electronics", label: "Électronique", count: 45 },
        { id: "clothing", label: "Vêtements", count: 32 },
        { id: "home", label: "Maison", count: 28 },
        { id: "beauty", label: "Beauté", count: 15 },
        { id: "sports", label: "Sports", count: 20 },
      ],
    },
    {
      id: "price",
      title: "Prix",
      type: "range" as const,
      min: 0,
      max: 500000,
      step: 10000,
    },
    {
      id: "brand",
      title: "Marques",
      type: "checkbox" as const,
      options: [
        { id: "apple", label: "Apple", count: 25 },
        { id: "samsung", label: "Samsung", count: 20 },
        { id: "nike", label: "Nike", count: 15 },
        { id: "adidas", label: "Adidas", count: 12 },
      ],
    },
    {
      id: "rating",
      title: "Évaluation",
      type: "radio" as const,
      options: [
        { id: "4", label: "4★ et plus", count: 30 },
        { id: "3", label: "3★ et plus", count: 50 },
        { id: "2", label: "2★ et plus", count: 20 },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters
            filters={filterSections}
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={resetFilters}
            onApply={() => {}}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Filtres</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
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
                  onClearAll={resetFilters}
                  onApply={() => setIsMobileFilterOpen(false)}
                  isMobile
                />
              </div>
            </div>
          )}

          {/* Product List */}
          <ProductList
            products={products}
            loading={loading}
            total={total}
            page={page}
            totalPages={totalPages}
            variant={viewMode}
            columns={4}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
            showFilters={false}
            showSearch={true}
            showPagination={true}
          />
        </div>
      </div>
    </div>
  );
}
