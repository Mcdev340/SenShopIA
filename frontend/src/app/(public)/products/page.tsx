"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks";
import ProductList from "@/components/products/ProductList";
import ProductFilters from "@/components/products/ProductFilters";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LoadProductsParams, ProductFilter, SortOption } from "@/types/product";

const filterSections = [
  { id: "category", title: "Catégories", type: "checkbox" as const, options: [{ id: "electronics", label: "Électronique", count: 45 }, { id: "clothing", label: "Vêtements", count: 32 }, { id: "home", label: "Maison", count: 28 }, { id: "beauty", label: "Beauté", count: 15 }, { id: "sports", label: "Sports", count: 20 }] },
  { id: "price", title: "Prix", type: "range" as const, min: 0, max: 500000, step: 10000 },
  { id: "brand", title: "Marques", type: "checkbox" as const, options: [{ id: "apple", label: "Apple", count: 25 }, { id: "samsung", label: "Samsung", count: 20 }, { id: "nike", label: "Nike", count: 15 }, { id: "adidas", label: "Adidas", count: 12 }] },
  { id: "rating", title: "Évaluation", type: "radio" as const, options: [{ id: "4", label: "4★ et plus", count: 30 }, { id: "3", label: "3★ et plus", count: 50 }, { id: "2", label: "2★ et plus", count: 20 }] },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { products, loading, total, page, totalPages, loadProducts, filters, setFilters, resetFilters } = useProducts();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const categoryParam = searchParams?.get("category") || "";

  useEffect(() => {
    const initialFilters: LoadProductsParams = { page: 1, limit: 20 };
    if (categoryParam) initialFilters.category = categoryParam;
    loadProducts(initialFilters);
  }, [categoryParam, loadProducts]);

  const handleFilterChange = (filterId: string, value: unknown) => {
    const filterUpdate = { [filterId]: value } as Partial<ProductFilter>;
    setFilters(filterUpdate);
    loadProducts({ ...filterUpdate, page: 1, limit: 20 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="hidden w-64 shrink-0 md:block">
          <ProductFilters filters={filterSections} selectedFilters={filters} onFilterChange={handleFilterChange} onClearAll={resetFilters} onApply={() => undefined} />
        </aside>
        <div className="flex-1">
          <div className="mb-4 md:hidden"><Button variant="outline" className="w-full" onClick={() => setIsMobileFilterOpen(true)}><SlidersHorizontal className="mr-2 h-4 w-4" />Filtres</Button></div>
          {isMobileFilterOpen && <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900"><div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"><h2 className="text-lg font-semibold">Filtres</h2><button onClick={() => setIsMobileFilterOpen(false)} className="p-2"><X className="h-5 w-5" /></button></div><div className="h-[calc(100%-64px)] overflow-y-auto p-4"><ProductFilters filters={filterSections} selectedFilters={filters} onFilterChange={handleFilterChange} onClearAll={resetFilters} onApply={() => setIsMobileFilterOpen(false)} isMobile /></div></div>}
          <ProductList products={products} loading={loading} total={total} page={page} totalPages={totalPages} variant={viewMode} columns={4} onPageChange={(newPage) => loadProducts({ page: newPage, limit: 20 })} onSearch={(query) => loadProducts({ search: query, page: 1, limit: 20 })} onSortChange={(sort: SortOption) => loadProducts({ sortBy: sort, page: 1, limit: 20 })} onViewChange={setViewMode} showFilters={false} showSearch showPagination />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="container mx-auto px-4 py-8">Chargement des produits...</div>}><ProductsPageContent /></Suspense>;
}
