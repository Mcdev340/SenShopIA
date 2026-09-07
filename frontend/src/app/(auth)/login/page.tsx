"use client";

import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/layout/AuthLayout";
import Spinner from "@/components/ui/Spinner";

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
