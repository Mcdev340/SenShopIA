'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      // Rediriger vers le dashboard approprié selon le rôle
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'delivery':
          router.push('/dashboard/delivery');
          break;
        case 'advisor':
          router.push('/dashboard/advisor');
          break;
        default:
          router.push('/dashboard/admin');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return null;
}