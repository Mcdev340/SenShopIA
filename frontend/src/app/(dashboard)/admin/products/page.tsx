"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks";
import ProductList from "@/components/products/ProductList";
import { Button } from "@/components/ui/Button";
import { Plus, FileDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks";

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, loadProducts, loading, total, page, totalPages } =
    useProducts();
  const { success } = useToast();

  useEffect(() => {
    loadProducts({ page: 1, limit: 20 });
  }, []);

  const handlePageChange = (newPage: number) => {
    loadProducts({ page: newPage, limit: 20 });
  };

  const handleSearch = (query: string) => {
    loadProducts({ search: query, page: 1, limit: 20 });
  };

  const handleRefresh = () => {
    loadProducts({ page: 1, limit: 20 });
    success("Produits actualisés");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des produits
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez tous les produits de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/admin/products/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      <ProductList
        products={products}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        variant="grid"
        columns={4}
        showFilters={true}
        showSearch={true}
        showPagination={true}
      />
    </div>
  );
}
