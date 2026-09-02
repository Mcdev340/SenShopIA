import { useState, useCallback } from "react";

/**
 * Hook pour la pagination
 *
 * @param initialPage - Page initiale (défaut: 1)
 * @param totalPages - Nombre total de pages (défaut: 1)
 * @param initialLimit - Nombre d'éléments par page (défaut: 20)
 * @returns {Object} État et actions de pagination
 *
 * @example
 * const {
 *   page,
 *   limit,
 *   totalPages,
 *   goToPage,
 *   nextPage,
 *   previousPage,
 *   setLimit,
 *   hasNext,
 *   hasPrevious,
 *   getPageNumbers
 * } = usePagination(1, 10, 20);
 *
 * // Aller à la page 3
 * goToPage(3);
 *
 * // Page suivante
 * nextPage();
 *
 * // Changer le nombre d'éléments par page
 * setLimit(50);
 *
 * // Récupérer les numéros de page pour l'affichage
 * const pages = getPageNumbers();
 */
export interface UsePaginationReturn {
  /** Page actuelle */
  page: number;
  /** Nombre d'éléments par page */
  limit: number;
  /** Nombre total de pages */
  totalPages: number;
  /** Définir la page */
  setPage: (page: number) => void;
  /** Définir le nombre d'éléments par page */
  setLimit: (limit: number) => void;
  /** Aller à une page spécifique */
  goToPage: (page: number) => void;
  /** Page suivante */
  nextPage: () => void;
  /** Page précédente */
  previousPage: () => void;
  /** Première page */
  firstPage: () => void;
  /** Dernière page */
  lastPage: () => void;
  /** A une page suivante */
  hasNext: boolean;
  /** A une page précédente */
  hasPrevious: boolean;
  /** Est la première page */
  isFirstPage: boolean;
  /** Est la dernière page */
  isLastPage: boolean;
  /** Récupérer les numéros de page pour l'affichage */
  getPageNumbers: (maxDisplayed?: number) => (number | string)[];
  /** Réinitialiser la pagination */
  reset: () => void;
}

export const usePagination = (
  initialPage: number = 1,
  totalPages: number = 1,
  initialLimit: number = 20,
): UsePaginationReturn => {
  const [page, setPage] = useState<number>(
    Math.max(1, Math.min(initialPage, totalPages)),
  );
  const [limit, setLimit] = useState<number>(initialLimit);

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  const reset = useCallback(() => {
    setPage(Math.max(1, Math.min(initialPage, totalPages)));
    setLimit(initialLimit);
  }, [initialPage, totalPages, initialLimit]);

  const getPageNumbers = useCallback(
    (maxDisplayed: number = 5): (number | string)[] => {
      if (totalPages <= maxDisplayed) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | string)[] = [];
      const half = Math.floor(maxDisplayed / 2);
      let start = Math.max(1, page - half);
      let end = Math.min(totalPages, page + half);

      if (end - start < maxDisplayed - 1) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxDisplayed - 1);
        } else if (end === totalPages) {
          start = Math.max(1, end - maxDisplayed + 1);
        }
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }

      return pages;
    },
    [page, totalPages],
  );

  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return {
    page,
    limit,
    totalPages,
    setPage: goToPage,
    setLimit,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    hasNext,
    hasPrevious,
    isFirstPage,
    isLastPage,
    getPageNumbers,
    reset,
  };
};

export default usePagination;
