import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Options pour le hook useWindowSize
 */
export interface UseWindowSizeOptions {
  /** Délai de debounce en millisecondes (défaut: 0) */
  debounce?: number;
  /** Appeler le callback uniquement si la taille change réellement */
  onlyOnChange?: boolean;
  /** Callback appelé quand la taille change */
  onChange?: (size: { width: number; height: number }) => void;
  /** Callback appelé à chaque resize */
  onResize?: (size: { width: number; height: number }) => void;
}

/**
 * Retour du hook useWindowSize
 */
export interface UseWindowSizeReturn {
  /** Largeur de la fenêtre */
  width: number;
  /** Hauteur de la fenêtre */
  height: number;
  /** Est en mode mobile (largeur < 768px) */
  isMobile: boolean;
  /** Est en mode tablette (768px <= largeur < 1024px) */
  isTablet: boolean;
  /** Est en mode desktop (largeur >= 1024px) */
  isDesktop: boolean;
  /** Est en mode portrait */
  isPortrait: boolean;
  /** Est en mode paysage */
  isLandscape: boolean;
  /** Breakpoint actuel */
  currentBreakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

/**
 * Hook pour obtenir la taille de la fenêtre
 * Se met à jour automatiquement lors du redimensionnement
 *
 * @param options - Options supplémentaires
 * @returns {Object} Taille de la fenêtre et breakpoints
 *
 * @example
 * // Exemple basique
 * const { width, height, isMobile } = useWindowSize();
 *
 * return (
 *   <div>
 *     <p>Largeur: {width}px</p>
 *     <p>Hauteur: {height}px</p>
 *     {isMobile && <p>📱 Mode mobile</p>}
 *   </div>
 * );
 *
 * // Avec options
 * const { width, height, isMobile } = useWindowSize({
 *   debounce: 200,
 *   onlyOnChange: true,
 *   onChange: (size) => console.log('Taille changée:', size),
 *   onResize: (size) => console.log('Resize:', size)
 * });
 */
export const useWindowSize = (
  options: UseWindowSizeOptions = {},
): UseWindowSizeReturn => {
  const { debounce = 0, onlyOnChange = false, onChange, onResize } = options;

  // État initial
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>(() => {
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: 0,
      height: 0,
    };
  });

  // Référence pour stocker la taille précédente
  const previousSize = useRef<{ width: number; height: number }>(windowSize);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer le timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Mettre à jour la taille
  const updateSize = useCallback(() => {
    if (typeof window === "undefined") return;

    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Vérifier si la taille a changé
    const hasChanged =
      newSize.width !== previousSize.current.width ||
      newSize.height !== previousSize.current.height;

    if (onlyOnChange && !hasChanged) {
      return;
    }

    // Mettre à jour l'état
    setWindowSize(newSize);
    previousSize.current = newSize;

    // Appeler les callbacks
    if (hasChanged && onChange) {
      onChange(newSize);
    }
    if (onResize) {
      onResize(newSize);
    }
  }, [onlyOnChange, onChange, onResize]);

  // Gérer le resize avec debounce
  const handleResize = useCallback(() => {
    clearTimer();

    if (debounce > 0) {
      timerRef.current = setTimeout(() => {
        updateSize();
      }, debounce);
    } else {
      updateSize();
    }
  }, [debounce, clearTimer, updateSize]);

  // Ajouter l'écouteur d'événements
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mettre à jour immédiatement
    updateSize();

    // Ajouter l'écouteur d'événements
    window.addEventListener("resize", handleResize);

    // Nettoyer
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimer();
    };
  }, [handleResize, clearTimer, updateSize]);

  // Calculer les breakpoints
  const width = windowSize.width;
  const height = windowSize.height;

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isPortrait = height > width;
  const isLandscape = width > height;

  // Déterminer le breakpoint
  let currentBreakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  if (width < 480) {
    currentBreakpoint = "xs";
  } else if (width < 640) {
    currentBreakpoint = "sm";
  } else if (width < 768) {
    currentBreakpoint = "md";
  } else if (width < 1024) {
    currentBreakpoint = "lg";
  } else if (width < 1280) {
    currentBreakpoint = "xl";
  } else {
    currentBreakpoint = "2xl";
  }

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    currentBreakpoint,
  };
};

/**
 * Hook pour obtenir seulement la largeur
 *
 * @param options - Options supplémentaires
 * @returns Largeur de la fenêtre
 *
 * @example
 * const width = useWindowWidth({ debounce: 200 });
 */
export const useWindowWidth = (
  options: Omit<UseWindowSizeOptions, "onChange" | "onResize"> = {},
): number => {
  const { width } = useWindowSize(options);
  return width;
};

/**
 * Hook pour obtenir seulement la hauteur
 *
 * @param options - Options supplémentaires
 * @returns Hauteur de la fenêtre
 *
 * @example
 * const height = useWindowHeight({ debounce: 200 });
 */
export const useWindowHeight = (
  options: Omit<UseWindowSizeOptions, "onChange" | "onResize"> = {},
): number => {
  const { height } = useWindowSize(options);
  return height;
};

/**
 * Hook pour vérifier si l'écran est en dessous d'un breakpoint
 *
 * @param breakpoint - Breakpoint en pixels
 * @param options - Options supplémentaires
 * @returns boolean - true si la largeur est inférieure au breakpoint
 *
 * @example
 * const isSmall = useBreakpointDown(768);
 * const isMedium = useBreakpointDown(1024);
 */
export const useBreakpointDown = (
  breakpoint: number,
  options: Omit<UseWindowSizeOptions, "onChange" | "onResize"> = {},
): boolean => {
  const { width } = useWindowSize(options);
  return width < breakpoint;
};

/**
 * Hook pour vérifier si l'écran est au-dessus d'un breakpoint
 *
 * @param breakpoint - Breakpoint en pixels
 * @param options - Options supplémentaires
 * @returns boolean - true si la largeur est supérieure ou égale au breakpoint
 *
 * @example
 * const isDesktop = useBreakpointUp(1024);
 * const isTablet = useBreakpointUp(768);
 */
export const useBreakpointUp = (
  breakpoint: number,
  options: Omit<UseWindowSizeOptions, "onChange" | "onResize"> = {},
): boolean => {
  const { width } = useWindowSize(options);
  return width >= breakpoint;
};

/**
 * Hook pour vérifier si l'écran est entre deux breakpoints
 *
 * @param min - Breakpoint minimum
 * @param max - Breakpoint maximum
 * @param options - Options supplémentaires
 * @returns boolean - true si la largeur est entre min et max
 *
 * @example
 * const isTablet = useBreakpointBetween(768, 1024);
 * const isMobile = useBreakpointBetween(0, 768);
 */
export const useBreakpointBetween = (
  min: number,
  max: number,
  options: Omit<UseWindowSizeOptions, "onChange" | "onResize"> = {},
): boolean => {
  const { width } = useWindowSize(options);
  return width >= min && width < max;
};

/**
 * Hook pour le débogage des breakpoints
 *
 * @param options - Options supplémentaires
 * @returns {Object} Informations de débogage
 *
 * @example
 * const debug = useWindowDebug();
 * console.log(debug);
 */
export const useWindowDebug = (
  options: Omit<UseWindowSizeOptions, "onChange" | "onResize"> = {},
) => {
  const size = useWindowSize(options);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    ...size,
    isClient,
    toString: () => {
      return `Window: ${size.width}x${size.height} (${size.currentBreakpoint})`;
    },
  };
};

export default useWindowSize;
