"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/shared/EmptyState";
import {
  Truck,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  MapPin,
  Filter,
  Download,
} from "lucide-react";
import { formatDate, formatPrice, cn } from "@/lib/utils";

interface HistoryDelivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  status: "completed" | "failed";
  amount: number;
  deliveredAt: Date;
  duration: number;
}

const mockHistory: HistoryDelivery[] = [
  {
    id: "DEL-003",
    orderId: "ORD-1236",
    customerName: "Oumar Fall",
    address: "Saint-Louis, Sénégal",
    status: "completed",
    amount: 250000,
    deliveredAt: new Date(Date.now() - 86400000),
    duration: 45,
  },
  {
    id: "DEL-004",
    orderId: "ORD-1237",
    customerName: "Aminata Sow",
    address: "Ziguinchor, Sénégal",
    status: "failed",
    amount: 45000,
    deliveredAt: new Date(Date.now() - 172800000),
    duration: 0,
  },
  {
    id: "DEL-005",
    orderId: "ORD-1238",
    customerName: "Moussa Diallo",
    address: "Touba, Sénégal",
    status: "completed",
    amount: 180000,
    deliveredAt: new Date(Date.now() - 259200000),
    duration: 60,
  },
  {
    id: "DEL-006",
    orderId: "ORD-1239",
    customerName: "Fatou Ba",
    address: "Mbour, Sénégal",
    status: "completed",
    amount: 95000,
    deliveredAt: new Date(Date.now() - 345600000),
    duration: 30,
  },
  {
    id: "DEL-007",
    orderId: "ORD-1240",
    customerName: "Ibrahima Ndiaye",
    address: "Kaolack, Sénégal",
    status: "completed",
    amount: 320000,
    deliveredAt: new Date(Date.now() - 432000000),
    duration: 90,
  },
];

const statusOptions = [
  { value: "", label: "Tous les statuts" },
  { value: "completed", label: "Livrées" },
  { value: "failed", label: "Échouées" },
];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  completed: {
    label: "Livré",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  failed: {
    label: "Échoué",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
};

export default function DeliveryHistoryPage() {
  const [history] = useState<HistoryDelivery[]>(mockHistory);
  const [filteredHistory, setFilteredHistory] =
    useState<HistoryDelivery[]>(mockHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = history.filter(
      (h) =>
        h.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.orderId.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (statusFilter)
      filtered = filtered.filter((h) => h.status === statusFilter);
    setFilteredHistory(filtered);
  }, [searchQuery, statusFilter, history]);

  const totalDeliveries = history.filter(
    (h) => h.status === "completed",
  ).length;
  const totalEarnings = history
    .filter((h) => h.status === "completed")
    .reduce((sum, h) => sum + h.amount, 0);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Truck className="w-6 h-6 mr-2 text-primary-600" />
            Historique des livraisons
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Retrouvez toutes vos livraisons passées
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {history.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total livraisons
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalDeliveries}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Livrées</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {history.filter((h) => h.status === "failed").length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Échouées</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {(totalEarnings / 1000).toLocaleString("fr-FR")}k
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gains totaux
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {showFilters && (
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-40"
              />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Liste */}
      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <EmptyState
              title="Aucune livraison"
              description={
                searchQuery
                  ? `Aucun résultat pour "${searchQuery}"`
                  : "Aucune livraison dans l'historique"
              }
              icon={<Truck className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Adresse
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Statut
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Montant
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => {
                    const config = statusConfig[item.status];
                    const Icon = config.icon;
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {item.id}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {item.customerName}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.address}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={cn(
                              "flex items-center gap-1 w-fit",
                              config.color,
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                          {formatPrice(item.amount)}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {formatDate(item.deliveredAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
