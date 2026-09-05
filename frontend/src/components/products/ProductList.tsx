"use client";

import React, { useState, useCallback } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  variant?: "grid" | "list";
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
  className?: string;
}

const sortOptions = [
  { value: "newest", label: "Plus récents" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "rating", label: "Meilleure note" },
  { value: "popular", label: "Plus populaires" },
];

const limitOptions = [
  { value: "12", label: "12" },
  { value: "24", label: "24" },
  { value: "48", label: "48" },
  { value: "96", label: "96" },
];

export default function ProductList({
  products,
  loading = false,
  total = 0,
  page = 1,
  totalPages = 1,
  variant = "grid",
  columns = 4,
  showFilters = true,
  showSearch = true,
  showPagination = true,
  onPageChange,
  onSearch,
  onFilterChange,
  onSortChange,
  onViewChange,
  className = "",
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">(variant);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [limit, setLimit] = useState("20");

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch],
  );

  const handleSort = useCallback(
    (value: string) => {
      setSortBy(value);
      if (onSortChange) {
        onSortChange(value);
      }
    },
    [onSortChange],
  );

  const handleViewChange = useCallback(
    (view: "grid" | "list") => {
      setViewMode(view);
      if (onViewChange) {
        onViewChange(view);
      }
    },
    [onViewChange],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  }, [onSearch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-500 dark:text-gray-400">
          Chargement des produits...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Aucun produit"
        description={
          searchQuery
            ? `Aucun résultat pour "${searchQuery}"`
            : "Aucun produit disponible"
        }
        actionText={
          searchQuery ? "Effacer la recherche" : "Voir tous les produits"
        }
        onAction={searchQuery ? handleClearSearch : undefined}
        actionLink={searchQuery ? undefined : "/products"}
        icon={<div className="text-4xl">{searchQuery ? "🔍" : "📦"}</div>}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {showSearch && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          )}
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="w-40"
          />
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => handleViewChange("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
              )}
              aria-label="Vue en grille"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
              )}
              aria-label="Vue en liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Select
            options={limitOptions}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-20"
          />
          <Badge variant="secondary" className="whitespace-nowrap">
            {total} produits
          </Badge>
        </div>
      </div>

      {/* Products */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="compact"
              showActions={true}
              showRating={true}
              showStock={true}
              showCategory={true}
            />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            columns === 2 && "grid-cols-1 sm:grid-cols-2",
            columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            columns === 4 &&
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              showRating={true}
              showStock={true}
              showCategory={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {(page - 1) * 20 + 1} à {Math.min(page * 20, total)}{" "}
            sur {total} produits
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange && onPageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange && onPageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
