import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/**
 * Options pour le hook useMediaQuery
 */
export interface UseMediaQueryOptions {
  /** Délai de debounce en millisecondes (défaut: 0) */
  debounce?: number;
  /** Valeur initiale (défaut: false) */
  defaultValue?: boolean;
  /** Ne pas exécuter le callback au premier rendu (défaut: false) */
  skipFirst?: boolean;
  /** Callback appelé quand la requête correspond */
  onMatch?: () => void;
  /** Callback appelé quand la requête ne correspond pas */
  onUnmatch?: () => void;
  /** Callback appelé quand la requête change */
  onChange?: (matches: boolean) => void;
}

/**
 * Hook pour les media queries
 * Permet de détecter si une media query correspond
 *
 * @param query - La media query à écouter (ex: '(max-width: 768px)')
 * @param options - Options supplémentaires
 * @returns boolean - true si la query correspond
 *
 * @example
 * // Exemple basique
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 * const isDesktop = useMediaQuery('(min-width: 1025px)');
 *
 * // Avec options
 * const isMobile = useMediaQuery('(max-width: 768px)', {
 *   debounce: 200,
 *   onMatch: () => console.log('Mode mobile activé'),
 *   onUnmatch: () => console.log('Mode mobile désactivé'),
 *   onChange: (matches) => console.log('Match:', matches)
 * });
 *
 * return (
 *   <div>
 *     {isMobile && <MobileLayout />}
 *     {isTablet && <TabletLayout />}
 *     {isDesktop && <DesktopLayout />}
 *   </div>
 * );
 */
export const useMediaQuery = (
  query: string,
  options: UseMediaQueryOptions = {},
): boolean => {
  const {
    debounce = 0,
    defaultValue = false,
    skipFirst = false,
    onMatch,
    onUnmatch,
    onChange,
  } = options;

  // État pour stocker le résultat
  const [matches, setMatches] = useState<boolean>(defaultValue);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const previousMatches = useRef<boolean>(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour nettoyer le timeout
  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      globalThis.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Fonction pour mettre à jour les matches
  const updateMatches = useCallback(
    (newMatches: boolean) => {
      // Vérifier si c'est le premier rendu
      if (skipFirst && isFirstRender) {
        setIsFirstRender(false);
        previousMatches.current = newMatches;
        return;
      }

      // Mettre à jour l'état
      setMatches(newMatches);

      // Appeler les callbacks
      if (newMatches !== previousMatches.current) {
        if (onChange) {
          onChange(newMatches);
        }
        if (newMatches && onMatch) {
          onMatch();
        } else if (!newMatches && onUnmatch) {
          onUnmatch();
        }
      }

      previousMatches.current = newMatches;
    },
    [skipFirst, isFirstRender, onChange, onMatch, onUnmatch],
  );

  // Fonction pour gérer les changements de media query
  const handleChange = useCallback(
    (event: MediaQueryListEvent) => {
      const newMatches = event.matches;

      if (debounce > 0) {
        clearPendingTimeout();
        timeoutRef.current = setTimeout(() => {
          updateMatches(newMatches);
        }, debounce);
      } else {
        updateMatches(newMatches);
      }
    },
    [debounce, clearPendingTimeout, updateMatches],
  );

  // Initialiser la media query
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Mettre à jour la valeur initiale
    const initialMatches = mediaQuery.matches;
    updateMatches(initialMatches);

    // Créer un écouteur d'événements
    // Utiliser addEventListener si disponible (méthode moderne)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        clearPendingTimeout();
      };
    }
    // Fallback pour les navigateurs plus anciens
    else {
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
        clearPendingTimeout();
      };
    }
  }, [query, handleChange, clearPendingTimeout, updateMatches]);

  return matches;
};

/**
 * Hook pour les breakpoints prédéfinis
 * Facilite l'utilisation des breakpoints courants
 *
 * @param breakpoints - Breakpoints personnalisés (optionnel)
 * @returns {Object} État des breakpoints
 *
 * @example
 * const { isMobile, isTablet, isDesktop, isSmall, isMedium, isLarge } = useBreakpoints();
 *
 * // Avec breakpoints personnalisés
 * const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints({
 *   xs: 0,
 *   sm: 480,
 *   md: 768,
 *   lg: 1024,
 *   xl: 1280
 * });
 */
