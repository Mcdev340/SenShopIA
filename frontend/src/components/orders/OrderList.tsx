"use client";

import { useState, useCallback } from "react";
import OrderCard from "./OrderCard";
import { Order } from "@/types/order";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import EmptyState from "@/components/shared/EmptyState";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyStateComponent = EmptyState as any;

interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  error?: string | null;
  total?: number;
  page?: number;
  totalPages?: number;
  variant?: "default" | "compact" | "minimal";
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: any) => void;
  onSearch?: (query: string) => void;
  onOrderClick?: (order: Order) => void;
  onOrderTrack?: (order: Order) => void;
  onOrderCancel?: (order: Order) => void;
  onOrderReorder?: (order: Order) => void;
  className?: string;
}

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "processing", label: "En traitement" },
  { value: "shipped", label: "Expédiée" },
  { value: "in_transit", label: "En transit" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
  { value: "returned", label: "Retournée" },
  { value: "refunded", label: "Remboursée" },
];

const sortOptions = [
  { value: "createdAt_desc", label: "Plus récentes" },
  { value: "createdAt_asc", label: "Plus anciennes" },
  { value: "total_desc", label: "Montant décroissant" },
  { value: "total_asc", label: "Montant croissant" },
  { value: "status", label: "Par statut" },
];

export default function OrderList({
  orders,
  loading = false,
  error = null,
  total = 0,
  page = 1,
  totalPages = 1,
  variant = "default",
  showFilters = true,
  showSearch = true,
  showPagination = true,
  onPageChange,
  onFilterChange,
  onSearch,
  onOrderClick,
  onOrderTrack,
  onOrderCancel,
  onOrderReorder,
  className = "",
}: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
      if (onFilterChange) {
        onFilterChange({ status: value || undefined, sort: sortBy });
      }
    },
    [onFilterChange, sortBy],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      if (onFilterChange) {
        onFilterChange({ status: statusFilter || undefined, sort: value });
      }
    },
    [onFilterChange, statusFilter],
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setSortBy("createdAt_desc");
    if (onFilterChange) {
      onFilterChange({});
    }
  }, [onFilterChange]);

  const hasActiveFilters = searchQuery || statusFilter;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-gray-500 dark:text-gray-400">
          Chargement des commandes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyStateComponent
        title={searchQuery ? "Aucun résultat" : "Aucune commande"}
        description={
          searchQuery
            ? `Aucune commande trouvée pour "${searchQuery}"`
            : "Vous n'avez pas encore passé de commande."
        }
        icon={
          searchQuery ? (
            <Search className="w-12 h-12" />
          ) : (
            <ShoppingBag className="w-12 h-12" />
          )
        }
        actionText={
          searchQuery ? "Effacer la recherche" : "Découvrir les produits"
        }
        actionLink={searchQuery ? undefined : "/products"}
        onAction={searchQuery ? clearFilters : undefined}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barre d'outils */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {showSearch && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 bg-primary-600 rounded-full" />
              )}
            </Button>
          )}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {total} commande{total > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Panneau de filtres */}
      {showFilters && showFilterPanel && (
        <Card>
          <CardBody className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut
                </label>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trier par
                </label>
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Liste des commandes */}
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            variant={variant}
            onView={onOrderClick}
            onTrack={onOrderTrack}
            onCancel={onOrderCancel}
            onReorder={onOrderReorder}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {(page - 1) * 20 + 1} à {Math.min(page * 20, total)}{" "}
            sur {total} commandes
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
