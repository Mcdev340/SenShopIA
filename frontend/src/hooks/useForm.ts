import { useState, useCallback, ChangeEvent, FormEvent } from "react";

/**
 * Hook pour la gestion de formulaires
 *
 * @param initialValues - Valeurs initiales du formulaire
 * @param onSubmit - Fonction de soumission (optionnel)
 * @param validate - Fonction de validation (optionnel)
 * @returns {Object} État et actions du formulaire
 *
 * @example
 * const {
 *   values,
 *   errors,
 *   handleChange,
 *   handleSubmit,
 *   reset,
 *   setFieldValue,
 *   setFieldError,
 *   isSubmitting,
 *   isValid
 * } = useForm(
 *   { email: '', password: '' },
 *   (data) => console.log('Submit:', data),
 *   (data) => {
 *     const errors: Record<string, string> = {};
 *     if (!data.email) errors.email = 'Email requis';
 *     if (!data.password) errors.password = 'Mot de passe requis';
 *     return errors;
 *   }
 * );
 *
 * // Dans le render
 * <input
 *   name="email"
 *   value={values.email}
 *   onChange={handleChange}
 *   error={errors.email}
 * />
 */
export interface UseFormReturn<T extends Record<string, any>> {
  /** Valeurs du formulaire */
  values: T;
  /** Erreurs de validation */
  errors: Partial<Record<keyof T, string>>;
  /** En cours de soumission */
  isSubmitting: boolean;
  /** Valide ou non */
  isValid: boolean;
  /** A été modifié */
  isDirty: boolean;
  /** A été soumis */
  isSubmitted: boolean;
  /** Nombre de tentatives de soumission */
  submitCount: number;
  /** Définir toutes les valeurs */
  setValues: (values: T | ((prev: T) => T)) => void;
  /** Définir les erreurs */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  /** Définir un champ spécifique */
  setFieldValue: (name: keyof T, value: any) => void;
  /** Définir l'erreur d'un champ spécifique */
  setFieldError: (name: keyof T, error: string) => void;
  /** Gérer le changement d'un champ */
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  /** Gérer le blur d'un champ */
  handleBlur: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  /** Soumettre le formulaire */
  handleSubmit: (e?: FormEvent) => Promise<void>;
  /** Valider le formulaire */
  validate: () => boolean;
  /** Valider un champ spécifique */
  validateField: (name: keyof T) => boolean;
  /** Réinitialiser le formulaire */
  reset: () => void;
  /** Réinitialiser le formulaire avec de nouvelles valeurs */
  resetWithValues: (newValues: T) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit?: (values: T) => void | Promise<void>,
  validate?: (values: T) => Partial<Record<keyof T, string>>,
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [submitCount, setSubmitCount] = useState<number>(0);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    const valid = Object.keys(validationErrors).length === 0;
    return valid;
  }, [validate, values]);

  const validateField = useCallback(
    (name: keyof T): boolean => {
      if (!validate) return true;

      // Valider uniquement le champ spécifique
      const fullErrors = validate(values);
      const fieldError = fullErrors[name] || "";

      setErrors((prev) => ({ ...prev, [name]: fieldError }));
      return !fieldError;
    },
    [validate, values],
  );

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const parsedValue = type === "number" ? parseFloat(value) : value;

      setValues((prev) => ({ ...prev, [name]: parsedValue }));
      setIsDirty(true);

      // Valider le champ si déjà touché
      if (touched[name]) {
        validateField(name as keyof T);
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name as keyof T);
    },
    [validateField],
  );

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      setSubmitCount((prev) => prev + 1);
      setIsSubmitted(true);

      // Marquer tous les champs comme touchés
      const allTouched = Object.keys(values).reduce(
        (acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        },
        {} as Partial<Record<keyof T, boolean>>,
      );
      setTouched(allTouched);

      // Valider le formulaire
      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, onSubmit, validateForm],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitted(false);
    setSubmitCount(0);
    setTouched({});
  }, [initialValues]);

  const resetWithValues = useCallback((newValues: T) => {
    setValues(newValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitted(false);
    setSubmitCount(0);
    setTouched({});
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    isDirty,
    isSubmitted,
    submitCount,
    setValues,
    setErrors,
    setFieldValue,
    setFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    validate: validateForm,
    validateField,
    reset,
    resetWithValues,
  };
};

export default useForm;
