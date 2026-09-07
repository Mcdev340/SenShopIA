'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();

  // Vérifier l'authentification
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  // Vérifier les rôles
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const role = user.role;
      const isAdminPath = pathname.startsWith('/dashboard/admin');
      const isDeliveryPath = pathname.startsWith('/dashboard/delivery');
      const isAdvisorPath = pathname.startsWith('/dashboard/advisor');

      if (isAdminPath && role !== 'admin') {
        router.push('/dashboard');
      } else if (isDeliveryPath && role !== 'delivery') {
        router.push('/dashboard');
      } else if (isAdvisorPath && role !== 'advisor') {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getTitle = () => {
    if (pathname.includes('/admin/orders')) return 'Gestion des commandes';
    if (pathname.includes('/admin/products')) return 'Gestion des produits';
    if (pathname.includes('/admin/users')) return 'Gestion des utilisateurs';
    if (pathname.includes('/admin')) return 'Tableau de bord administrateur';
    if (pathname.includes('/delivery')) return 'Tableau de bord livreur';
    if (pathname.includes('/advisor')) return 'Tableau de bord conseiller';
    return 'Tableau de bord';
  };

  const getSubtitle = () => {
    if (user) {
      return `Bienvenue ${user.firstName || user.username}`;
    }
    return 'Bienvenue sur votre espace personnel';
  };

  return (
    <DashboardLayout title={getTitle()} subtitle={getSubtitle()}>
      {children}
    </DashboardLayout>
  );
}