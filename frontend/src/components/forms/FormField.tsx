"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import FormError from "./FormError";
import FormHelper from "./FormHelper";
import FormLabel from "./FormLabel";
import FormSuccess from "./FormSuccess";
import { useFormContext } from "./Form";

// ============ TYPES ============

export interface FormFieldContextValue {
  /** ID du champ */
  id?: string;
  /** Nom du champ */
  name?: string;
  /** Est requis */
  required?: boolean;
  /** Est désactivé */
  disabled?: boolean;
  /** Est en lecture seule */
  readOnly?: boolean;
  /** A une erreur */
  hasError?: boolean;
  /** Est valide */
  isValid?: boolean;
  /** Est touché */
  isTouched?: boolean;
  /** Est en cours de validation */
  isValidating?: boolean;
  /** Valeur du champ */
  value?: any;
  /** Méthodes */
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ID du champ */
  id?: string;
  /** Nom du champ */
  name?: string;
  /** Est requis */
  required?: boolean;
  /** Est désactivé */
  disabled?: boolean;
  /** Est en lecture seule */
  readOnly?: boolean;
  /** Layout du champ */
  layout?: "vertical" | "horizontal" | "inline" | "grid";
  /** Largeur du label en horizontal */
  labelWidth?: string;
  /** Classe supplémentaire */
  className?: string;
  /** Label du champ */
  label?: string;
  /** Message d'erreur */
  error?: string;
  /** Message de succès */
  success?: string;
  /** Message d'aide */
  helper?: string;
  /** Afficher le label */
  showLabel?: boolean;
  /** Afficher l'erreur */
  showError?: boolean;
  /** Afficher le succès */
  showSuccess?: boolean;
  /** Afficher l'aide */
  showHelper?: boolean;
  /** Valeur du champ */
  value?: any;
  /** Callback de changement */
  onChange?: (value: any) => void;
  /** Callback de blur */
  onBlur?: () => void;
  /** Callback de focus */
  onFocus?: () => void;
  /** Validation personnalisée */
  validate?: (value: any) => string | undefined;
  /** Est touché */
  isTouched?: boolean;
  /** Est en cours de validation */
  isValidating?: boolean;
  /** Enfants */
  children: React.ReactNode;
}

// ============ CONTEXT ============

const FormFieldContext = createContext<FormFieldContextValue>({});

export const useFormField = () => useContext(FormFieldContext);

// ============ COMPOSANT ============