export const useBreakpoints = (breakpoints?: Record<string, number>) => {
  const defaultBreakpoints = {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const bp = useMemo(() => {
    return { ...defaultBreakpoints, ...breakpoints };
  }, [breakpoints]);

  const [width, setWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breakpointsResult = useMemo(() => {
    const result: Record<string, boolean> = {};
    const bpKeys = (Object.keys(bp) as Array<keyof typeof bp>).sort(
      (a, b) => bp[a] - bp[b],
    );

    // Déterminer le breakpoint actuel
    let currentBreakpoint = bpKeys[0];
    for (let i = bpKeys.length - 1; i >= 0; i--) {
      const key = bpKeys[i];
      if (width >= bp[key]) {
        currentBreakpoint = key;
        break;
      }
    }

    // Créer les valeurs de retour
    bpKeys.forEach((key) => {
      const minWidth = bp[key];
      const nextKey = bpKeys[bpKeys.indexOf(key) + 1];
      const maxWidth = nextKey ? bp[nextKey] - 1 : Infinity;

      result[key] = width >= minWidth && width <= maxWidth;
    });

    // Ajouter des utilitaires
    return {
      ...result,
      current: currentBreakpoint,
      width,
      isMobile: width < bp.md,
      isTablet: width >= bp.md && width < bp.lg,
      isDesktop: width >= bp.lg,
      isSmall: width < bp.sm,
      isMedium: width >= bp.sm && width < bp.lg,
      isLarge: width >= bp.lg,
      isXs: width < bp.sm,
      isSm: width >= bp.sm && width < bp.md,
      isMd: width >= bp.md && width < bp.lg,
      isLg: width >= bp.lg && width < bp.xl,
      isXl: width >= bp.xl,
    };
  }, [width, bp]);

  return breakpointsResult;
};

/**
 * Hook pour les media queries avec orientation
 *
 * @param orientation - Orientation ('portrait' | 'landscape')
 * @param options - Options supplémentaires
 * @returns boolean - true si l'orientation correspond
 *
 * @example
 * const isPortrait = useOrientation('portrait');
 * const isLandscape = useOrientation('landscape');
 */
export const useOrientation = (
  orientation: "portrait" | "landscape",
  options: UseMediaQueryOptions = {},
): boolean => {
  const query =
    orientation === "portrait"
      ? "(orientation: portrait)"
      : "(orientation: landscape)";
  return useMediaQuery(query, options);
};

/**
 * Hook pour les media queries de préférence de couleur
 *
 * @param mode - Mode ('light' | 'dark')
 * @param options - Options supplémentaires
 * @returns boolean - true si la préférence correspond
 *
 * @example
 * const prefersDark = useColorScheme('dark');
 * const prefersLight = useColorScheme('light');
 */
export const useColorScheme = (
  mode: "light" | "dark",
  options: UseMediaQueryOptions = {},
): boolean => {
  const query = `(prefers-color-scheme: ${mode})`;
  return useMediaQuery(query, options);
};

/**
 * Hook pour les media queries de mouvement réduit
 *
 * @param options - Options supplémentaires
 * @returns boolean - true si l'utilisateur préfère les mouvements réduits
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <div style={{
 *     transition: prefersReducedMotion ? 'none' : 'all 0.3s'
 *   }}>
 *     Contenu
 *   </div>
 * );
 */
export const useReducedMotion = (
  options: UseMediaQueryOptions = {},
): boolean => {
  const query = "(prefers-reduced-motion: reduce)";
  return useMediaQuery(query, options);
};

/**
 * Hook pour les media queries de contraste élevé
 *
 * @param options - Options supplémentaires
 * @returns boolean - true si l'utilisateur préfère le contraste élevé
 *
 * @example
 * const prefersHighContrast = useHighContrast();
 */
export const useHighContrast = (
  options: UseMediaQueryOptions = {},
): boolean => {
  const query = "(prefers-contrast: high)";
  return useMediaQuery(query, options);
};

/**
 * Hook pour les media queries de préférence de thème
 *
 * @param theme - Thème ('dark' | 'light')
 * @param options - Options supplémentaires
 * @returns boolean - true si le thème correspond
 *
 * @example
 * const prefersDark = useThemePreference('dark');
 */
export const useThemePreference = (
  theme: "dark" | "light",
  options: UseMediaQueryOptions = {},
): boolean => {
  const query = `(prefers-color-scheme: ${theme})`;
  return useMediaQuery(query, options);
};

/**
 * Hook pour les media queries de préférence de réduction de données
 *
 * @param options - Options supplémentaires
 * @returns boolean - true si l'utilisateur préfère réduire les données
 *
 * @example
 * const prefersReducedData = useReducedData();
 */
export const useReducedData = (options: UseMediaQueryOptions = {}): boolean => {
  const query = "(prefers-reduced-data: reduce)";
  return useMediaQuery(query, options);
};

/**
 * Hook pour les media queries de préférence de transparence
 *
 * @param options - Options supplémentaires
 * @returns boolean - true si l'utilisateur préfère la transparence réduite
 *
 * @example
 * const prefersReducedTransparency = useReducedTransparency();
 */
export const useReducedTransparency = (
  options: UseMediaQueryOptions = {},
): boolean => {
  const query = "(prefers-reduced-transparency: reduce)";
  return useMediaQuery(query, options);
};

/**
 * Type du retour du hook useMediaQuery
 */
export type UseMediaQueryReturn = boolean;

/**
 * Type du retour du hook useBreakpoints
 */
export type UseBreakpointsReturn = {
  [key: string]: boolean | string | number;
  current: string;
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
};

export default useMediaQuery;
