'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Package, Search, ShoppingBag, Users, FolderOpen, Inbox, Loader2 } from 'lucide-react';

interface EmptyStateProps {
  /** Titre de l'état vide */
  title?: string;
  /** Description de l'état vide */
  description?: string;
  /** Icône ou emoji */
  icon?: React.ReactNode;
  /** Icône par défaut à utiliser */
  iconType?: 'package' | 'search' | 'shopping' | 'users' | 'folder' | 'inbox';
  /** Texte du bouton d'action */
  actionText?: string;
  /** Lien du bouton d'action */
  actionLink?: string;
  /** Action du bouton */
  onAction?: () => void;
  /** Callback de réessai */
  onRetry?: () => void;
  /** Est en chargement */
  isLoading?: boolean;
  /** Classes supplémentaires */
  className?: string;
  /** Taille de l'icône */
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  /** Variante de l'état vide */
  variant?: 'default' | 'compact' | 'minimal';
  /** Couleur de l'icône */
  iconColor?: string;
}

const iconTypes = {
  package: Package,
  search: Search,
  shopping: ShoppingBag,
  users: Users,
  folder: FolderOpen,
  inbox: Inbox,
};

const iconSizes = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
};

const iconColors = {
  default: 'text-gray-400',
  primary: 'text-primary-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  danger: 'text-red-500',
  info: 'text-blue-500',
};

export default function EmptyState({
  title = 'Aucune donnée',
  description = 'Aucune donnée disponible pour le moment.',
  icon,
  iconType = 'package',
  actionText,
  actionLink,
  onAction,
  onRetry,
  isLoading = false,
  className = '',
  iconSize = 'md',
  variant = 'default',
  iconColor = 'default',
}: EmptyStateProps) {
  const DefaultIcon = iconTypes[iconType];
  const IconComponent = icon || <DefaultIcon className={cn(iconSizes[iconSize], iconColors[iconColor])} />;

  // Version minimal
  if (variant === 'minimal') {
    return (
      <div className={cn('text-center py-6', className)}>
        <div className="flex justify-center">
          {IconComponent}
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
    );
  }

  // Version compact
  if (variant === 'compact') {
    return (
      <div className={cn('text-center py-10 px-4', className)}>
        <div className="flex justify-center">
          {IconComponent}
        </div>
        <h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          {description}
        </p>
        {(actionText && (actionLink || onAction)) && (
          <div className="mt-4">
            {actionLink ? (
              <Link href={actionLink}>
                <Button size="sm" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {actionText}
                </Button>
              </Link>
            ) : (
              <Button size="sm" onClick={onAction} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {actionText}
              </Button>
            )}
          </div>
        )}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  // Version par défaut
  return (
    <div className={cn('text-center py-16 px-4 max-w-lg mx-auto', className)}>
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
          {IconComponent}
        </div>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        {description}
      </p>
      {(actionText && (actionLink || onAction)) && (
        <div className="mt-6">
          {actionLink ? (
            <Link href={actionLink}>
              <Button disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction} disabled={isLoading} size="lg">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {actionText}
            </Button>
          )}
        </div>
      )}
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={onRetry}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
}