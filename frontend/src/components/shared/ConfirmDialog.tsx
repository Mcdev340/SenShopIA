'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X, Check, Loader2, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  /** Est ouvert */
  isOpen: boolean;
  /** Titre du dialogue */
  title?: string;
  /** Message du dialogue */
  message?: string;
  /** Sous-message */
  subMessage?: string;
  /** Texte du bouton de confirmation */
  confirmText?: string;
  /** Texte du bouton d'annulation */
  cancelText?: string;
  /** Variante du dialogue */
  variant?: 'danger' | 'warning' | 'info' | 'success';
  /** En cours de confirmation */
  isLoading?: boolean;
  /** Callback de confirmation */
  onConfirm: () => void;
  /** Callback d'annulation */
  onCancel: () => void;
  /** Callback de fermeture */
  onClose?: () => void;
  /** Classes supplémentaires */
  className?: string;
  /** Largeur maximale */
  maxWidth?: string;
  /** Désactiver le bouton de confirmation */
  confirmDisabled?: boolean;
  /** Afficher l'icône */
  showIcon?: boolean;
  /** Afficher le bouton de fermeture */
  showCloseButton?: boolean;
  /** Animation d'entrée */
  animate?: boolean;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    confirmColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    confirmTextColor: 'text-white',
    borderColor: 'border-red-200 dark:border-red-800',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    titleColor: 'text-red-800 dark:text-red-200',
    messageColor: 'text-red-700 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    confirmColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    confirmTextColor: 'text-white',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    titleColor: 'text-yellow-800 dark:text-yellow-200',
    messageColor: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    icon: Info,
    confirmColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    confirmTextColor: 'text-white',
    borderColor: 'border-blue-200 dark:border-blue-800',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    titleColor: 'text-blue-800 dark:text-blue-200',
    messageColor: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    icon: CheckCircle,
    confirmColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    confirmTextColor: 'text-white',
    borderColor: 'border-green-200 dark:border-green-800',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    titleColor: 'text-green-800 dark:text-green-200',
    messageColor: 'text-green-700 dark:text-green-300',
  },
};

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir continuer ?',
  subMessage,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
  className = '',
  maxWidth = 'max-w-md',
  confirmDisabled = false,
  showIcon = true,
  showCloseButton = true,
  animate = true,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  // Animation d'entrée
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Gestion de la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
        if (onClose) onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel, onClose]);

  // Focus sur le bouton de confirmation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Empêcher le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
      if (onClose) onClose();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm',
        animate && (isVisible ? 'animate-fadeIn' : 'animate-fadeOut'),
        'transition-all duration-200'
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        ref={dialogRef}
        className={cn(
          'w-full rounded-xl bg-white dark:bg-gray-900 shadow-2xl border',
          config.borderColor,
          maxWidth,
          animate && (isVisible ? 'animate-slideIn' : 'animate-slideOut'),
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {showIcon && (
              <div className={cn(
                'p-2 rounded-full',
                config.iconBg
              )}>
                <Icon className={cn('w-5 h-5', config.iconColor)} />
              </div>
            )}
            <h2 id="confirm-dialog-title" className={cn('text-lg font-semibold', config.titleColor)}>
              {title}
            </h2>
          </div>
          {showCloseButton && (
            <button
              onClick={() => {
                onCancel();
                if (onClose) onClose();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4 space-y-2">
          <p className={cn('text-sm', config.messageColor)}>
            {message}
          </p>
          {subMessage && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subMessage}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => {
              onCancel();
              if (onClose) onClose();
            }}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            className={cn(
              'w-full sm:w-auto order-1 sm:order-2',
              config.confirmColor,
              config.confirmTextColor,
              isLoading && 'opacity-70 cursor-not-allowed'
            )}
            onClick={onConfirm}
            disabled={isLoading || confirmDisabled}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}