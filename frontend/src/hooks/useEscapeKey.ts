import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook pour détecter la touche Échap
 * Utile pour fermer les modales, menus, dropdowns, etc.
 * 
 * @param handler - Fonction appelée lors de l'appui sur Échap
 * @param enabled - Activer/désactiver le hook (défaut: true)
 * @param options - Options supplémentaires
 * @returns void
 * 
 * @example
 * // Exemple basique
 * useEscapeKey(() => closeModal());
 * 
 * // Avec condition
 * useEscapeKey(() => closeModal(), isOpen);
 * 
 * // Avec options
 * useEscapeKey(() => closeModal(), true, {
 *   preventDefault: true,
 *   stopPropagation: true,
 *   ignoreInputs: true,
 *   eventType: 'keydown'
 * });
 */
export interface UseEscapeKeyOptions {
  /** Empêcher le comportement par défaut (défaut: true) */
  preventDefault?: boolean;
  /** Arrêter la propagation de l'événement (défaut: false) */
  stopPropagation?: boolean;
  /** Ignorer l'événement si la cible est un champ de saisie (défaut: true) */
  ignoreInputs?: boolean;
  /** Type d'événement à écouter (défaut: 'keydown') */
  eventType?: 'keydown' | 'keyup' | 'keypress';
  /** Ne pas déclencher si une modale est ouverte (défaut: false) */
  ignoreModals?: boolean;
  /** Liste des éléments à ignorer */
  ignoreElements?: string[];
}

export const useEscapeKey = (
  handler: () => void,
  enabled: boolean = true,
  options: UseEscapeKeyOptions = {}
): void => {
  const {
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
    eventType = 'keydown',
    ignoreModals = false,
    ignoreElements = [],
  } = options;

  const handlerRef = useRef(handler);
  const enabledRef = useRef(enabled);

  // Mettre à jour les refs
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Vérifier si le hook est activé
    if (!enabledRef.current) return;

    // Vérifier si c'est la touche Échap
    if (event.key !== 'Escape') return;

    // Ignorer si la cible est un champ de saisie
    if (ignoreInputs) {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isContentEditable = target.contentEditable === 'true';
      
      if (isInput || isContentEditable) {
        return;
      }
    }

    // Ignorer les éléments spécifiques
    if (ignoreElements.length > 0) {
      const target = event.target as HTMLElement;
      const isIgnored = ignoreElements.some(selector => 
        target.matches?.(selector) || target.closest?.(selector)
      );
      if (isIgnored) return;
    }

    // Ignorer les modales
    if (ignoreModals) {
      const target = event.target as HTMLElement;
      const isInModal = target.closest?.('[role="dialog"]') || 
                        target.closest?.('.modal') ||
                        target.closest?.('[data-modal="true"]');
      if (isInModal) return;
    }

    // Empêcher le comportement par défaut
    if (preventDefault) {
      event.preventDefault();
    }

    // Arrêter la propagation
    if (stopPropagation) {
      event.stopPropagation();
    }

    // Appeler le handler
    handlerRef.current();
  }, [ignoreInputs, ignoreElements, ignoreModals, preventDefault, stopPropagation]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener(eventType, handleKeyDown);

    return () => {
      document.removeEventListener(eventType, handleKeyDown);
    };
  }, [enabled, eventType, handleKeyDown]);
};

/**
 * Hook pour gérer plusieurs touches
 * 
 * @param keyMap - Map des touches et leurs handlers
 * @param enabled - Activer/désactiver le hook (défaut: true)
 * @param options - Options supplémentaires
 * 
 * @example
 * useKeyboard({
 *   Escape: () => closeModal(),
 *   Enter: () => submitForm(),
 *   ArrowDown: () => nextItem(),
 *   ArrowUp: () => previousItem(),
 * }, true, { preventDefault: true });
 */
export const useKeyboard = (
  keyMap: Record<string, () => void>,
  enabled: boolean = true,
  options: Omit<UseEscapeKeyOptions, 'ignoreInputs'> & { ignoreInputs?: boolean } = {}
): void => {
  const {
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
    eventType = 'keydown',
  } = options;

  const keyMapRef = useRef(keyMap);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    keyMapRef.current = keyMap;
  }, [keyMap]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabledRef.current) return;

    // Ignorer si la cible est un champ de saisie
    if (ignoreInputs) {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isContentEditable = target.contentEditable === 'true';
      
      if (isInput || isContentEditable) {
        return;
      }
    }

    const handler = keyMapRef.current[event.key];
    if (handler) {
      if (preventDefault) {
        event.preventDefault();
      }
      if (stopPropagation) {
        event.stopPropagation();
      }
      handler();
    }
  }, [ignoreInputs, preventDefault, stopPropagation]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener(eventType, handleKeyDown);

    return () => {
      document.removeEventListener(eventType, handleKeyDown);
    };
  }, [enabled, eventType, handleKeyDown]);
};

/**
 * Type du retour du hook useEscapeKey
 */
export type UseEscapeKeyReturn = void;

/**
 * Type du retour du hook useKeyboard
 */
export type UseKeyboardReturn = void;

export default useEscapeKey;