// ============ ERROR TYPES ============

export enum ErrorCode {
  // Auth errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_ACCOUNT_LOCKED = 'AUTH_ACCOUNT_LOCKED',
  AUTH_PASSWORD_RESET_FAILED = 'AUTH_PASSWORD_RESET_FAILED',
  AUTH_EMAIL_ALREADY_EXISTS = 'AUTH_EMAIL_ALREADY_EXISTS',
  AUTH_USERNAME_ALREADY_EXISTS = 'AUTH_USERNAME_ALREADY_EXISTS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  VALIDATION_INVALID_EMAIL = 'VALIDATION_INVALID_EMAIL',
  VALIDATION_INVALID_PHONE = 'VALIDATION_INVALID_PHONE',
  VALIDATION_INVALID_URL = 'VALIDATION_INVALID_URL',
  VALIDATION_INVALID_CARD = 'VALIDATION_INVALID_CARD',
  VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',

  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_FORBIDDEN = 'RESOURCE_FORBIDDEN',
  RESOURCE_UNAUTHORIZED = 'RESOURCE_UNAUTHORIZED',

  // Cart errors
  CART_EMPTY = 'CART_EMPTY',
  CART_ITEM_NOT_FOUND = 'CART_ITEM_NOT_FOUND',
  CART_PRODUCT_UNAVAILABLE = 'CART_PRODUCT_UNAVAILABLE',
  CART_INSUFFICIENT_STOCK = 'CART_INSUFFICIENT_STOCK',
  CART_COUPON_INVALID = 'CART_COUPON_INVALID',
  CART_COUPON_EXPIRED = 'CART_COUPON_EXPIRED',
  CART_COUPON_ALREADY_USED = 'CART_COUPON_ALREADY_USED',

  // Order errors
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORDER_CANNOT_CANCEL = 'ORDER_CANNOT_CANCEL',
  ORDER_INVALID_STATUS = 'ORDER_INVALID_STATUS',
  ORDER_PAYMENT_FAILED = 'ORDER_PAYMENT_FAILED',

  // Payment errors
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_METHOD_INVALID = 'PAYMENT_METHOD_INVALID',
  PAYMENT_METHOD_EXPIRED = 'PAYMENT_METHOD_EXPIRED',
  PAYMENT_INSUFFICIENT_FUNDS = 'PAYMENT_INSUFFICIENT_FUNDS',
  PAYMENT_DECLINED = 'PAYMENT_DECLINED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',

  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  SERVER_UNAVAILABLE = 'SERVER_UNAVAILABLE',
  SERVER_TIMEOUT = 'SERVER_TIMEOUT',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ============ ERROR CLASS ============

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly data?: any;

  constructor(code: ErrorCode, message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ============ ERROR FACTORIES ============

export const createAuthError = (message: string, code: ErrorCode = ErrorCode.AUTH_INVALID_CREDENTIALS): AppError => {
  return new AppError(code, message, 401);
};

export const createValidationError = (message: string, data?: any): AppError => {
  return new AppError(ErrorCode.VALIDATION_ERROR, message, 422, data);
};

export const createNotFoundError = (resource: string): AppError => {
  return new AppError(ErrorCode.RESOURCE_NOT_FOUND, `${resource} non trouvé`, 404);
};

export const createForbiddenError = (message: string = 'Accès interdit'): AppError => {
  return new AppError(ErrorCode.RESOURCE_FORBIDDEN, message, 403);
};

export const createUnauthorizedError = (message: string = 'Non autorisé'): AppError => {
  return new AppError(ErrorCode.RESOURCE_UNAUTHORIZED, message, 401);
};

export const createNetworkError = (message: string = 'Erreur de réseau'): AppError => {
  return new AppError(ErrorCode.NETWORK_ERROR, message, 0);
};

export const createServerError = (message: string = 'Erreur interne du serveur'): AppError => {
  return new AppError(ErrorCode.SERVER_ERROR, message, 500);
};

export const createCartEmptyError = (): AppError => {
  return new AppError(ErrorCode.CART_EMPTY, 'Le panier est vide', 400);
};

export const createStockError = (): AppError => {
  return new AppError(ErrorCode.CART_INSUFFICIENT_STOCK, 'Stock insuffisant', 400);
};

// ============ ERROR UTILITIES ============

export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

export const getErrorMessage = (error: any): string => {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'Une erreur inattendue est survenue';
};

export const getErrorCode = (error: any): ErrorCode => {
  if (isAppError(error)) {
    return error.code;
  }
  if (error?.code) {
    return error.code;
  }
  return ErrorCode.UNKNOWN_ERROR;
};

export const getErrorStatus = (error: any): number => {
  if (isAppError(error)) {
    return error.status;
  }
  if (error?.status) {
    return error.status;
  }
  return 500;
};

// ============ ERROR HANDLING ============

export const handleApiError = (error: any): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error?.response) {
    const { status, data } = error.response;
    const message = data?.message || data?.detail || error.message || 'Erreur serveur';

    switch (status) {
      case 400:
        return new AppError(ErrorCode.VALIDATION_ERROR, message, status, data);
      case 401:
        return new AppError(ErrorCode.AUTH_TOKEN_EXPIRED, 'Session expirée', status, data);
      case 403:
        return new AppError(ErrorCode.RESOURCE_FORBIDDEN, 'Accès interdit', status, data);
      case 404:
        return new AppError(ErrorCode.RESOURCE_NOT_FOUND, 'Ressource non trouvée', status, data);
      case 409:
        return new AppError(ErrorCode.RESOURCE_CONFLICT, 'Conflit de ressource', status, data);
      case 422:
        return new AppError(ErrorCode.VALIDATION_ERROR, message, status, data);
      case 500:
        return new AppError(ErrorCode.SERVER_ERROR, 'Erreur interne du serveur', status, data);
      default:
        return new AppError(ErrorCode.UNKNOWN_ERROR, message, status, data);
    }
  }

