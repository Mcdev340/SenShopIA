import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Schéma de validation
 */
export interface ValidationSchema<T extends Record<string, any>> {
  /** Fonction de validation */
  validate: (data: T) => Partial<Record<keyof T, string>>;
  /** Règles de validation (optionnel) */
  rules?: Partial<
    Record<keyof T, (value: any, allValues?: T) => string | null>
  >;
  /** Messages d'erreur personnalisés */
  messages?: Record<string, string>;
}

/**
 * Options pour le hook useValidation
 */
export interface UseValidationOptions<T extends Record<string, any>> {
  /** Valider au premier rendu (défaut: false) */
  validateOnMount?: boolean;
  /** Valider à chaque changement (défaut: true) */
  validateOnChange?: boolean;
  /** Valider au blur (défaut: true) */
  validateOnBlur?: boolean;
  /** Délai de debounce pour la validation (ms) */
  debounce?: number;
  /** Appeler la validation uniquement sur les champs touchés */
  validateOnlyTouched?: boolean;
  /** Schéma de validation */
  schema?: ValidationSchema<T>;
  /** Données initiales (optionnel) */
  initialData?: T;
}

/**
 * Retour du hook useValidation
 */
export interface UseValidationReturn<T extends Record<string, any>> {
  /** Erreurs de validation */
  errors: Partial<Record<keyof T, string>>;
  /** Champs touchés */
  touched: Partial<Record<keyof T, boolean>>;
  /** Valide ou non */
  isValid: boolean;
  /** En cours de validation */
  isValidating: boolean;
  /** Nombre de validations */
  validationCount: number;
  /** Définir les erreurs */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  /** Définir les champs touchés */
  setTouched: (touched: Partial<Record<keyof T, boolean>>) => void;
  /** Marquer un champ comme touché */
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  /** Valider toutes les données */
  validate: (data?: T) => boolean;
  /** Valider un champ spécifique */
  validateField: (field: keyof T, value: any, allValues?: T) => boolean;
  /** Valider un champ avec le blur */
  validateFieldOnBlur: (field: keyof T, value: any, allValues?: T) => void;
  /** Effacer toutes les erreurs */
  clearErrors: () => void;
  /** Effacer les erreurs d'un champ */
  clearFieldError: (field: keyof T) => void;
  /** Réinitialiser la validation */
  reset: () => void;
  /** Vérifier si un champ a une erreur */
  hasError: (field: keyof T) => boolean;
  /** Récupérer l'erreur d'un champ */
  getError: (field: keyof T) => string | undefined;
  /** Récupérer toutes les erreurs sous forme de tableau */
  getErrorList: () => string[];
  /** Récupérer le nombre d'erreurs */
  getErrorCount: () => number;
}

/**
 * Hook pour la validation de formulaires
 *
 * @param options - Options de validation
 * @returns {Object} État et actions de validation
 *
 * @example
 * // Exemple basique
 * const schema = {
 *   validate: (data) => {
 *     const errors: Record<string, string> = {};
 *     if (!data.email) errors.email = 'Email requis';
 *     if (!data.password) errors.password = 'Mot de passe requis';
 *     if (data.password && data.password.length < 6) {
 *       errors.password = 'Mot de passe trop court';
 *     }
 *     return errors;
 *   }
 * };
 *
 * const { errors, validate, validateField, isValid } = useValidation({
 *   schema,
 *   validateOnChange: true,
 *   debounce: 300
 * });
 *
 * // Valider tout le formulaire
 * const isValid = validate(formData);
 *
 * // Valider un champ spécifique
 * const isFieldValid = validateField('email', 'test@example.com');
 */
