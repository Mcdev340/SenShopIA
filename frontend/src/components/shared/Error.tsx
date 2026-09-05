'use client';

import { AlertCircle, RefreshCw, Home, ArrowLeft, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ErrorProps {
  /** Titre de l'erreur */
  title?: string;
  /** Message de l'erreur */
  message?: string;
  /** Code d'erreur */
  code?: string | number;
  /** Sous-message */
  subMessage?: string;
  /** Callback de réessai */
  onRetry?: () => void;
  /** Callback de retour */
  onBack?: () => void;
  /** Est en chargement */
  isLoading?: boolean;
  /** Classes supplémentaires */
  className?: string;
  /** Variante de l'erreur */
  variant?: 'default' | 'compact' | 'minimal' | 'fullscreen';
  /** Type d'erreur */
  type?: 'error' | 'warning' | 'info' | 'not-found';
  /** Afficher les détails */
  showDetails?: boolean;
  /** Détails de l'erreur */
  details?: string;
  /** Afficher l'icône */
  showIcon?: boolean;
  /** Afficher le code */
  showCode?: boolean;
}

const typeConfig = {
  error: {
    icon: AlertCircle,
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
    borderColor: 'border-red-200 dark:border-red-800',
    titleColor: 'text-red-800 dark:text-red-200',
    messageColor: 'text-red-700 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    color: 'yellow',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    titleColor: 'text-yellow-800 dark:text-yellow-200',
    messageColor: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    icon: AlertCircle,
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200 dark:border-blue-800',
    titleColor: 'text-blue-800 dark:text-blue-200',
    messageColor: 'text-blue-700 dark:text-blue-300',
  },
  'not-found': {
    icon: XCircle,
    color: 'gray',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-500',
    borderColor: 'border-gray-200 dark:border-gray-700',
    titleColor: 'text-gray-800 dark:text-gray-200',
    messageColor: 'text-gray-600 dark:text-gray-400',
  },
};

export default function Error({
  title = 'Une erreur est survenue',
  message = 'Nous sommes désolés, une erreur inattendue s\'est produite.',
  subMessage,
  code,
  onRetry,
  onBack,
  isLoading = false,
  className = '',
  variant = 'default',
  type = 'error',
  showDetails = false,
  details,
  showIcon = true,
  showCode = true,
}: ErrorProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  // Version minimal
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center space-x-3 p-3', className)}>
        {showIcon && <Icon className={cn('w-5 h-5 flex-shrink-0', config.iconColor)} />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    );
  }

  // Version compact
  if (variant === 'compact') {
    return (
      <div className={cn('p-4 rounded-lg border', config.borderColor, config.bgColor, className)}>
        <div className="flex items-start space-x-3">
          {showIcon && <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />}
          <div className="flex-1 min-w-0">
            <h4 className={cn('text-sm font-medium', config.titleColor)}>{title}</h4>
            <p className={cn('text-sm', config.messageColor)}>{message}</p>
            {showDetails && details && (
              <pre className="mt-2 p-2 rounded text-xs bg-white/50 dark:bg-black/20 overflow-x-auto">
                {details}
              </pre>
            )}
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Réessayer'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Version fullscreen
  if (variant === 'fullscreen') {
    return (
      <div className={cn('min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900', className)}>
        <div className="text-center max-w-md mx-auto">
          {showIcon && (
            <div className={cn('w-20 h-20 rounded-full flex items-center justify-center mx-auto', config.bgColor)}>
              <Icon className={cn('w-10 h-10', config.iconColor)} />
            </div>
          )}
          {showCode && code && (
            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{code}</p>
          )}
          <h1 className={cn('mt-4 text-2xl font-bold', config.titleColor)}>{title}</h1>
          <p className={cn('mt-2', config.messageColor)}>{message}</p>
          {subMessage && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subMessage}</p>
          )}
          {showDetails && details && (
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-gray-200 overflow-x-auto text-left">
              {details}
            </pre>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}
            {onRetry && (
              <Button onClick={onRetry} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Version par défaut
  return (
    <div className={cn('text-center py-12 px-4 max-w-md mx-auto', className)}>
      {showIcon && (
        <div className="flex justify-center">
          <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', config.bgColor)}>
            <Icon className={cn('w-8 h-8', config.iconColor)} />
          </div>
        </div>
      )}
      {showCode && code && (
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Erreur {code}
        </p>
      )}
      <h3 className={cn('mt-4 text-lg font-semibold', config.titleColor)}>
        {title}
      </h3>
      <p className={cn('mt-2 text-sm', config.messageColor)}>
        {message}
      </p>
      {subMessage && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subMessage}</p>
      )}
      {showDetails && details && (
        <pre className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-800 dark:text-gray-200 overflow-x-auto text-left">
          {details}
        </pre>
      )}
      {(onRetry || onBack) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}