export default function FormField({
  id,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  layout = "vertical",
  labelWidth = "w-32",
  className = "",
  label,
  error: errorProp,
  success: successProp,
  helper: helperProp,
  showLabel = true,
  showError = true,
  showSuccess = true,
  showHelper = true,
  value: valueProp,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  validate,
  isTouched: isTouchedProp = false,
  isValidating: isValidatingProp = false,
  children,
  ...props
}: FormFieldProps) {
  const formContext = useFormContext();
  const [internalValue, setInternalValue] = React.useState(valueProp);
  const [internalError, setInternalError] = React.useState<string | undefined>(
    errorProp,
  );
  const [internalTouched, setInternalTouched] = React.useState(isTouchedProp);
  const [internalIsValidating, setInternalIsValidating] =
    React.useState(isValidatingProp);
  const [internalIsValid, setInternalIsValid] = React.useState(false);

  const fieldRef = useRef<HTMLDivElement>(null);
  const registered = useRef(false);

  // Enregistrer le champ dans le formulaire
  useEffect(() => {
    if (name && formContext.registerField && !registered.current) {
      formContext.registerField(name);
      registered.current = true;

      // Mettre à jour la valeur initiale
      if (valueProp !== undefined && formContext.setFieldValue) {
        formContext.setFieldValue(name, valueProp);
      }
    }

    return () => {
      if (name && formContext.unregisterField && registered.current) {
        formContext.unregisterField(name);
        registered.current = false;
      }
    };
  }, [name, formContext, valueProp]);

  // Synchroniser avec le contexte
  useEffect(() => {
    if (name && formContext.getFieldValue) {
      const ctxValue = formContext.getFieldValue(name);
      if (ctxValue !== undefined && ctxValue !== internalValue) {
        setInternalValue(ctxValue);
      }
    }
  }, [name, formContext, internalValue]);

  useEffect(() => {
    if (name && formContext.getFieldError) {
      const ctxError = formContext.getFieldError(name);
      if (ctxError !== internalError) {
        setInternalError(ctxError);
      }
    }
  }, [name, formContext, internalError]);

  useEffect(() => {
    if (name && formContext.isFieldTouched) {
      const ctxTouched = formContext.isFieldTouched(name);
      if (ctxTouched !== internalTouched) {
        setInternalTouched(ctxTouched);
      }
    }
  }, [name, formContext, internalTouched]);

  // Validation
  useEffect(() => {
    if (validate && internalValue !== undefined) {
      setInternalIsValidating(true);
      const error = validate(internalValue);
      setInternalError(error);
      setInternalIsValid(!error);
      setInternalIsValidating(false);

      if (name && formContext.setFieldError) {
        formContext.setFieldError(name, error || "");
      }
    }
  }, [validate, internalValue, name, formContext]);

  // Valider avec la validation du formulaire
  useEffect(() => {
    if (internalTouched && name && formContext.validateField) {
      formContext.validateField(name);
    }
  }, [internalTouched, name, formContext]);

  const hasError = !!(internalError || errorProp);
  const isValid = internalIsValid || !!successProp;
  const isTouched = internalTouched || isTouchedProp;
  const isValidating = internalIsValidating || isValidatingProp;

  const contextValue: FormFieldContextValue = useMemo(
    () => ({
      id: id || name,
      name,
      required,
      disabled,
      readOnly,
      hasError,
      isValid,
      isTouched,
      isValidating,
      value: internalValue,
      onChange: (value: any) => {
        setInternalValue(value);
        if (name && formContext.setFieldValue) {
          formContext.setFieldValue(name, value);
        }
        if (onChangeProp) {
          onChangeProp(value);
        }
      },
      onBlur: () => {
        setInternalTouched(true);
        if (name && formContext.setFieldTouched) {
          formContext.setFieldTouched(name, true);
        }
        if (onBlurProp) {
          onBlurProp();
        }
      },
      onFocus: () => {
        if (onFocusProp) {
          onFocusProp();
        }
      },
    }),
    [
      id,
      name,
      required,
      disabled,
      readOnly,
      hasError,
      isValid,
      isTouched,
      isValidating,
      internalValue,
      formContext,
      onChangeProp,
      onBlurProp,
      onFocusProp,
    ],
  );

  const layoutClasses = {
    vertical: "space-y-1.5",
    horizontal: "flex items-start gap-4",
    inline: "inline-flex items-center gap-2",
    grid: "space-y-1.5",
  };

  const containerClasses = cn(
    "w-full",
    layoutClasses[layout],
    hasError && "has-error",
    isValid && "has-success",
    className,
  );

  // Déterminer l'erreur à afficher
  const displayError = internalError || errorProp;
  const displaySuccess = successProp || (isValid && "Champ valide");
  const displayHelper = helperProp;

  // Ne pas afficher l'erreur si le champ n'est pas touché (sauf si erreur de validation)
  const showErrorField = showError && isTouched && displayError;

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div
        ref={fieldRef}
        className={containerClasses}
        data-field={name}
        {...props}
      >
        {/* Label */}
        {showLabel && label && (
          <div
            className={
              layout === "horizontal" ? `flex-shrink-0 ${labelWidth}` : ""
            }
          >
            <FormLabel
              required={required}
              disabled={disabled}
              htmlFor={id || name}
            >
              {label}
            </FormLabel>
          </div>
        )}

        {/* Contenu */}
        <div
          className={cn(
            "flex-1",
            layout === "horizontal" && "min-w-0",
            layout === "inline" && "min-w-0",
          )}
        >
          {children}
        </div>

        {/* Messages */}
        {(showErrorField ||
          (showSuccess && displaySuccess) ||
          (showHelper && displayHelper)) && (
          <div
            className={cn(
              "space-y-0.5",
              layout === "horizontal" && `ml-[${labelWidth}]`,
              layout === "inline" && "ml-0",
            )}
          >
            {showErrorField && displayError && (
              <FormError size="sm">{displayError}</FormError>
            )}
            {showSuccess && displaySuccess && !hasError && (
              <FormSuccess size="sm">{displaySuccess}</FormSuccess>
            )}
            {showHelper && displayHelper && !hasError && !displaySuccess && (
              <FormHelper size="sm">{displayHelper}</FormHelper>
            )}
          </div>
        )}
      </div>
    </FormFieldContext.Provider>
  );
}

export { FormFieldContext };
