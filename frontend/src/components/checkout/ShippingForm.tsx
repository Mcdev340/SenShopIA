"use client";

import { useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { MapPin, Phone, Home, Globe } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/constants";

interface ShippingFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  defaultValues?: any;
  prefix?: string;
  onChange?: (values: any) => void;
  className?: string;
}

export default function ShippingForm({
  register,
  errors,
  defaultValues,
  prefix = "",
  onChange,
  className = "",
}: ShippingFormProps) {
  const getFieldName = (field: string) => {
    return prefix ? `${prefix}.${field}` : field;
  };

  const getError = (field: string) => {
    const errorKey = prefix ? `${prefix}.${field}` : field;
    const message = errors[errorKey]?.message;
    return typeof message === "string" ? message : undefined;
  };

  const countries = COUNTRIES.map((country) => ({
    value: country.code,
    label: country.name,
  }));

  // Notifier les changements
  useEffect(() => {
    if (onChange && defaultValues) {
      onChange(defaultValues);
    }
  }, [defaultValues, onChange]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Libellé */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Libellé de l'adresse
        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Maison, Bureau, etc."
            className="pl-10"
            {...register(getFieldName("label"))}
            error={getError("label")}
          />
        </div>
      </div>

      {/* Rue */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rue / Adresse
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="123 Rue de l'Indépendance"
            className="pl-10"
            {...register(getFieldName("street"))}
            error={getError("street")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Ville */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ville
          </label>
          <Input
            placeholder="Dakar"
            {...register(getFieldName("city"))}
            error={getError("city")}
          />
        </div>

        {/* Région */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Région / Département
          </label>
          <Input
            placeholder="Dakar"
            {...register(getFieldName("state"))}
            error={getError("state")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Code postal */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code postal
          </label>
          <Input
            placeholder="10000"
            {...register(getFieldName("postalCode"))}
            error={getError("postalCode")}
          />
        </div>

        {/* Pays */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pays
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <Select
              options={countries}
              className="pl-10"
              {...register(getFieldName("country"))}
              error={getError("country")}
            />
          </div>
        </div>
      </div>

      {/* Téléphone */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Téléphone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="77 123 45 67"
            className="pl-10"
            {...register(getFieldName("phone"))}
            error={getError("phone")}
          />
        </div>
      </div>

      {/* Rendre l'adresse par défaut */}
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          id={getFieldName("isDefault")}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
          {...register(getFieldName("isDefault"))}
        />
        <label
          htmlFor={getFieldName("isDefault")}
          className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
        >
          Définir comme adresse par défaut
        </label>
      </div>
    </div>
  );
}