export const useValidation = <T extends Record<string, any>>(
  options: UseValidationOptions<T> = {},
): UseValidationReturn<T> => {
  const {
    schema,
    initialData,
    validateOnMount = false,
    validateOnChange = true,
    validateOnBlur = true,
    debounce = 0,
    validateOnlyTouched: _validateOnlyTouched = false,
  } = options;

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationCount, setValidationCount] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T | undefined>(initialData);
  const isFirstRender = useRef<boolean>(true);

  // Nettoyer le timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Valider les données
  const validateData = useCallback(
    (data: T): boolean => {
      if (!schema) {
        setIsValid(true);
        setErrors({});
        return true;
      }

      setIsValidating(true);
      const validationErrors = schema.validate(data);
      setErrors(validationErrors);
      const valid = Object.keys(validationErrors).length === 0;
      setIsValid(valid);
      setIsValidating(false);
      setValidationCount((prev) => prev + 1);

      return valid;
    },
    [schema],
  );

  // Valider avec debounce
  const validateWithDebounce = useCallback(
    (data: T) => {
      clearTimer();

      if (debounce > 0) {
        timerRef.current = setTimeout(() => {
          validateData(data);
        }, debounce);
      } else {
        validateData(data);
      }
    },
    [debounce, validateData, clearTimer],
  );

  // Valider toutes les données
  const validate = useCallback(
    (data?: T): boolean => {
      const dataToValidate = data || lastDataRef.current;
      if (!dataToValidate) {
        setIsValid(true);
        return true;
      }
      lastDataRef.current = dataToValidate;
      return validateData(dataToValidate);
    },
    [validateData],
  );

  // Valider un champ spécifique
  const validateField = useCallback(
    (field: keyof T, value: any, allValues?: T): boolean => {
      if (!schema) return true;

      const data = allValues || lastDataRef.current || ({} as T);
      const fullData = { ...data, [field]: value } as T;

      // Si des règles spécifiques existent, les utiliser
      if (schema.rules && schema.rules[field]) {
        const rule = schema.rules[field];
        const error = rule(value, fullData);
        setErrors((prev) => ({ ...prev, [field]: error || undefined }));
        const valid = !error;

        // Mettre à jour la validité globale
        const allErrors = { ...errors, [field]: error || undefined };
        const allValid = Object.values(allErrors).every((e) => !e);
        setIsValid(allValid);

        return valid;
      }

      // Sinon utiliser la validation complète
      const validationErrors = schema.validate(fullData);
      const fieldError = validationErrors[field] || "";
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
      const valid = !fieldError;

      // Mettre à jour la validité globale
      const allErrors = { ...errors, [field]: fieldError };
      const allValid = Object.values(allErrors).every((e) => !e);
      setIsValid(allValid);

      return valid;
    },
    [schema, errors],
  );

  // Valider un champ au blur
  const validateFieldOnBlur = useCallback(
    (field: keyof T, value: any, allValues?: T) => {
      if (!validateOnBlur) return;

      // Marquer le champ comme touché
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Valider le champ
      validateField(field, value, allValues);
    },
    [validateOnBlur, validateField],
  );

  // Marquer un champ comme touché
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  // Effacer toutes les erreurs
  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  // Effacer l'erreur d'un champ
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });

    // Mettre à jour la validité globale
    setErrors((prev) => {
      const allValid = Object.values(prev).every((e) => !e);
      setIsValid(allValid);
      return prev;
    });
  }, []);

  // Réinitialiser la validation
  const reset = useCallback(() => {
    clearErrors();
    setTouched({});
    setIsValid(true);
    setIsValidating(false);
    setValidationCount(0);
    clearTimer();
  }, [clearErrors, clearTimer]);

  // Vérifier si un champ a une erreur
  const hasError = useCallback(
    (field: keyof T): boolean => {
      return !!errors[field];
    },
    [errors],
  );

  // Récupérer l'erreur d'un champ
  const getError = useCallback(
    (field: keyof T): string | undefined => {
      return errors[field];
    },
    [errors],
  );

  // Récupérer toutes les erreurs sous forme de tableau
  const getErrorList = useCallback((): string[] => {
    return Object.values(errors).filter(
      (error) => error !== undefined && error !== "",
    ) as string[];
  }, [errors]);

  // Récupérer le nombre d'erreurs
  const getErrorCount = useCallback((): number => {
    return getErrorList().length;
  }, [getErrorList]);

  // Validation automatique au montage
  useEffect(() => {
    if (validateOnMount && initialData) {
      validate(initialData);
    }
    isFirstRender.current = false;
  }, [validateOnMount, initialData, validate]);

  // Validation automatique au changement (pour les appels externes)
  useEffect(() => {
    if (!isFirstRender.current && initialData && validateOnChange) {
      validateWithDebounce(initialData);
    }
  }, [initialData, validateOnChange, validateWithDebounce]);

  return {
    errors,
    touched,
    isValid,
    isValidating,
    validationCount,
    setErrors,
    setTouched,
    setFieldTouched,
    validate,
    validateField,
    validateFieldOnBlur,
    clearErrors,
    clearFieldError,
    reset,
    hasError,
    getError,
    getErrorList,
    getErrorCount,
  };
};

