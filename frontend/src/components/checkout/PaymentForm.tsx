"use client";

import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Truck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  className?: string;
}

export default function PaymentForm({
  register,
  errors,
  watch: _watch,
  paymentMethod,
  onPaymentMethodChange,
  className = "",
}: PaymentFormProps) {
  const [showCvc, setShowCvc] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: "card",
      label: "Carte bancaire",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
      recommended: true,
    },
    {
      id: "mobile_money",
      label: "Mobile Money",
      icon: Smartphone,
      description: "Orange Money, Wave, Free, Expresso",
    },
    {
      id: "bank_transfer",
      label: "Virement bancaire",
      icon: Landmark,
      description: "Paiement par virement",
    },
    {
      id: "cash_on_delivery",
      label: "Paiement à la livraison",
      icon: Truck,
      description: "Payez à la réception",
    },
  ];

  const mobileMoneyProviders = [
    { value: "orange", label: "Orange Money" },
    { value: "wave", label: "Wave" },
    { value: "free", label: "Free Money" },
    { value: "expresso", label: "Expresso Money" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Méthodes de paiement */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Choisissez votre moyen de paiement
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onPaymentMethodChange(method.id)}
                className={cn(
                  "flex items-start space-x-3 p-4 border-2 rounded-lg transition-all text-left w-full",
                  isSelected
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isSelected
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-900 dark:text-white",
                      )}
                    >
                      {method.label}
                    </p>
                    {method.recommended && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {method.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulaire selon la méthode */}
      {paymentMethod === "card" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Informations de la carte
            </h3>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                🔒 Sécurisé
              </span>
            </div>
          </div>

          {/* Numéro de carte */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Numéro de carte
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="1234 5678 9012 3456"
                className="pl-10"
                maxLength={19}
                {...register("cardNumber")}
                error={
                  typeof errors.cardNumber?.message === "string"
                    ? errors.cardNumber.message
                    : undefined
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  const formatted = value.replace(/(.{4})/g, "$1 ").trim();
                  e.target.value = formatted;
                }}
              />
            </div>
          </div>

          {/* Nom sur la carte */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom sur la carte
            </label>
            <Input
              placeholder="Jean Dupont"
              {...register("cardName")}
              error={
                typeof errors.cardName?.message === "string"
                  ? errors.cardName.message
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date d'expiration */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date d'expiration
              </label>
              <Input
                placeholder="MM/AA"
                maxLength={5}
                {...register("cardExpiry")}
                error={
                  typeof errors.cardExpiry?.message === "string"
                    ? errors.cardExpiry.message
                    : undefined
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    const formatted =
                      value.slice(0, 2) + "/" + value.slice(2, 4);
                    e.target.value = formatted;
                  }
                }}
              />
            </div>

            {/* CVC */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                CVC
              </label>
              <div className="relative">
                <Input
                  type={showCvc ? "text" : "password"}
                  placeholder="123"
                  maxLength={4}
                  className="pr-10"
                  {...register("cardCvc")}
                  error={
                    typeof errors.cardCvc?.message === "string"
                      ? errors.cardCvc.message
                      : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowCvc(!showCvc)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showCvc ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Checkbox
            id="saveCard"
            label="Enregistrer cette carte pour mes prochains paiements"
            checked={saveCard}
            onChange={(event) => {
              setSaveCard(event.target.checked);
            }}
          />
        </div>
      )}

      {paymentMethod === "mobile_money" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Informations Mobile Money
          </h3>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opérateur
            </label>
            <Select
              options={mobileMoneyProviders}
              {...register("mobileMoneyProvider")}
              error={
                typeof errors.mobileMoneyProvider?.message === "string"
                  ? errors.mobileMoneyProvider.message
                  : undefined
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Numéro de téléphone
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="77 123 45 67"
                className="pl-10"
                maxLength={15}
                {...register("mobileMoneyPhone")}
                error={
                  typeof errors.mobileMoneyPhone?.message === "string"
                    ? errors.mobileMoneyPhone.message
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Vous recevrez un code de confirmation sur votre téléphone pour
              valider le paiement.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "bank_transfer" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Informations de virement
          </h3>

          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg space-y-2 border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">Banque</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Ecobank Sénégal
              </span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">
                Titulaire
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ShopSense AI
              </span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">IBAN</span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">
                SN XX 0000 0000 0000 0000 0000
              </span>
            </div>
            <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">
                BIC/SWIFT
              </span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">
                ECOCSNXX
              </span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-500 dark:text-gray-400">
                Référence
              </span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">
                #ORDER-{Date.now()}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Veuillez effectuer le virement dans les 48h pour valider votre
              commande. Envoyez la preuve de paiement à{" "}
              <strong>contact@shopsense-ai.com</strong>
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "cash_on_delivery" && (
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Paiement à la livraison
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vous payez à la réception de votre colis
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600 dark:text-green-400">
              ✅ Pas de frais supplémentaires. Paiement en espèces accepté à la
              livraison.
            </p>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Le livreur vous contactera pour confirmer la livraison.</p>
          </div>
        </div>
      )}

      {/* Sécurité */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <Lock className="w-4 h-4 flex-shrink-0" />
        <span>
          Vos informations de paiement sont sécurisées et cryptées (SSL
          256-bit).
        </span>
      </div>
    </div>
  );
}
