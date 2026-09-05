"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Home,
  Building,
  Package,
  Shield,
} from "lucide-react";
import { useCart, useAuth, useOrders, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { CheckoutSummary } from "./CheckoutSummary";
import { ShippingForm } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { OrderSummary } from "./OrderSummary";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/constants";

// Schéma de validation du checkout
const AddressSchema = z.object({
  label: z.string().min(1, "Le libellé est requis"),
  street: z.string().min(1, "La rue est requise"),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().min(1, "La région est requise"),
  country: z.string().min(1, "Le pays est requis"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  isDefault: z.boolean().default(false),
});

const CheckoutSchema = z.object({
  // Shipping
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  sameAsShipping: z.boolean().default(true),
  deliveryInstructions: z.string().optional(),

  // Payment
  paymentMethod: z.enum([
    "card",
    "mobile_money",
    "bank_transfer",
    "cash_on_delivery",
  ]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),
  saveCard: z.boolean().default(false),
  mobileMoneyProvider: z
    .enum(["orange", "wave", "free", "expresso"])
    .optional(),
  mobileMoneyPhone: z.string().optional(),

  // Terms
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
  agreeNewsletter: z.boolean().default(false),
});

type CheckoutFormData = z.infer<typeof CheckoutSchema>;

interface CheckoutFormProps {
  className?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
  onStepChange?: (step: number) => void;
}

type Step = "shipping" | "payment" | "confirmation";

export default function CheckoutForm({
  className = "",
  onSuccess,
  onError,
  onStepChange,
}: CheckoutFormProps) {
  const router = useRouter();
  const { items, total, clearCart, loading: cartLoading, loadCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  const { success, error: showError } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepProgress, setStepProgress] = useState(0);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      shippingAddress: {
        label: "Maison",
        street: "",
        city: "",
        state: "",
        country: "SN",
        postalCode: "",
        phone: user?.phone || "",
        isDefault: true,
      },
      billingAddress: {
        label: "Facturation",
        street: "",
        city: "",
        state: "",
        country: "SN",
        postalCode: "",
        phone: user?.phone || "",
        isDefault: true,
      },
      sameAsShipping: true,
      deliveryInstructions: "",
      paymentMethod: "card",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardName: "",
      saveCard: false,
      mobileMoneyProvider: "orange",
      mobileMoneyPhone: "",
      agreeTerms: false,
      agreeNewsletter: false,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    setError,
    reset,
    control,
  } = methods;

  const sameAsShipping = watch("sameAsShipping");
  const paymentMethod = watch("paymentMethod");
  const totalAmount = total;

  // Charger le panier
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Mettre à jour les coordonnées de facturation si sameAsShipping est vrai
  useEffect(() => {
    if (sameAsShipping) {
      const shipping = getValues("shippingAddress");
      setValue("billingAddress", {
        ...shipping,
        label: "Facturation",
      });
    }
  }, [sameAsShipping, getValues, setValue]);

  // Vérifier si le panier est vide
  useEffect(() => {
    if (items.length === 0 && !cartLoading) {
      router.push("/cart");
    }
  }, [items, cartLoading, router]);

  // Mettre à jour la progression
  useEffect(() => {
    const stepIndex = ["shipping", "payment", "confirmation"].indexOf(
      currentStep,
    );
    setStepProgress((stepIndex / 2) * 100);
    if (onStepChange) {
      onStepChange(stepIndex);
    }
  }, [currentStep, onStepChange]);

  // Navigation entre les étapes
  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  // Validation de l'étape shipping
  const validateShippingStep = () => {
    const shipping = getValues("shippingAddress");
    const errors_list: string[] = [];

    if (!shipping.street) errors_list.push("La rue est requise");
    if (!shipping.city) errors_list.push("La ville est requise");
    if (!shipping.state) errors_list.push("La région est requise");
    if (!shipping.postalCode) errors_list.push("Le code postal est requis");
    if (!shipping.phone) errors_list.push("Le téléphone est requis");

    if (errors_list.length > 0) {
      showError(errors_list[0]);
      return false;
    }
    return true;
  };

  // Validation de l'étape payment
  const validatePaymentStep = () => {
    const method = getValues("paymentMethod");
    if (!method) {
      showError("Veuillez sélectionner un moyen de paiement");
      return false;
    }

    if (method === "card") {
      const cardNumber = getValues("cardNumber");
      const cardExpiry = getValues("cardExpiry");
      const cardCvc = getValues("cardCvc");
      const cardName = getValues("cardName");

      if (!cardNumber || cardNumber.length < 16) {
        showError("Numéro de carte invalide");
        return false;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        showError("Date d'expiration invalide");
        return false;
      }
      if (!cardCvc || cardCvc.length < 3) {
        showError("CVC invalide");
        return false;
      }
      if (!cardName) {
        showError("Nom sur la carte requis");
        return false;
      }
    }

    if (method === "mobile_money") {
      const phone = getValues("mobileMoneyPhone");
      if (!phone || phone.length < 9) {
        showError("Numéro de téléphone invalide");
        return false;
      }
    }

    const agreeTerms = getValues("agreeTerms");
    if (!agreeTerms) {
      showError("Vous devez accepter les conditions");
      return false;
    }

    return true;
  };

  // Soumission du formulaire
  const onSubmit = async (data: CheckoutFormData) => {
    if (currentStep === "shipping") {
      if (validateShippingStep()) {
        goToStep("payment");
      }
      return;
    }

    if (currentStep === "payment") {
      if (validatePaymentStep()) {
        await createOrderFromData(data);
      }
      return;
    }
  };

  // Création de la commande
  const createOrderFromData = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: data.shippingAddress,
        billingAddress: data.sameAsShipping
          ? data.shippingAddress
          : data.billingAddress,
        paymentMethod: data.paymentMethod,
        deliveryInstructions: data.deliveryInstructions || "",
        couponCode: null,
        notes: "",
      };

      const order = await createOrder(orderData);

      if (order) {
        setOrderId(order.id);
        goToStep("confirmation");
        success("Commande créée avec succès !");
        await clearCart();
        if (onSuccess) {
          onSuccess(order.id);
        }
      } else {
        const errorMsg = "Erreur lors de la création de la commande";
        showError(errorMsg);
        setError("root", { message: errorMsg });
        if (onError) {
          onError(errorMsg);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      showError(message);
      setError("root", { message });
      if (onError) {
        onError(message);
      }
    } finally {
      setIsSubmitting(false);
      setIsProcessing(false);
    }
  };

  // Retour à l'étape précédente
  const goBack = () => {
    if (currentStep === "payment") {
      goToStep("shipping");
    }
  };

  // Rendu de l'étape de livraison
  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Adresse de livraison
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Où souhaitons-nous livrer votre commande ?
          </p>
        </div>
      </div>

      <ShippingForm
        register={register}
        errors={errors}
        defaultValues={getValues("shippingAddress")}
        onChange={(values) => {
          Object.entries(values).forEach(([key, value]) => {
            setValue(`shippingAddress.${key}`, value);
          });
        }}
      />

      {/* Instructions de livraison */}
      <div className="space-y-1">
        <label
          htmlFor="deliveryInstructions"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Instructions de livraison{" "}
          <span className="text-gray-400 text-xs">(optionnel)</span>
        </label>
        <textarea
          id="deliveryInstructions"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
          rows={2}
          placeholder="Instructions pour le livreur (porte, code, etc.)"
          {...register("deliveryInstructions")}
        />
      </div>

      {/* Adresse de facturation */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Checkbox
            id="sameAsShipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => setValue("sameAsShipping", !!checked)}
            className="mt-1"
          />
          <label
            htmlFor="sameAsShipping"
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            L'adresse de facturation est identique à l'adresse de livraison
          </label>
        </div>

        {!sameAsShipping && (
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse de facturation
              </h3>
            </div>
            <ShippingForm
              register={register}
              errors={errors}
              defaultValues={getValues("billingAddress")}
              prefix="billingAddress"
              onChange={(values) => {
                Object.entries(values).forEach(([key, value]) => {
                  setValue(`billingAddress.${key}`, value);
                });
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          Continuer vers le paiement
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Rendu de l'étape de paiement
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Moyen de paiement
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choisissez votre méthode de paiement
          </p>
        </div>
      </div>

      <PaymentForm
        register={register}
        errors={errors}
        watch={watch}
        control={control}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(method) => setValue("paymentMethod", method)}
      />

      {/* Conditions */}
      <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Checkbox
          id="agreeTerms"
          label={
            <span className="text-sm text-gray-600 dark:text-gray-400">
              J'accepte les{" "}
              <a href="/terms" className="text-primary-600 hover:underline">
                conditions générales de vente
              </a>{" "}
              et la{" "}
              <a href="/privacy" className="text-primary-600 hover:underline">
                politique de confidentialité
              </a>
            </span>
          }
          checked={watch("agreeTerms")}
          onCheckedChange={(checked) => setValue("agreeTerms", !!checked)}
          error={errors.agreeTerms?.message}
        />
        <Checkbox
          id="agreeNewsletter"
          label={
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Je souhaite recevoir la newsletter et les offres exclusives
            </span>
          }
          checked={watch("agreeNewsletter")}
          onCheckedChange={(checked) => setValue("agreeNewsletter", !!checked)}
        />
      </div>

      {/* Résumé rapide */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {items.length} article{items.length > 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Confirmation...
            </>
          ) : (
            <>
              Confirmer la commande
              <Lock className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Rendu de l'étape de confirmation
  const renderConfirmationStep = () => (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center animate-scale">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Commande confirmée !
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Votre commande a été passée avec succès. Vous recevrez un email de
          confirmation.
        </p>
        {orderId && (
          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg inline-block">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Numéro de commande
            </p>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
              #{orderId}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <Truck className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            En préparation
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <Package className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Expédition
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <CheckCircle className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Livraison
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          onClick={() => router.push(`/orders/${orderId}`)}
          variant="outline"
        >
          Voir la commande
        </Button>
        <Button onClick={() => router.push("/")}>Retour à l'accueil</Button>
      </div>

      <div className="pt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Un email de confirmation vous a été envoyé.</p>
        <p>
          Vous pouvez suivre votre commande dans la rubrique "Mes commandes".
        </p>
      </div>
    </div>
  );

  // Fonction pour formater le prix (à importer)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Si le panier est vide
  if (items.length === 0 && !cartLoading) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardBody className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Panier vide
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Votre panier est vide. Ajoutez des produits avant de passer
            commande.
          </p>
          <Button className="mt-6" onClick={() => router.push("/products")}>
            Découvrir les produits
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className={cn("w-full max-w-6xl mx-auto", className)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                {/* Étapes */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          currentStep === "shipping" ||
                            currentStep === "payment" ||
                            currentStep === "confirmation"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
                        )}
                      >
                        1
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          currentStep === "shipping" ||
                            currentStep === "payment" ||
                            currentStep === "confirmation"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-gray-500",
                        )}
                      >
                        Livraison
                      </span>
                    </div>
                    <div className="flex-1 h-0.5 mx-4 bg-gray-200 dark:bg-gray-700">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          currentStep === "payment" ||
                            currentStep === "confirmation"
                            ? "w-full bg-primary-600"
                            : "w-0 bg-primary-600",
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          currentStep === "payment" ||
                            currentStep === "confirmation"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
                        )}
                      >
                        2
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          currentStep === "payment" ||
                            currentStep === "confirmation"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-gray-500",
                        )}
                      >
                        Paiement
                      </span>
                    </div>
                    <div className="flex-1 h-0.5 mx-4 bg-gray-200 dark:bg-gray-700">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          currentStep === "confirmation"
                            ? "w-full bg-primary-600"
                            : "w-0 bg-primary-600",
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          currentStep === "confirmation"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
                        )}
                      >
                        3
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          currentStep === "confirmation"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-gray-500",
                        )}
                      >
                        Confirmation
                      </span>
                    </div>
                  </div>
                  {/* Barre de progression */}
                  <div className="mt-4 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 transition-all duration-500 rounded-full"
                      style={{ width: `${stepProgress}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Erreur générale */}
                  {errors.root && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                      {errors.root.message}
                    </div>
                  )}

                  {currentStep === "shipping" && renderShippingStep()}
                  {currentStep === "payment" && renderPaymentStep()}
                  {currentStep === "confirmation" && renderConfirmationStep()}
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CheckoutSummary />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Transactions sécurisées</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Paiement crypté SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
