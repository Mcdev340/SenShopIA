'use client';

import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginForm  from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Spinner } from '@/components/ui/Spinner';

export const metadata: Metadata = {
  title: 'Connexion | ShopSense AI',
  description: 'Connectez-vous à votre compte ShopSense AI pour accéder à vos commandes et fonctionnalités.',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Connexion"
      subtitle="Connectez-vous à votre compte ShopSense AI"
    >
      <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
        <LoginForm redirectTo="/" />
      </Suspense>
    </AuthLayout>
  );
}