'use client';

import React from 'react';
import { Search, Filter, X, SlidersHorizontal, AlertCircle, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NoResultsProps {
  /** Titre du message */
  title?: string;
  /** Description du message */
  description?: string;
  /** Requête de recherche */
  query?: string;
  /** Nombre de filtres actifs */
  activeFilters?: number;
  /** Callback pour effacer la recherche */
  onClearSearch?: () => void;
  /** Callback pour effacer les filtres */
  onClearFilters?: () => void;
  /** Callback pour réinitialiser tout */
  onReset?: () => void;
  /** Classes supplémentaires */
  className?: string;
  /** Variante d'affichage */
  variant?: 'default' | 'compact' | 'minimal';
  /** Icône personnalisée */
  icon?: React.ReactNode;
  /** Type d'icône par défaut */
  iconType?: 'search' | 'filter' | 'alert' | 'file' | 'custom';
  /** Afficher les actions */
  showActions?: boolean;
}

const iconTypes = {
  search: Search,
  filter: Filter,
  alert: AlertCircle,
  file: FileSearch,
};

export default function NoResults({
  title = 'Aucun résultat',
  description = 'Aucun résultat ne correspond à votre recherche.',
  query,
  activeFilters = 0,
  onClearSearch,
  onClearFilters,
  onReset,
  className = '',
  variant = 'default',
  icon,
  iconType = 'search',
  showActions = true,
}: NoResultsProps) {
  const IconComponent = iconTypes[iconType] || Search;
  const hasQuery = query && query.length > 0;
  const hasFilters = activeFilters > 0;
  const showClearSearch = hasQuery && onClearSearch;
  const showClearFilters = hasFilters && onClearFilters;

  // Version minimal
  if (variant === 'minimal') {
    return (
      <div className={cn('text-center py-4', className)}>
        <div className="flex justify-center text-gray-400">
          {icon || <IconComponent className="w-6 h-6" />}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {hasQuery && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            "{query}"
          </p>
        )}
      </div>
    );
  }

  // Version compact
  if (variant === 'compact') {
    return (
      <div className={cn('text-center py-8 px-4', className)}>
        <div className="flex justify-center text-gray-400">
          {icon || <IconComponent className="w-12 h-12" />}
        </div>
        <h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
        {showActions && (showClearSearch || showClearFilters || onReset) && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {showClearSearch && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSearch}
              >
                <X className="w-3 h-3 mr-1" />
                Effacer la recherche
              </Button>
            )}
            {showClearFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
              >
                <Filter className="w-3 h-3 mr-1" />
                Effacer les filtres ({activeFilters})
              </Button>
            )}
            {onReset && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
              >
                <SlidersHorizontal className="w-3 h-3 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Version par défaut
  return (
    <div className={cn('text-center py-12 px-4 max-w-md mx-auto', className)}>
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {icon || <IconComponent className="w-10 h-10 text-gray-400" />}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {hasQuery && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Recherche : "<span className="font-medium">{query}</span>"
        </p>
      )}
      {hasFilters && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          {activeFilters} filtre{activeFilters > 1 ? 's' : ''} actif{activeFilters > 1 ? 's' : ''}
        </p>
      )}
      {showActions && (showClearSearch || showClearFilters || onReset) && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {showClearSearch && (
            <Button
              variant="outline"
              onClick={onClearSearch}
            >
              <X className="w-4 h-4 mr-2" />
              Effacer la recherche
            </Button>
          )}
          {showClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
            >
              <Filter className="w-4 h-4 mr-2" />
              Effacer les filtres ({activeFilters})
            </Button>
          )}
          {onReset && (
            <Button
              onClick={onReset}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Réinitialiser tout
            </Button>
          )}
        </div>
      )}
    </div>
  );
}