/**
 * Hook pour créer des règles de validation
 *
 * @param rules - Règles de validation
 * @returns {Object} Schéma de validation
 *
 * @example
 * const validation = useValidationRules({
 *   email: (value) => {
 *     if (!value) return 'Email requis';
 *     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide';
 *     return null;
 *   },
 *   password: (value) => {
 *     if (!value) return 'Mot de passe requis';
 *     if (value.length < 6) return 'Mot de passe trop court';
 *     return null;
 *   },
 *   confirmPassword: (value, allValues) => {
 *     if (value !== allValues.password) return 'Les mots de passe ne correspondent pas';
 *     return null;
 *   }
 * });
 */
export const useValidationRules = <T extends Record<string, any>>(
  rules: Partial<Record<keyof T, (value: any, allValues?: T) => string | null>>,
): ValidationSchema<T> => {
  return {
    rules,
    validate: (data: T) => {
      const errors: Partial<Record<keyof T, string>> = {};

      Object.keys(rules).forEach((key) => {
        const rule = rules[key as keyof T];
        if (rule) {
          const error = rule(data[key as keyof T], data);
          if (error) {
            errors[key as keyof T] = error;
          }
        }
      });

      return errors;
    },
  };
};

/**
 * Hook pour créer un validateur de formulaire
 *
 * @param schema - Schéma de validation
 * @param options - Options supplémentaires
 * @returns {Object} Validateur
 *
 * @example
 * const validator = useValidator(schema);
 *
 * // Valider les données
 * const result = validator.validate(formData);
 * if (result.isValid) {
 *   // Soumettre le formulaire
 * }
 *
 * // Valider un champ
 * const fieldResult = validator.validateField('email', 'test@example.com');
 */
export const useValidator = <T extends Record<string, any>>(
  schema: ValidationSchema<T>,
  options: {
    validateOnChange?: boolean;
    debounce?: number;
  } = {},
): {
  validate: (data: T) => {
    isValid: boolean;
    errors: Partial<Record<keyof T, string>>;
  };
  validateField: (
    field: keyof T,
    value: any,
    allValues?: T,
  ) => { isValid: boolean; error: string | null };
  validateAsync: (
    data: T,
  ) => Promise<{ isValid: boolean; errors: Partial<Record<keyof T, string>> }>;
  getError: (
    field: keyof T,
    errors: Partial<Record<keyof T, string>>,
  ) => string | null;
  hasErrors: (errors: Partial<Record<keyof T, string>>) => boolean;
} => {
  const { validateOnChange: _validateOnChange = false, debounce = 0 } = options;

  let timerRef: NodeJS.Timeout | null = null;

  const clearTimer = useCallback(() => {
    if (timerRef) {
      clearTimeout(timerRef);
      timerRef = null;
    }
  }, []);

  const validate = useCallback(
    (data: T) => {
      const errors = schema.validate(data);
      const isValid = Object.keys(errors).length === 0;
      return { isValid, errors };
    },
    [schema],
  );

  const validateField = useCallback(
    (field: keyof T, value: any, allValues?: T) => {
      const data = allValues || ({} as T);
      const fullData = { ...data, [field]: value } as T;

      // Si des règles spécifiques existent
      if (schema.rules && schema.rules[field]) {
        const rule = schema.rules[field];
        const error = rule(value, fullData);
        return { isValid: !error, error: error || null };
      }

      // Sinon utiliser la validation complète
      const errors = schema.validate(fullData);
      const error = errors[field] || null;
      return { isValid: !error, error };
    },
    [schema],
  );

  const validateAsync = useCallback(
    (
      data: T,
    ): Promise<{
      isValid: boolean;
      errors: Partial<Record<keyof T, string>>;
    }> => {
      clearTimer();

      return new Promise((resolve) => {
        if (debounce > 0) {
          timerRef = setTimeout(() => {
            resolve(validate(data));
          }, debounce);
        } else {
          resolve(validate(data));
        }
      });
    },
    [validate, debounce, clearTimer],
  );

  const getError = useCallback(
    (
      field: keyof T,
      errors: Partial<Record<keyof T, string>>,
    ): string | null => {
      return errors[field] || null;
    },
    [],
  );

  const hasErrors = useCallback(
    (errors: Partial<Record<keyof T, string>>): boolean => {
      return Object.keys(errors).length > 0;
    },
    [],
  );

  return {
    validate,
    validateField,
    validateAsync,
    getError,
    hasErrors,
  };
};

export default useValidation;
