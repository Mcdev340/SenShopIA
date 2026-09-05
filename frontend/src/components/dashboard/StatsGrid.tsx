"use client";

import React from "react";
import StatsCard from "./StatsCard";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Truck,
  MessageCircle,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "pink";
  subtitle?: string;
  onClick?: () => void;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4 | 6;
  className?: string;
  loading?: boolean;
}

export default function StatsGrid({
  stats,
  columns = 4,
  className = "",
  loading = false,
}: StatsGridProps) {
  const columnsClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", columnsClasses[columns], className)}>
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendLabel={stat.trendLabel}
          color={stat.color}
          subtitle={stat.subtitle}
          onClick={stat.onClick}
          loading={loading}
        />
      ))}
    </div>
  );
}

// Hooks pour obtenir des statistiques selon le rôle
export const useDefaultStats = () => {
  const stats: Stat[] = [
    {
      id: "orders",
      title: "Commandes",
      value: "1,234",
      icon: <ShoppingBag className="w-5 h-5" />,
      trend: 12.5,
      trendLabel: "vs mois dernier",
      color: "primary",
      subtitle: "+12% de croissance",
    },
    {
      id: "revenue",
      title: "Revenus",
      value: "2,450,000 FCFA",
      icon: <DollarSign className="w-5 h-5" />,
      trend: 8.2,
      trendLabel: "vs mois dernier",
      color: "success",
      subtitle: "Mois en cours",
    },
    {
      id: "users",
      title: "Utilisateurs",
      value: "856",
      icon: <Users className="w-5 h-5" />,
      trend: 5.7,
      trendLabel: "vs mois dernier",
      color: "info",
      subtitle: "+23 nouveaux ce mois",
    },
    {
      id: "products",
      title: "Produits",
      value: "2,451",
      icon: <Package className="w-5 h-5" />,
      trend: -2.3,
      trendLabel: "vs mois dernier",
      color: "warning",
      subtitle: "156 en promotion",
    },
  ];

  return stats;
};

export const useDeliveryStats = () => {
  const stats: Stat[] = [
    {
      id: "deliveries",
      title: "Livraisons",
      value: "45",
      icon: <Truck className="w-5 h-5" />,
      trend: 15.2,
      trendLabel: "vs semaine dernière",
      color: "primary",
      subtitle: "+8 cette semaine",
    },
    {
      id: "rating",
      title: "Évaluation",
      value: "4.8 ★",
      icon: <Star className="w-5 h-5" />,
      trend: 0.3,
      trendLabel: "vs mois dernier",
      color: "success",
      subtitle: "98% de satisfaction",
    },
    {
      id: "earnings",
      title: "Gains",
      value: "125,000 FCFA",
      icon: <DollarSign className="w-5 h-5" />,
      trend: 10.5,
      trendLabel: "vs mois dernier",
      color: "success",
    },
    {
      id: "pending",
      title: "En attente",
      value: "5",
      icon: <Clock className="w-5 h-5" />,
      color: "warning",
      subtitle: "À livrer aujourd'hui",
    },
  ];

  return stats;
};

export const useAdvisorStats = () => {
  const stats: Stat[] = [
    {
      id: "tickets",
      title: "Tickets",
      value: "28",
      icon: <MessageCircle className="w-5 h-5" />,
      trend: 8.7,
      trendLabel: "vs semaine dernière",
      color: "primary",
      subtitle: "15 résolus",
    },
    {
      id: "satisfaction",
      title: "Satisfaction",
      value: "94%",
      icon: <Star className="w-5 h-5" />,
      trend: 2.1,
      trendLabel: "vs mois dernier",
      color: "success",
      subtitle: "Basé sur 120 avis",
    },
    {
      id: "response_time",
      title: "Temps réponse",
      value: "2.4h",
      icon: <Clock className="w-5 h-5" />,
      trend: -15.3,
      trendLabel: "vs mois dernier",
      color: "success",
      subtitle: "Objectif: 4h",
    },
    {
      id: "tickets_open",
      title: "Tickets ouverts",
      value: "8",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "warning",
      subtitle: "3 urgents",
    },
  ];

  return stats;
};

export const useClientStats = () => {
  const stats: Stat[] = [
    {
      id: "orders",
      title: "Mes commandes",
      value: "23",
      icon: <ShoppingBag className="w-5 h-5" />,
      trend: 5.2,
      trendLabel: "vs mois dernier",
      color: "primary",
      subtitle: "3 en cours",
    },
    {
      id: "spent",
      title: "Dépensé",
      value: "1,250,000 FCFA",
      icon: <DollarSign className="w-5 h-5" />,
      trend: 12.8,
      trendLabel: "vs mois dernier",
      color: "success",
      subtitle: "Moyenne: 54,347 FCFA",
    },
    {
      id: "wishlist",
      title: "Liste de souhaits",
      value: "18",
      icon: <Star className="w-5 h-5" />,
      color: "warning",
      subtitle: "2 en promotion",
    },
    {
      id: "reviews",
      title: "Avis",
      value: "12",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "info",
      subtitle: "4 en attente",
    },
  ];

  return stats;
};
