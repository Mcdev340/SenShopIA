"use client";

import { useState } from "react";
import { useAuth, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Spinner } from "@/components/ui/Spinner";
import {
  Shield,
  Lock,
  Smartphone,
  Key,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react";

export default function SecurityPage() {
  const { loading, changePassword } = useAuth();
  const { success, error: showError } = useToast();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setPasswordData({ ...passwordData, newPassword: value });
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(0);
      success("Mot de passe changé avec succès");
    } catch (error) {
      showError("Erreur de changement de mot de passe");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Faible", "Moyen", "Bon", "Excellent"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Shield className="w-6 h-6 mr-2 text-primary-600" />
          Sécurité
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gérez la sécurité de votre compte
        </p>
      </div>

      {/* Security Status */}
      <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Votre compte est sécurisé
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Toutes les mesures de sécurité sont activées
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-gray-400" />
            Changer le mot de passe
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Utilisez un mot de passe fort pour protéger votre compte
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe actuel
              </label>
              <div className="relative">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      passwordStrength <= 1
                        ? "text-red-500"
                        : passwordStrength === 2
                          ? "text-orange-500"
                          : passwordStrength === 3
                            ? "text-yellow-500"
                            : "text-green-500"
                    }`}
                  >
                    Force:{" "}
                    {strengthLabels[passwordStrength - 1] || "Très faible"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exigences du mot de passe :
              </p>
              <ul className="space-y-1 text-sm">
                <li
                  className={`flex items-center gap-1 ${passwordData.newPassword.length >= 8 ? "text-green-500" : "text-gray-400"}`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Au moins 8 caractères
                </li>
                <li
                  className={`flex items-center gap-1 ${/[a-z]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword) ? "text-green-500" : "text-gray-400"}`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Majuscules et minuscules
                </li>
                <li
                  className={`flex items-center gap-1 ${/\d/.test(passwordData.newPassword) ? "text-green-500" : "text-gray-400"}`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Au moins un chiffre
                </li>
                <li
                  className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? "text-green-500" : "text-gray-400"}`}
                >
                  <CheckCircle className="w-3 h-3" />
                  Un caractère spécial
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={
                isChangingPassword ||
                !passwordData.oldPassword ||
                !passwordData.newPassword
              }
            >
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              Changer le mot de passe
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Two Factor Auth */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-gray-400" />
            Authentification à deux facteurs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ajoutez une couche de sécurité supplémentaire
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Authentification à deux facteurs
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {twoFactorEnabled ? "Activée" : "Désactivée"}
                </p>
              </div>
            </div>
            <Button
              variant={twoFactorEnabled ? "outline" : "default"}
              size="sm"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                success(twoFactorEnabled ? "2FA désactivée" : "2FA activée");
              }}
            >
              {twoFactorEnabled ? "Désactiver" : "Activer"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Login Alerts */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-gray-400" />
            Alertes de connexion
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                M'alerter des connexions suspectes
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recevez un email lorsqu'une nouvelle connexion est détectée
              </p>
            </div>
            <Checkbox
              checked={loginAlerts}
              onChange={(event) => {
                setLoginAlerts(event.target.checked);
                success(
                  event.target.checked
                    ? "Alertes activées"
                    : "Alertes désactivées",
                );
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activité récente
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Connexion réussie
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Dakar, Sénégal • Il y a 5 minutes
                  </p>
                </div>
              </div>
              <span className="text-xs text-green-500">Actuel</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Connexion mobile
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Dakar, Sénégal • Il y a 2 heures
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
