"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrders, useAuth } from "@/hooks";
import OrderList from "@/components/orders/OrderList";
import { Spinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/shared/EmptyState";
import { Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card, CardBody } from "@/components/ui/Card";
import type { Order, OrderStatus } from "@/types/order";

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "processing", label: "En traitement" },
  { value: "shipped", label: "Expédiée" },
  { value: "in_transit", label: "En transit" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

const sortOptions = [
  { value: "createdAt_desc", label: "Plus récentes" },
  { value: "createdAt_asc", label: "Plus anciennes" },
  { value: "total_desc", label: "Montant décroissant" },
  { value: "total_asc", label: "Montant croissant" },
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { orders, loading, loadOrders, total, page, totalPages } = useOrders();

  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders({ page: 1, limit: 10 });
    }
  }, [isAuthenticated]);

  const handlePageChange = (newPage: number) => {
    loadOrders({
      page: newPage,
      limit: 10,
      status: (statusFilter as OrderStatus) || undefined,
    });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    loadOrders({
      page: 1,
      limit: 10,
      status: (value as OrderStatus) || undefined,
    });
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    loadOrders({
      page: 1,
      limit: 10,
      status: (statusFilter as OrderStatus) || undefined,
    });
  };

  const handleRefresh = () => {
    loadOrders({
      page: 1,
      limit: 10,
      status: (statusFilter as OrderStatus) || undefined,
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <EmptyState
        title="Aucune commande"
        description="Vous n'avez pas encore passé de commande."
        actionText="Découvrir les produits"
        actionLink="/products"
        icon={<Package className="w-16 h-16 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes commandes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Retrouvez toutes vos commandes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card className="mb-4">
          <CardBody className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Statut
                </label>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trier par
                </label>
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Liste des commandes */}
      <OrderList
        orders={orders}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        variant="default"
        showFilters={false}
        showSearch={false}
        showPagination={true}
        onOrderClick={(order: Order) => router.push(`/orders/${order.id}`)}
      />
    </div>
  );
}
