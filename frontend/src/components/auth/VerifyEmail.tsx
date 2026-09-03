"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { useToast } from "@/hooks";

interface VerifyEmailProps {
  /** Afficher le titre */
  showTitle?: boolean;
  /** Classes supplémentaires */
  className?: string;
  /** Callback après vérification réussie */
  onSuccess?: () => void;
  /** Callback après échec */
  onError?: (error: string) => void;
}

type VerificationStatus =
  "loading" | "success" | "error" | "expired" | "already_verified";

export default function VerifyEmail({
  showTitle = true,
  className = "",
  onSuccess,
  onError,
}: VerifyEmailProps) {
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerificationEmail, user } = useAuth();
  const { success, error: showError } = useToast();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  const token = searchParams?.get("token") || "";
  const email = searchParams?.get("email") || user?.email || "";

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Aucun token de vérification trouvé");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        if (result) {
          setStatus("success");
          setMessage("Votre email a été vérifié avec succès !");
          success("Email vérifié avec succès !");
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setStatus("error");
          setMessage("Erreur lors de la vérification de l'email");
          if (onError) {
            onError("Erreur lors de la vérification");
          }
          showError("Erreur lors de la vérification de l'email");
        }
      } catch (error: any) {
        const errorMessage = error?.message || "Une erreur est survenue";
        if (
          errorMessage.includes("expiré") ||
          errorMessage.includes("expired")
        ) {
          setStatus("expired");
          setMessage("Le lien de vérification a expiré");
        } else if (
          errorMessage.includes("déjà vérifié") ||
          errorMessage.includes("already verified")
        ) {
          setStatus("already_verified");
          setMessage("Votre email est déjà vérifié");
        } else {
          setStatus("error");
          setMessage(errorMessage);
        }
        if (onError) {
          onError(errorMessage);
        }
        showError(errorMessage);
      }
    };

    verify();
  }, [token, verifyEmail, success, showError, onSuccess, onError]);

  const handleResend = async () => {
    if (!email) {
      showError("Aucune adresse email disponible");
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      success("Un nouvel email de vérification a été envoyé");
      setStatus("loading");
      setMessage("Email de vérification envoyé");
    } catch (error: any) {
      const errorMessage = error?.message || "Erreur lors de l'envoi";
      showError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Rendu du contenu selon le statut
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Vérification en cours...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Email vérifié !
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="/">
                <Button>Accéder à l'accueil</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Voir mon profil</Button>
              </Link>
            </div>
          </div>
        );

      case "already_verified":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Email déjà vérifié
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href="/">
                <Button>Accéder à l'accueil</Button>
              </Link>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lien expiré
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button onClick={handleResend} disabled={isResending}>
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Renvoyer un email de vérification"
                )}
              </Button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Erreur de vérification
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button onClick={handleResend} disabled={isResending || !email}>
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Renvoyer un email de vérification"
                )}
              </Button>
              <Link href="/contact">
                <Button variant="outline">Contacter le support</Button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      {showTitle && (
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Mail className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vérification de l'email
          </h1>
        </CardHeader>
      )}

      <CardBody>{renderContent()}</CardBody>

      {status !== "success" && status !== "already_verified" && (
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
      )}
    </Card>
  );
}
