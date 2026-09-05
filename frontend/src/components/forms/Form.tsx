"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

// ============ TYPES ============

export interface FormContextValue {
  /** ID du formulaire */
  id?: string;
  /** Est en cours de soumission */
  isSubmitting?: boolean;
  /** Est valide */
  isValid?: boolean;
  /** Est en cours de validation */
  isValidating?: boolean;
  /** Nombre de champs */
  fieldsCount?: number;
  /** Nombre d'erreurs */
  errorsCount?: number;
  /** Nombre de champs remplis */
  filledCount?: number;
  /** Progress du formulaire */
  progress?: number;
  /** Méthodes */
  registerField?: (name: string) => void;
  unregisterField?: (name: string) => void;
  setFieldError?: (name: string, error: string) => void;
  setFieldValue?: (name: string, value: any) => void;
  setFieldTouched?: (name: string, touched: boolean) => void;
  getFieldValue?: (name: string) => any;
  getFieldError?: (name: string) => string | undefined;
  isFieldTouched?: (name: string) => boolean;
  validateField?: (name: string) => boolean;
  validateForm?: () => boolean;
  resetForm?: () => void;
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** ID du formulaire */
  id?: string;
  /** Est en cours de soumission */
  isSubmitting?: boolean;
  /** Est valide */
  isValid?: boolean;
  /** Est en cours de validation */
  isValidating?: boolean;
  /** Nombre de champs */
  fieldsCount?: number;
  /** Nombre d'erreurs */
  errorsCount?: number;
  /** Nombre de champs remplis */
  filledCount?: number;
  /** Progress du formulaire */
  progress?: number;
  /** Layout du formulaire */
  layout?: "vertical" | "horizontal" | "inline" | "grid";
  /** Colonnes pour le layout grid */
  columns?: 1 | 2 | 3 | 4;
  /** Espacement entre les champs */
  spacing?: "sm" | "md" | "lg" | "xl";
  /** Classe supplémentaire */
  className?: string;
  /** Callback de soumission */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Callback de validation */
  onValidate?: () => boolean;
  /** Callback de changement */
  onChange?: (values: Record<string, any>) => void;
  /** Valeurs initiales */
  initialValues?: Record<string, any>;
  /** Validation initiale */
  initialValidation?: boolean;
  /** Enfants */
  children: React.ReactNode;
}

// ============ CONTEXT ============

const FormContext = createContext<FormContextValue>({});

export const useFormContext = () => useContext(FormContext);

// ============ COMPOSANT ============

