"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/hooks";
import { LoginSchema } from "@/lib/validators";

type LoginFormData = z.infer<typeof LoginSchema>;

interface LoginFormProps {
  /** Rediriger après connexion */
  redirectTo?: string;
  /** Afficher le titre */
  showTitle?: boolean;
  /** Afficher le lien d'inscription */
  showRegisterLink?: boolean;
  /** Afficher le lien de mot de passe oublié */
  showForgotPassword?: boolean;
  /** Classes supplémentaires */
  className?: string;
  /** Callback après connexion réussie */
  onSuccess?: () => void;
  /** Callback après échec de connexion */
  onError?: (error: string) => void;
}

export default function LoginForm({
  redirectTo = "/",
  showTitle = true,
  showRegisterLink = true,
  showForgotPassword = true,
  className = "",
  onSuccess,
  onError,
}: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);

      if (result) {
        success("Connexion réussie !");
        if (onSuccess) {
          onSuccess();
        }
        router.push(redirectTo);
      } else {
        setError("root", {
          message: "Email ou mot de passe incorrect",
        });
        if (onError) {
          onError("Email ou mot de passe incorrect");
        }
        showError("Email ou mot de passe incorrect");
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

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="space-y-2 text-center">
        {showTitle && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Connexion
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Connectez-vous à votre compte ShopSense AI
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

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                className="pl-10"
                error={errors.email?.message}
                {...register("email")}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mot de passe
              </label>
              {showForgotPassword && (
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                error={errors.password?.message}
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Se souvenir de moi */}
          <div className="flex items-center justify-between">
            <Checkbox
              id="remember"
              label="Se souvenir de moi"
              // Correction: LoginSchema ne contient pas de champ remember; la case reste visuelle sans modifier les données envoyées.
            />
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </CardBody>

      {/* Footer avec lien d'inscription */}
      {showRegisterLink && (
        <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Créer un compte
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
