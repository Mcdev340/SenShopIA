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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return null;
}