export default function Form({
  id,
  isSubmitting = false,
  isValid: isValidProp = true,
  isValidating = false,
  fieldsCount: fieldsCountProp = 0,
  errorsCount: errorsCountProp = 0,
  filledCount: filledCountProp = 0,
  progress: progressProp = 0,
  layout = "vertical",
  columns = 1,
  spacing = "md",
  className = "",
  onSubmit,
  onValidate,
  onChange,
  initialValues = {},
  initialValidation = false,
  children,
  ...props
}: FormProps) {
  // État interne du formulaire
  const [internalValues, setInternalValues] =
    useState<Record<string, any>>(initialValues);
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>(
    {},
  );
  const [internalTouched, setInternalTouched] = useState<
    Record<string, boolean>
  >({});
  const [internalFields, setInternalFields] = useState<Set<string>>(new Set());
  const [internalIsValid, setInternalIsValid] = useState(isValidProp);
  const [internalIsValidating, setInternalIsValidating] =
    useState(isValidating);
  const [internalIsSubmitting, setInternalIsSubmitting] =
    useState(isSubmitting);
  const [internalFilledCount, setInternalFilledCount] = useState(0);
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalErrorsCount, setInternalErrorsCount] = useState(0);

  // Mettre à jour les métriques
  useEffect(() => {
    const filled = Object.keys(internalValues).filter(
      (key) =>
        internalValues[key] !== undefined &&
        internalValues[key] !== null &&
        internalValues[key] !== "",
    ).length;
    setInternalFilledCount(filled);

    const totalFields = internalFields.size;
    const progress = totalFields > 0 ? (filled / totalFields) * 100 : 0;
    setInternalProgress(Math.min(100, progress));

    const errors = Object.values(internalErrors).filter(
      (e) => e && e.length > 0,
    ).length;
    setInternalErrorsCount(errors);

    const valid = errors === 0 && filled === totalFields && totalFields > 0;
    setInternalIsValid(valid || (totalFields === 0 && isValidProp));
  }, [internalValues, internalErrors, internalFields, isValidProp]);

  // Appeler onChange quand les valeurs changent
  useEffect(() => {
    if (onChange) {
      onChange(internalValues);
    }
  }, [internalValues, onChange]);

  // Validation initiale
  useEffect(() => {
    if (initialValidation && onValidate) {
      const valid = onValidate();
      setInternalIsValid(valid);
    }
  }, [initialValidation, onValidate]);

  // Méthodes du contexte
  const registerField = useCallback((name: string) => {
    setInternalFields((prev) => {
      const newSet = new Set(prev);
      newSet.add(name);
      return newSet;
    });
  }, []);

  const unregisterField = useCallback((name: string) => {
    setInternalFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(name);
      return newSet;
    });
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setInternalErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldValue = useCallback((name: string, value: any) => {
    setInternalValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldTouched = useCallback((name: string, touched: boolean) => {
    setInternalTouched((prev) => ({
      ...prev,
      [name]: touched,
    }));
  }, []);

  const getFieldValue = useCallback(
    (name: string) => {
      return internalValues[name];
    },
    [internalValues],
  );

  const getFieldError = useCallback(
    (name: string) => {
      return internalErrors[name];
    },
    [internalErrors],
  );

  const isFieldTouched = useCallback(
    (name: string) => {
      return internalTouched[name] || false;
    },
    [internalTouched],
  );

  const validateField = useCallback(
    (_name: string) => {
      if (onValidate) {
        const valid = onValidate();
        setInternalIsValid(valid);
        return valid;
      }
      return true;
    },
    [onValidate],
  );

  const validateForm = useCallback(() => {
    if (onValidate) {
      const valid = onValidate();
      setInternalIsValid(valid);
      return valid;
    }
    return true;
  }, [onValidate]);

  const resetForm = useCallback(() => {
    setInternalValues(initialValues);
    setInternalErrors({});
    setInternalTouched({});
    setInternalIsValid(isValidProp);
    setInternalIsValidating(false);
  }, [initialValues, isValidProp]);

  const contextValue: FormContextValue = useMemo(
    () => ({
      id,
      isSubmitting: internalIsSubmitting || isSubmitting,
      isValid: internalIsValid,
      isValidating: internalIsValidating || isValidating,
      fieldsCount: internalFields.size || fieldsCountProp,
      errorsCount: internalErrorsCount || errorsCountProp,
      filledCount: internalFilledCount || filledCountProp,
      progress: internalProgress || progressProp,
      registerField,
      unregisterField,
      setFieldError,
      setFieldValue,
      setFieldTouched,
      getFieldValue,
      getFieldError,
      isFieldTouched,
      validateField,
      validateForm,
      resetForm,
    }),
    [
      id,
      internalIsSubmitting,
      isSubmitting,
      internalIsValid,
      internalIsValidating,
      isValidating,
      internalFields.size,
      fieldsCountProp,
      internalErrorsCount,
      errorsCountProp,
      internalFilledCount,
      filledCountProp,
      internalProgress,
      progressProp,
      registerField,
      unregisterField,
      setFieldError,
      setFieldValue,
      setFieldTouched,
      getFieldValue,
      getFieldError,
      isFieldTouched,
      validateField,
      validateForm,
      resetForm,
    ],
  );

  const layoutClasses = {
    vertical: "space-y-4",
    horizontal: "space-y-4",
    inline: "flex flex-wrap items-end gap-4",
    grid: `grid grid-cols-1 sm:grid-cols-${columns} gap-4`,
  };

  const spacingClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Valider avant soumission
    if (onValidate) {
      const valid = onValidate();
      setInternalIsValid(valid);
      if (!valid) {
        return;
      }
    }

    setInternalIsSubmitting(true);
    if (onSubmit) {
      onSubmit(e);
    }
    setInternalIsSubmitting(false);
  };

  const formClassName = cn(
    "w-full",
    layoutClasses[layout],
    layout === "grid" && spacingClasses[spacing],
    className,
  );

  return (
    <FormContext.Provider value={contextValue}>
      <form
        id={id}
        className={formClassName}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        {children}

        {/* Barre de progression */}
        {internalProgress > 0 && internalProgress < 100 && (
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progression</span>
              <span>{Math.round(internalProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${Math.min(100, internalProgress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Statistiques */}
        {internalFields.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span>
              {internalFilledCount} / {internalFields.size} champs remplis
            </span>
            {internalErrorsCount > 0 && (
              <span className="text-red-500 font-medium">
                ⚠️ {internalErrorsCount} erreur
                {internalErrorsCount > 1 ? "s" : ""}
              </span>
            )}
            {!internalIsValid &&
              internalErrorsCount === 0 &&
              internalFilledCount > 0 && (
                <span className="text-yellow-500">⏳ Formulaire incomplet</span>
              )}
            {internalIsValid && internalFilledCount === internalFields.size && (
              <span className="text-green-500 font-medium">
                ✅ Formulaire valide
              </span>
            )}
            {internalIsValidating && (
              <span className="text-blue-500 animate-pulse">
                🔄 Validation en cours...
              </span>
            )}
            {internalIsSubmitting && (
              <span className="text-primary-500 animate-pulse">
                📤 Soumission en cours...
              </span>
            )}
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
}

export { FormContext };
