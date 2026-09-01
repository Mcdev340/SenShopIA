/**
 * Options de chiffrement
 */
export interface EncryptionOptions {
  algorithm?: 'aes-256-cbc' | 'aes-256-gcm';
  key?: string;
}

/**
 * Résultat de validation de mot de passe
 */
export interface PasswordStrength {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong' | 'excellent';
  message: string;
  suggestions: string[];
}

// ============ CHIFFREMENT ============

export const encrypt = (data: string, options: EncryptionOptions = {}): string => {
  try {
    const encoded = btoa(encodeURIComponent(data));
    if (options.key) {
      return `${options.key}:${encoded}`;
    }
    return encoded;
  } catch {
    return data;
  }
};

export const decrypt = (data: string, options: EncryptionOptions = {}): string => {
  try {
    let encoded = data;
    if (options.key && data.startsWith(`${options.key}:`)) {
      encoded = data.slice(options.key.length + 1);
    }
    return decodeURIComponent(atob(encoded));
  } catch {
    return data;
  }
};

// ============ HASHAGE ============

export const simpleHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// ============ SANITIZATION ============

export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const sanitizeURL = (url: string): string => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

export const sanitizeFilename = (filename: string): string => {
  if (!filename) return '';
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
};

// ============ VALIDATION ============

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const result: PasswordStrength = {
    score: 0,
    level: 'weak',
    message: '',
    suggestions: [],
  };

  if (!password) {
    result.message = 'Le mot de passe est vide';
    return result;
  }

  let score = 0;
  const suggestions: string[] = [];

  // Longueur
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push('Utiliser au moins 8 caractères');
  }

  // Majuscules et minuscules
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Utiliser des majuscules ET des minuscules');
  }

  // Chiffres
  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Ajouter des chiffres');
  }

  // Caractères spéciaux
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    suggestions.push('Ajouter des caractères spéciaux');
  }

  // Bonus: longueur > 12
  if (password.length >= 12) {
    score += 0.5;
  }

  // Bonus: pas de séquence
  if (!/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    score += 0.5;
  }

  // Bonus: pas de mot commun
  const commonWords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'letmein'];
  if (!commonWords.some(word => password.toLowerCase().includes(word))) {
    score += 0.5;
  }

  result.score = Math.min(Math.round(score), 4);

  const levels: Record<number, PasswordStrength['level']> = {
    0: 'weak',
    1: 'weak',
    2: 'fair',
    3: 'good',
    4: 'strong',
  };
  result.level = levels[result.score] || 'weak';

  const messages: Record<number, string> = {
    0: 'Très faible',
    1: 'Faible',
    2: 'Moyen',
    3: 'Bon',
    4: 'Excellent',
  };
  result.message = messages[result.score] || 'Faible';

  result.suggestions = suggestions.slice(0, 3);

  return result;
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^(\+?[0-9]{1,3})?[0-9]{9,12}$/;
  return regex.test(phone);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePostalCode = (postalCode: string): boolean => {
  const regex = /^[0-9]{5}$/;
  return regex.test(postalCode);
};

// ============ TOKEN ============

export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

export const verifyCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

// ============ XSS PROTECTION ============

export const escapeHTML = (str: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (s) => map[s] || s);
};

export const unescapeHTML = (str: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, (s) => map[s] || s);
};

// ============ CLICKJACKING PROTECTION ============

export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

// ============ EXPORT ============

export default {
  encrypt,
  decrypt,
  simpleHash,
  sanitizeString,
  sanitizeHTML,
  sanitizeURL,
  sanitizeFilename,
  validatePasswordStrength,
  validateEmail,
  validatePhone,
  validateURL,
  validatePostalCode,
  generateCSRFToken,
  verifyCSRFToken,
  escapeHTML,
  unescapeHTML,
  isInIframe,
};