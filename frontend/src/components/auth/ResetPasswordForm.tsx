"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { useToast } from "@/hooks";
import { PasswordResetConfirmSchema } from "@/lib/validators";

type ResetPasswordFormData = z.infer<typeof PasswordResetConfirmSchema>;

interface ResetPasswordFormProps {
  /** Afficher le titre */
  showTitle?: boolean;
  /** Classes supplémentaires */
  className?: string;
  /** Callback après réinitialisation réussie */
  onSuccess?: () => void;
  /** Callback après échec */
  onError?: (error: string) => void;
}

export default function ResetPasswordForm({
  showTitle = true,
  className = "",
  onSuccess,
  onError,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPasswordReset } = useAuth();
  const { success, error: showError } = useToast();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Récupérer les paramètres de l'URL
  const uid = searchParams?.get("uid") || "";
  const token = searchParams?.get("token") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(PasswordResetConfirmSchema),
    defaultValues: {
      uid: uid,
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Vérifier que les paramètres sont présents
  useEffect(() => {
    if (!uid || !token) {
      setError("root", {
        message: "Lien de réinitialisation invalide ou expiré",
      });
    }
  }, [uid, token, setError]);

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!uid || !token) {
      showError("Lien de réinitialisation invalide ou expiré");
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmPasswordReset(
        uid,
        token,
        data.newPassword,
        data.confirmPassword,
      );

      if (result) {
        setIsSuccess(true);
        success("Mot de passe réinitialisé avec succès !");
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError("root", {
          message: "Erreur lors de la réinitialisation",
        });
        if (onError) {
          onError("Erreur lors de la réinitialisation");
        }
        showError("Erreur lors de la réinitialisation");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setError("root", { message });
      if (onError) {
        onError(message);
      }
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Si la réinitialisation a réussi
  if (isSuccess) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardBody className="text-center py-8 space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mot de passe réinitialisé !
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Votre mot de passe a été réinitialisé avec succès. Vous allez être
            redirigé vers la page de connexion.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-4">
              Se connecter
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  // Si le lien est invalide
  if (!uid || !token) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardBody className="text-center py-8 space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lien invalide
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Ce lien de réinitialisation est invalide ou a expiré. Veuillez faire
            une nouvelle demande.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-4">Demander un nouveau lien</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="space-y-2 text-center">
        {showTitle && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Réinitialiser le mot de passe
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Entrez votre nouveau mot de passe
            </p>
          </>
        )}
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Erreur générale */}
          {errors.root && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {errors.root.message}
            </div>
          )}

          {/* Nouveau mot de passe */}
          <div className="space-y-1">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                error={errors.newPassword?.message}
                {...register("newPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirmation */}
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Exigences mot de passe */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Votre mot de passe doit contenir :
            </p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li className="flex items-center space-x-2">
                <span
                  className={
                    newPassword.length >= 6 ? "text-green-500" : "text-gray-400"
                  }
                >
                  {newPassword.length >= 6 ? "✅" : "◯"}
                </span>
                <span>Au moins 6 caractères</span>
              </li>
              <li className="flex items-center space-x-2">
                <span
                  className={
                    /[A-Z]/.test(newPassword)
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                >
                  {/[A-Z]/.test(newPassword) ? "✅" : "◯"}
                </span>
                <span>Au moins une majuscule</span>
              </li>
              <li className="flex items-center space-x-2">
                <span
                  className={
                    /[a-z]/.test(newPassword)
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                >
                  {/[a-z]/.test(newPassword) ? "✅" : "◯"}
                </span>
                <span>Au moins une minuscule</span>
              </li>
              <li className="flex items-center space-x-2">
                <span
                  className={
                    /[0-9]/.test(newPassword)
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                >
                  {/[0-9]/.test(newPassword) ? "✅" : "◯"}
                </span>
                <span>Au moins un chiffre</span>
              </li>
            </ul>
          </div>

          {/* Bouton */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Réinitialisation en cours...
              </>
            ) : (
              "Réinitialiser le mot de passe"
            )}
          </Button>
        </form>
      </CardBody>

      <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Retour à la connexion
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
