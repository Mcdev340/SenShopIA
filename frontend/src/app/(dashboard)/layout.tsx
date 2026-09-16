'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Spinner } from '@/components/ui/Spinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardRootLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Vérification de l'authentification
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    // Vérifier l'accès selon le rôle
    if (user) {
      const role = user.role;
      const isAdminPath = pathname.startsWith('/dashboard/admin');
      const isDeliveryPath = pathname.startsWith('/dashboard/delivery');
      const isAdvisorPath = pathname.startsWith('/dashboard/advisor');
      const isDashboardRoot = pathname === '/dashboard';

      // Vérifier les permissions selon le rôle
      if (isAdminPath && role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      if (isDeliveryPath && role !== 'delivery' && role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      if (isAdvisorPath && role !== 'advisor' && role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      // Rediriger vers le dashboard approprié selon le rôle
      if (isDashboardRoot) {
        switch (role) {
          case 'admin':
            // L'admin peut rester sur /dashboard (page générale)
            break;
          case 'delivery':
            router.push('/dashboard/delivery');
            return;
          case 'advisor':
            router.push('/dashboard/advisor');
            return;
          default:
            break;
        }
      }

      setIsAuthorized(true);
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  // Titre dynamique selon la page
  const getTitle = (): string => {
    if (pathname.startsWith('/dashboard/admin/analytics')) return 'Analytics';
    if (pathname.startsWith('/dashboard/admin/categories')) return 'Catégories';
    if (pathname.startsWith('/dashboard/admin/deliveries')) return 'Livraisons';
    if (pathname.startsWith('/dashboard/admin/orders')) return 'Commandes';
    if (pathname.startsWith('/dashboard/admin/payments')) return 'Paiements';
    if (pathname.startsWith('/dashboard/admin/products')) return 'Produits';
    if (pathname.startsWith('/dashboard/admin/support')) return 'Support';
    if (pathname.startsWith('/dashboard/admin/users')) return 'Utilisateurs';
    if (pathname.startsWith('/dashboard/admin')) return 'Tableau de bord administrateur';

    if (pathname.startsWith('/dashboard/advisor/faq')) return 'Gestion des FAQ';
    if (pathname.startsWith('/dashboard/advisor/satisfaction')) return 'Satisfaction client';
    if (pathname.startsWith('/dashboard/advisor/stats')) return 'Statistiques';
    if (pathname.startsWith('/dashboard/advisor/tickets')) return 'Tickets support';
    if (pathname.startsWith('/dashboard/advisor')) return 'Tableau de bord conseiller';

    if (pathname.startsWith('/dashboard/delivery/history')) return 'Historique des livraisons';
    if (pathname.startsWith('/dashboard/delivery/orders')) return 'Mes livraisons';
    if (pathname.startsWith('/dashboard/delivery/stats')) return 'Statistiques';
    if (pathname.startsWith('/dashboard/delivery')) return 'Tableau de bord livreur';

    return 'Tableau de bord';
  };

  const getSubtitle = (): string => {
    if (user) {
      return `Bienvenue ${user.firstName || user.username || ''}`;
    }
    return 'Bienvenue sur votre espace personnel';
  };

  // Affichage du loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si non authentifié (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Ne rien afficher tant que l'autorisation n'est pas confirmée
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <DashboardLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {children}
    </DashboardLayout>
  );
}