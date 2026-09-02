import { useUIStore } from "@/store/uiStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEscapeKey } from "./useEscapeKey";

/**
 * Options pour le hook useModal
 */
export interface UseModalOptions {
  /** Fermer la modale avec la touche Échap (défaut: true) */
  closeOnEscape?: boolean;
  /** Fermer la modale en cliquant à l'extérieur (défaut: true) */
  closeOnOutsideClick?: boolean;
  /** Fermer la modale après une durée (défaut: 0 = jamais) */
  autoClose?: number;
  /** Callback appelé à l'ouverture */
  onOpen?: () => void;
  /** Callback appelé à la fermeture */
  onClose?: () => void;
  /** Callback appelé après l'ouverture */
  onAfterOpen?: () => void;
  /** Callback appelé après la fermeture */
  onAfterClose?: () => void;
  /** Callback appelé avant l'ouverture */
  onBeforeOpen?: () => boolean;
  /** Callback appelé avant la fermeture */
  onBeforeClose?: () => boolean;
}

/**
 * Retour du hook useModal
 */
export interface UseModalReturn<T = any> {
  /** Est ouverte */
  isOpen: boolean;
  /** Données de la modale */
  data: T | null;
  /** Ouvrir la modale */
  open: (data?: T) => void;
  /** Fermer la modale */
  close: () => void;
  /** Basculer la modale */
  toggle: () => void;
  /** Mettre à jour les données */
  setData: (data: T | null) => void;
  /** Réinitialiser la modale */
  reset: () => void;
  /** Vérifier si la modale est en cours d'ouverture */
  isOpening: boolean;
  /** Vérifier si la modale est en cours de fermeture */
  isClosing: boolean;
}

/**
 * Hook pour gérer les modales
 * Utilise le store uiStore
 *
 * @param type - Identifiant unique de la modale
 * @param options - Options supplémentaires
 * @returns {Object} État et actions de la modale
 *
 * @example
 * // Exemple basique
 * const { isOpen, open, close, toggle, data } = useModal('login');
 *
 * // Ouvrir la modale avec des données
 * open({ email: 'user@example.com' });
 *
 * // Fermer la modale
 * close();
 *
 * // Basculer la modale
 * toggle();
 *
 * // Avec options
 * const { isOpen, open, close } = useModal('settings', {
 *   closeOnEscape: true,
 *   closeOnOutsideClick: true,
 *   autoClose: 5000,
 *   onOpen: () => console.log('Modale ouverte'),
 *   onClose: () => console.log('Modale fermée'),
 *   onBeforeOpen: () => {
 *     // Retourner false pour annuler l'ouverture
 *     return true;
 *   }
 * });
 */
