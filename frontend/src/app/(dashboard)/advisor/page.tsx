"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { useAdvisorStats } from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import { useQuickActions } from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDefaultActivities } from "@/components/dashboard/RecentActivity";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AdvisorDashboardPage() {
  const router = useRouter();
  const { loadOrders } = useOrders();

  const [stats] = useState(useAdvisorStats());
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  const quickActions = useQuickActions("advisor");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadOrders({ limit: 5 });
        // Simuler des tickets
        setTickets([
          {
            id: "TKT-001",
            customer: "Jean Dupont",
            subject: "Problème de paiement",
            status: "open",
            priority: "high",
            time: "10:30",
          },
          {
            id: "TKT-002",
            customer: "Marie Diop",
            subject: "Question sur une commande",
            status: "in_progress",
            priority: "medium",
            time: "11:15",
          },
          {
            id: "TKT-003",
            customer: "Oumar Fall",
            subject: "Demande de retour",
            status: "resolved",
            priority: "low",
            time: "09:00",
          },
          {
            id: "TKT-004",
            customer: "Aminata Sow",
            subject: "Problème technique",
            status: "open",
            priority: "high",
            time: "12:45",
          },
        ]);
      } catch (error) {
        console.error("Error loading advisor data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={stats} loading={isLoading} />

      {/* Tickets et activités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tickets récents
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tickets.filter((t) => t.status === "open").length} tickets
                    ouverts
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/advisor/tickets")}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/advisor/tickets/${ticket.id}`)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ticket.subject}
                        </p>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ticket.customer} • {ticket.time}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status === "open" && "Ouvert"}
                    {ticket.status === "in_progress" && "En cours"}
                    {ticket.status === "resolved" && "Résolu"}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div>
          <QuickActions
            actions={quickActions}
            title="Actions rapides"
            subtitle="Gérez les tickets"
            columns={2}
          />
        </div>
      </div>

      {/* Activités récentes */}
      <RecentActivity
        activities={useDefaultActivities()}
        loading={isLoading}
        limit={5}
        title="Activités récentes"
        subtitle="Dernières interactions avec les clients"
      />
    </div>
  );
}
