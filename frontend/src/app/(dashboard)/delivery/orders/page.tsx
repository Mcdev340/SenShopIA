"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Truck,
  Search,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
} from "lucide-react";
import { formatRelativeTime, formatPrice, cn } from "@/lib/utils";

interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  amount: number;
  createdAt: Date;
  estimatedDelivery: Date;
}

const mockDeliveries: DeliveryOrder[] = [
  {
    id: "DEL-001",
    orderId: "ORD-1234",
    customerName: "Jean Dupont",
    customerPhone: "+221 77 123 45 67",
    address: "Dakar, Sénégal",
    status: "pending",
    amount: 125000,
    createdAt: new Date(Date.now() - 1800000),
    estimatedDelivery: new Date(Date.now() + 3600000),
  },
  {
    id: "DEL-002",
    orderId: "ORD-1235",
    customerName: "Marie Diop",
    customerPhone: "+221 77 234 56 78",
    address: "Thiès, Sénégal",
    status: "in_progress",
    amount: 75000,
    createdAt: new Date(Date.now() - 3600000),
    estimatedDelivery: new Date(Date.now() + 7200000),
  },
  {
    id: "DEL-003",
    orderId: "ORD-1236",
    customerName: "Oumar Fall",
    customerPhone: "+221 77 345 67 89",
    address: "Saint-Louis, Sénégal",
    status: "completed",
    amount: 250000,
    createdAt: new Date(Date.now() - 86400000),
    estimatedDelivery: new Date(Date.now() - 3600000),
  },
  {
    id: "DEL-004",
    orderId: "ORD-1237",
    customerName: "Aminata Sow",
    customerPhone: "+221 77 456 78 90",
    address: "Ziguinchor, Sénégal",
    status: "failed",
    amount: 45000,
    createdAt: new Date(Date.now() - 172800000),
    estimatedDelivery: new Date(Date.now() - 86400000),
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "En attente",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  in_progress: {
    label: "En cours",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Truck,
  },
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

export default function DeliveryOrdersPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(mockDeliveries);
  const [filteredDeliveries, setFilteredDeliveries] =
    useState<DeliveryOrder[]>(mockDeliveries);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = deliveries.filter(
      (d) =>
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (activeTab !== "all") {
      filtered = filtered.filter((d) => d.status === activeTab);
    }

    setFilteredDeliveries(filtered);
  }, [searchQuery, activeTab, deliveries]);

  const handleAccept = (id: string) => {
    setDeliveries(
      deliveries.map((d) =>
        d.id === id ? { ...d, status: "in_progress" } : d,
      ),
    );
  };

  const handleComplete = (id: string) => {
    setDeliveries(
      deliveries.map((d) => (d.id === id ? { ...d, status: "completed" } : d)),
    );
  };

  const handleFail = (id: string) => {
    setDeliveries(
      deliveries.map((d) => (d.id === id ? { ...d, status: "failed" } : d)),
    );
  };

  const getCountByStatus = (status: string) => {
    return deliveries.filter((d) => d.status === status).length;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Truck className="w-6 h-6 mr-2 text-primary-600" />
            Mes livraisons
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez toutes vos livraisons
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par client, ID, commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            En attente ({getCountByStatus("pending")})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            En cours ({getCountByStatus("in_progress")})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Livrées ({getCountByStatus("completed")})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Échouées ({getCountByStatus("failed")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredDeliveries.length === 0 ? (
            <EmptyState
              title="Aucune livraison"
              description={
                searchQuery
                  ? `Aucun résultat pour "${searchQuery}"`
                  : "Aucune livraison dans cette catégorie"
              }
              icon={<Truck className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="space-y-3">
              {filteredDeliveries.map((delivery) => {
                const config = statusConfig[delivery.status];
                const Icon = config.icon;
                return (
                  <Card
                    key={delivery.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardBody className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {delivery.id}
                              </p>
                              <Badge
                                className={cn(
                                  "flex items-center gap-1",
                                  config.color,
                                )}
                              >
                                <Icon className="w-3 h-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {delivery.customerName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {delivery.address}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              {delivery.customerPhone}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Commande {delivery.orderId} •{" "}
                              {formatPrice(delivery.amount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {delivery.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAccept(delivery.id)}
                              >
                                Accepter
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/delivery/orders/${delivery.id}`,
                                  )
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {delivery.status === "in_progress" && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleComplete(delivery.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Terminer
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleFail(delivery.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {(delivery.status === "completed" ||
                            delivery.status === "failed") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/dashboard/delivery/orders/${delivery.id}`,
                                )
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