export const useModal = <T = any>(
  type: string,
  options: UseModalOptions = {},
): UseModalReturn<T> => {
  const {
    closeOnEscape = true,
    closeOnOutsideClick = true,
    autoClose = 0,
    onOpen,
    onClose,
    onAfterOpen,
    onAfterClose,
    onBeforeOpen,
    onBeforeClose,
  } = options;

  const store = useUIStore();
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Récupérer l'état de la modale
  const isOpen = store.isModalOpen(type);
  const data = store.getModalData<T>(type);

  // Nettoyer les timers
  const clearTimers = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    if (onBeforeClose && !onBeforeClose()) return;
    clearTimers();
    setIsClosing(true);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    onClose?.();
    store.closeModal(type);
    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onAfterClose?.();
    }, 300);
  }, [type, store, onBeforeClose, onClose, onAfterClose, clearTimers]);

  // Fermer avec la touche Échap
  useEscapeKey(() => {
    if (closeOnEscape && isOpen) {
      close();
    }
  }, isOpen && closeOnEscape);

  // Fermer en cliquant à l'extérieur
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (!closeOnOutsideClick || !isOpen) return;

      const target = event.target as HTMLElement;
      const modalElement = target.closest(
        '[role="dialog"], .modal, [data-modal="true"]',
      );

      if (!modalElement) {
        close();
      }
    },
    [closeOnOutsideClick, isOpen, close],
  );

  useEffect(() => {
    if (closeOnOutsideClick && isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
    return undefined;
  }, [closeOnOutsideClick, isOpen, handleOutsideClick]);

  // Auto-close
  useEffect(() => {
    if (autoClose > 0 && isOpen) {
      autoCloseTimerRef.current = setTimeout(() => {
        close();
      }, autoClose);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [autoClose, isOpen, close]);

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Ouvrir la modale
  const open = useCallback(
    (modalData?: T) => {
      // Vérifier si on peut ouvrir
      if (onBeforeOpen && !onBeforeOpen()) {
        return;
      }

      // Nettoyer les timers existants
      clearTimers();

      setIsOpening(true);
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }

      // Appeler onOpen
      if (onOpen) {
        onOpen();
      }

      // Ouvrir la modale
      store.openModal(type, modalData);

      // Après l'ouverture
      openTimeoutRef.current = setTimeout(() => {
        setIsOpening(false);
        if (onAfterOpen) {
          onAfterOpen();
        }
      }, 300);
    },
    [type, store, onBeforeOpen, onOpen, onAfterOpen, clearTimers],
  );

  // Basculer la modale
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Mettre à jour les données
  const setData = useCallback(
    (newData: T | null) => {
      if (isOpen) {
        store.openModal(type, newData);
      }
    },
    [type, isOpen, store],
  );

  // Réinitialiser la modale
  const reset = useCallback(() => {
    clearTimers();
    setIsOpening(false);
    setIsClosing(false);
    if (isOpen) {
      store.closeModal(type);
    }
  }, [type, isOpen, store, clearTimers]);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
    reset,
    isOpening,
    isClosing,
  };
};

/**
 * Hook pour gérer plusieurs modales
 *
 * @param modalIds - Liste des IDs des modales
 * @returns {Object} État et actions des modales
 *
 * @example
 * const { modals, openModal, closeModal, isAnyOpen } = useModals(['login', 'register', 'settings']);
 *
 * // Ouvrir une modale
 * openModal('login');
 *
 * // Fermer une modale
 * closeModal('login');
 *
 * // Vérifier si une modale est ouverte
 * if (isAnyOpen()) {
 *   // ...
 * }
 */
export const useModals = (modalIds: string[]) => {
  const store = useUIStore();
  const isModalOpen = useCallback(
    (id: string) => {
      return store.isModalOpen(id);
    },
    [store],
  );

  const openModal = useCallback(
    (id: string, data?: any) => {
      store.openModal(id, data);
    },
    [store],
  );

  const closeModal = useCallback(
    (id: string) => {
      store.closeModal(id);
    },
    [store],
  );

  const toggleModal = useCallback(
    (id: string) => {
      if (isModalOpen(id)) {
        closeModal(id);
      } else {
        openModal(id);
      }
    },
    [isModalOpen, openModal, closeModal],
  );

  const closeAllModals = useCallback(() => {
    modalIds.forEach((id) => {
      store.closeModal(id);
    });
  }, [modalIds, store]);

  const isAnyOpen = useCallback(() => {
    return modalIds.some((id) => store.isModalOpen(id));
  }, [modalIds, store]);

  const getOpenModals = useCallback(() => {
    const open: string[] = [];
    modalIds.forEach((id) => {
      if (store.isModalOpen(id)) {
        open.push(id);
      }
    });
    return open;
  }, [modalIds, store]);

  return {
    modals: modalIds.reduce(
      (acc, id) => ({
        ...acc,
        [id]: {
          isOpen: isModalOpen(id),
          open: () => openModal(id),
          close: () => closeModal(id),
          toggle: () => toggleModal(id),
          data: store.getModalData(id),
        },
      }),
      {} as Record<
        string,
        {
          isOpen: boolean;
          open: () => void;
          close: () => void;
          toggle: () => void;
          data: any;
        }
      >,
    ),
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    isAnyOpen,
    getOpenModals,
  };
};

