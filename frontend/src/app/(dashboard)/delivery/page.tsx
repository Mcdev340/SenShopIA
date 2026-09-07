"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { useDeliveryStats } from "@/components/dashboard/StatsGrid";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { useDefaultOrders } from "@/components/dashboard/RecentOrders";
import QuickActions from "@/components/dashboard/QuickActions";
import { useQuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const { loadOrders, loading } = useOrders();

  const [stats] = useState(useDeliveryStats());
  const [isLoading, setIsLoading] = useState(true);

  const quickActions = useQuickActions("delivery");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadOrders({ limit: 5 });
      } catch (error) {
        console.error("Error loading delivery data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Simuler les livraisons du jour
  const todayDeliveries = [
    {
      id: "DEL-001",
      customer: "Jean Dupont",
      address: "Dakar, Sénégal",
      status: "pending",
      time: "10:00",
    },
    {
      id: "DEL-002",
      customer: "Marie Diop",
      address: "Thiès, Sénégal",
      status: "in_progress",
      time: "13:30",
    },
    {
      id: "DEL-003",
      customer: "Oumar Fall",
      address: "Saint-Louis, Sénégal",
      status: "completed",
      time: "09:00",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "in_progress":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
      case "completed":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={stats} loading={isLoading} />

      {/* Livraisons du jour */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Livraisons du jour
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {todayDeliveries.length} livraison
                    {todayDeliveries.length > 1 ? "s" : ""} à effectuer
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/delivery/orders")}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {todayDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/delivery/orders/${delivery.id}`)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {delivery.customer}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {delivery.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {delivery.time}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(delivery.status),
                      )}
                    >
                      {getStatusIcon(delivery.status)}
                      {delivery.status === "pending" && "En attente"}
                      {delivery.status === "in_progress" && "En cours"}
                      {delivery.status === "completed" && "Livré"}
                    </span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div>
          <QuickActions
            actions={quickActions}
            title="Actions rapides"
            subtitle="Gérez vos livraisons"
            columns={2}
          />
        </div>
      </div>

      {/* Historique des livraisons */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dernières livraisons effectuées
          </h3>
        </CardHeader>
        <CardBody>
          <RecentOrders
            orders={useDefaultOrders()}
            loading={loading}
            limit={5}
            showStatus={true}
            showViewAll={false}
          />
        </CardBody>
      </Card>
    </div>
  );
}
