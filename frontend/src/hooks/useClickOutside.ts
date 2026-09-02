import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour détecter un clic en dehors d'un élément
 * Utile pour fermer les menus, modales, dropdowns, etc.
 * 
 * @param handler - Fonction appelée lors d'un clic extérieur
 * @param enabled - Activer/désactiver le hook (défaut: true)
 * @param ignoreRefs - Références d'éléments à ignorer (optionnel)
 * @returns Ref à attacher à l'élément
 * 
 * @example
 * // Exemple basique
 * const ref = useClickOutside(() => closeModal());
 * 
 * return (
 *   <div ref={ref}>
 *     <h1>Contenu de la modale</h1>
 *     <button onClick={closeModal}>Fermer</button>
 *   </div>
 * );
 * 
 * // Exemple avec ignoreRefs
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * const modalRef = useClickOutside(
 *   () => closeModal(),
 *   true,
 *   [buttonRef]
 * );
 * 
 * return (
 *   <>
 *     <button ref={buttonRef} onClick={openModal}>Ouvrir</button>
 *     <div ref={modalRef}>Contenu modale</div>
 *   </>
 * );
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  enabled: boolean = true,
  ignoreRefs: React.RefObject<HTMLElement>[] = []
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled) return;
      
      const target = event.target as Node;
      
      // Vérifier si le clic est en dehors de l'élément principal
      if (ref.current && !ref.current.contains(target)) {
        // Vérifier si le clic est sur un élément à ignorer
        const isIgnored = ignoreRefs.some(
          (ignoreRef) => ignoreRef.current && ignoreRef.current.contains(target)
        );
        
        if (!isIgnored) {
          handler();
        }
      }
    },
    [handler, enabled, ignoreRefs]
  );

  useEffect(() => {
    if (!enabled) return;

    // Utiliser mousedown et touchstart pour une meilleure couverture
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handleClickOutside, enabled]);

  return ref;
};

/**
 * Type du retour du hook
 */
export type UseClickOutsideReturn<T extends HTMLElement = HTMLDivElement> = React.RefObject<T>;

export default useClickOutside;