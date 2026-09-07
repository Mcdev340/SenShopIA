import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentification | ShopSense AI',
  description: 'Authentification sur la plateforme ShopSense AI',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}