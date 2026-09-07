"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthLayout from "@/components/layout/AuthLayout";
import Spinner from "@/components/ui/Spinner";
import { AlertCircle } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const uid = searchParams?.get("uid") || "";
  const token = searchParams?.get("token") || "";

  if (!uid || !token) {
    return (
      <Card className="w-full max-w-md">
        <CardBody className="text-center py-8 space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lien invalide
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-4">Demander un nouveau lien</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Réinitialiser le mot de passe"
      subtitle="Entrez votre nouveau mot de passe"
    >
      <Suspense fallback={<Spinner size="lg" className="mx-auto" />}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