  if (error?.request) {
    return new AppError(ErrorCode.NETWORK_ERROR, 'Erreur de connexion au serveur', 0);
  }

  return new AppError(ErrorCode.UNKNOWN_ERROR, 'Une erreur inattendue est survenue', 500);
};

// ============ ERROR MESSAGES ============

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Email ou mot de passe incorrect',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Session expirée, veuillez vous reconnecter',
  [ErrorCode.AUTH_TOKEN_INVALID]: 'Token invalide',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'Utilisateur non trouvé',
  [ErrorCode.AUTH_EMAIL_NOT_VERIFIED]: 'Email non vérifié',
  [ErrorCode.AUTH_ACCOUNT_LOCKED]: 'Compte verrouillé',
  [ErrorCode.AUTH_PASSWORD_RESET_FAILED]: 'Échec de la réinitialisation du mot de passe',
  [ErrorCode.AUTH_EMAIL_ALREADY_EXISTS]: 'Cet email est déjà utilisé',
  [ErrorCode.AUTH_USERNAME_ALREADY_EXISTS]: 'Ce nom d\'utilisateur est déjà pris',

  [ErrorCode.VALIDATION_ERROR]: 'Données invalides',
  [ErrorCode.VALIDATION_INVALID_EMAIL]: 'Email invalide',
  [ErrorCode.VALIDATION_INVALID_PHONE]: 'Numéro de téléphone invalide',
  [ErrorCode.VALIDATION_INVALID_URL]: 'URL invalide',
  [ErrorCode.VALIDATION_INVALID_CARD]: 'Carte bancaire invalide',
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: 'Champ requis',

  [ErrorCode.RESOURCE_NOT_FOUND]: 'Ressource non trouvée',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Ressource déjà existante',
  [ErrorCode.RESOURCE_CONFLICT]: 'Conflit de ressource',
  [ErrorCode.RESOURCE_FORBIDDEN]: 'Accès interdit',
  [ErrorCode.RESOURCE_UNAUTHORIZED]: 'Non autorisé',

  [ErrorCode.CART_EMPTY]: 'Le panier est vide',
  [ErrorCode.CART_ITEM_NOT_FOUND]: 'Article non trouvé dans le panier',
  [ErrorCode.CART_PRODUCT_UNAVAILABLE]: 'Produit indisponible',
  [ErrorCode.CART_INSUFFICIENT_STOCK]: 'Stock insuffisant',
  [ErrorCode.CART_COUPON_INVALID]: 'Code promo invalide',
  [ErrorCode.CART_COUPON_EXPIRED]: 'Code promo expiré',
  [ErrorCode.CART_COUPON_ALREADY_USED]: 'Code promo déjà utilisé',

  [ErrorCode.ORDER_NOT_FOUND]: 'Commande non trouvée',
  [ErrorCode.ORDER_CANNOT_CANCEL]: 'Impossible d\'annuler cette commande',
  [ErrorCode.ORDER_INVALID_STATUS]: 'Statut de commande invalide',
  [ErrorCode.ORDER_PAYMENT_FAILED]: 'Paiement de la commande échoué',

  [ErrorCode.PAYMENT_FAILED]: 'Paiement échoué',
  [ErrorCode.PAYMENT_METHOD_INVALID]: 'Méthode de paiement invalide',
  [ErrorCode.PAYMENT_METHOD_EXPIRED]: 'Méthode de paiement expirée',
  [ErrorCode.PAYMENT_INSUFFICIENT_FUNDS]: 'Fonds insuffisants',
  [ErrorCode.PAYMENT_DECLINED]: 'Paiement décliné',

  [ErrorCode.NETWORK_ERROR]: 'Erreur de réseau',
  [ErrorCode.NETWORK_TIMEOUT]: 'Délai de connexion dépassé',
  [ErrorCode.NETWORK_OFFLINE]: 'Pas de connexion internet',

  [ErrorCode.SERVER_ERROR]: 'Erreur interne du serveur',
  [ErrorCode.SERVER_UNAVAILABLE]: 'Serveur indisponible',
  [ErrorCode.SERVER_TIMEOUT]: 'Le serveur a mis trop de temps à répondre',

  [ErrorCode.UNKNOWN_ERROR]: 'Une erreur inattendue est survenue',
};

// ============ EXPORT ============

export default {
  AppError,
  ErrorCode,
  createAuthError,
  createValidationError,
  createNotFoundError,
  createForbiddenError,
  createUnauthorizedError,
  createNetworkError,
  createServerError,
  createCartEmptyError,
  createStockError,
  isAppError,
  getErrorMessage,
  getErrorCode,
  getErrorStatus,
  handleApiError,
  ERROR_MESSAGES,
};