/**
 * Hook pour créer une modale de confirmation
 *
 * @param options - Options de la confirmation
 * @returns {Object} État et actions de la confirmation
 *
 * @example
 * const { isOpen, confirm, confirmLoading } = useConfirmModal({
 *   title: 'Confirmation',
 *   message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
 *   onConfirm: async () => {
 *     await deleteItem();
 *   },
 *   confirmText: 'Supprimer',
 *   cancelText: 'Annuler',
 *   type: 'danger'
 * });
 *
 * // Ouvrir la confirmation
 * confirm();
 */
export interface ConfirmModalOptions {
  /** Titre de la confirmation */
  title?: string;
  /** Message de la confirmation */
  message?: string;
  /** Texte du bouton de confirmation */
  confirmText?: string;
  /** Texte du bouton d'annulation */
  cancelText?: string;
  /** Type de confirmation ('danger' | 'warning' | 'info' | 'success') */
  type?: "danger" | "warning" | "info" | "success";
  /** Fonction appelée à la confirmation */
  onConfirm?: () => void | Promise<void>;
  /** Fonction appelée à l'annulation */
  onCancel?: () => void;
  /** Fonction appelée à l'ouverture */
  onOpen?: () => void;
  /** Fonction appelée à la fermeture */
  onClose?: () => void;
  /** Désactiver le bouton de confirmation */
  confirmDisabled?: boolean;
}

export interface UseConfirmModalReturn {
  /** Est ouverte */
  isOpen: boolean;
  /** En cours de confirmation */
  isConfirming: boolean;
  /** Ouvrir la confirmation */
  confirm: (data?: any) => void;
  /** Fermer la confirmation */
  close: () => void;
  /** Annuler la confirmation */
  cancel: () => void;
  /** Confirmer */
  handleConfirm: () => Promise<void>;
  /** Données de la confirmation */
  data: any;
  /** Titre */
  title: string;
  /** Message */
  message: string;
  /** Texte du bouton de confirmation */
  confirmText: string;
  /** Texte du bouton d'annulation */
  cancelText: string;
  /** Type */
  type: "danger" | "warning" | "info" | "success";
  /** Désactiver le bouton de confirmation */
  confirmDisabled: boolean;
}

export const useConfirmModal = (
  options: ConfirmModalOptions = {},
): UseConfirmModalReturn => {
  const {
    title = "Confirmation",
    message = "Êtes-vous sûr de vouloir continuer ?",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    type = "info",
    onConfirm,
    onCancel,
    onOpen,
    onClose,
    confirmDisabled = false,
  } = options;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const confirm = useCallback(
    (modalData?: any) => {
      setData(modalData || null);
      setIsOpen(true);
      if (onOpen) {
        onOpen();
      }
    },
    [onOpen],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const cancel = useCallback(() => {
    setIsOpen(false);
    setData(null);
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  }, [onCancel, onClose]);

  const handleConfirm = useCallback(async () => {
    if (confirmDisabled) return;

    setIsConfirming(true);
    try {
      if (onConfirm) {
        await onConfirm();
      }
      setIsOpen(false);
      setData(null);
    } catch (error) {
      console.error("Error in confirm handler:", error);
    } finally {
      setIsConfirming(false);
    }
  }, [onConfirm, confirmDisabled]);

  // Fermer avec Échap
  useEscapeKey(() => {
    if (isOpen) {
      cancel();
    }
  }, isOpen);

  return {
    isOpen,
    isConfirming,
    confirm,
    close,
    cancel,
    handleConfirm,
    data,
    title,
    message,
    confirmText,
    cancelText,
    type,
    confirmDisabled,
  };
};

export default useModal;
