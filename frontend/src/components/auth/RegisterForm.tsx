"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Phone } from "lucide-react";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks";
import { RegisterSchema } from "@/lib/validators";
import { UserRole } from "@/types/user";
import Checkbox from "../ui/Checkbox";

type RegisterFormData = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
  /** Rediriger après inscription */
  redirectTo?: string;
  /** Afficher le titre */
  showTitle?: boolean;
  /** Afficher le lien de connexion */
  showLoginLink?: boolean;
  /** Rôle par défaut */
  defaultRole?: "client" | "admin" | "delivery" | "advisor";
  /** Classes supplémentaires */
  className?: string;
  /** Callback après inscription réussie */
  onSuccess?: () => void;
  /** Callback après échec d'inscription */
  onError?: (error: string) => void;
}

export default function RegisterForm({
  redirectTo = "/",
  showTitle = true,
  showLoginLink = true,
  defaultRole = "client",
  className = "",
  onSuccess,
  onError,
}: RegisterFormProps) {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { success, error: showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: defaultRole,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Correction: les champs optionnels du schéma sont normalisés avant l'appel au service typé.
      const result = await registerUser({
        ...data,
        phone: data.phone ?? "",
        // Correction: le service attend l'enum UserRole, alors que Zod infère une union de chaînes.
        role: (data.role ?? defaultRole) as UserRole,
      });

      if (result) {
        success(
          "Inscription réussie ! Un email de vérification vous a été envoyé.",
        );
        if (onSuccess) {
          onSuccess();
        }
        router.push(redirectTo);
      } else {
        setError("root", {
          message: "Erreur lors de l'inscription",
        });
        if (onError) {
          onError("Erreur lors de l'inscription");
        }
        showError("Erreur lors de l'inscription");
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

  const roleOptions = [
    { value: "client", label: "Client" },
    { value: "delivery", label: "Livreur" },
    { value: "advisor", label: "Conseiller" },
  ];

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="space-y-2 text-center">
        {showTitle && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Créer un compte
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Rejoignez ShopSense AI et simplifiez vos achats
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

          {/* Nom d'utilisateur */}
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username"
                placeholder="johndoe"
                className="pl-10"
                error={errors.username?.message}
                {...register("username")}
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

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

          {/* Téléphone */}
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Numéro de téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                placeholder="+221 77 123 45 67"
                className="pl-10"
                error={errors.phone?.message}
                {...register("phone")}
                disabled={isLoading}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Rôle */}
          <div className="space-y-1">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Vous êtes
            </label>
            <Select
              id="role"
              options={roleOptions}
              {...register("role")}
              error={errors.role?.message}
              disabled={isLoading}
            />
            {errors.role && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mot de passe
            </label>
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

          {/* Confirmation mot de passe */}
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

          {/* Conditions d'utilisation */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              required
              label={
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  J'accepte les{" "}
                  <Link
                    href="/terms"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link
                    href="/privacy"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    politique de confidentialité
                  </Link>
                </span>
              }
            />
          </div>

          {/* Bouton d'inscription */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "Créer un compte"
            )}
          </Button>
        </form>
      </CardBody>

      {/* Footer avec lien de connexion */}
      {showLoginLink && (
        <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Se connecter
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
