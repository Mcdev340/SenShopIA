import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

// ============ TAILWIND MERGE ============

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============ FORMATAGE PRIX ============

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceWithCurrency(amount: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============ FORMATAGE DATES ============

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMMM yyyy', { locale: fr });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMMM yyyy HH:mm', { locale: fr });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: fr });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInDays(d2, d1);
}

export function hoursBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInHours(d2, d1);
}

export function minutesBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInMinutes(d2, d1);
}

// ============ CHAÎNES DE CARACTÈRES ============

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getInitialsFromEmail(email: string): string {
  if (!email) return '';
  const parts = email.split('@')[0].split('.');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// ============ STATUTS ============

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Order status
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    in_transit: 'bg-orange-100 text-orange-800 border-orange-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    returned: 'bg-gray-100 text-gray-800 border-gray-200',
    refunded: 'bg-pink-100 text-pink-800 border-pink-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    
    // Shipment status
    preparing: 'bg-gray-100 text-gray-800 border-gray-200',
    picked_up: 'bg-blue-100 text-blue-800 border-blue-200',
    customs: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
    
    // Payment status
    completed: 'bg-green-100 text-green-800 border-green-200',
    partially_refunded: 'bg-purple-100 text-purple-800 border-purple-200',
    
    // User status
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    suspended: 'bg-red-100 text-red-800 border-red-200',
    pending_verification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    
    // Ticket status
    open: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-purple-100 text-purple-800 border-purple-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
    
    // Priority
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Order status
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    in_transit: 'En transit',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    returned: 'Retournée',
    refunded: 'Remboursée',
    failed: 'Échouée',
    
    // Shipment status
    preparing: 'Préparation',
    picked_up: 'Collectée',
    customs: 'Douane',
    out_for_delivery: 'En livraison',
    
    // Payment status
    completed: 'Payée',
    partially_refunded: 'Partiellement remboursée',
    
    // User status
    active: 'Actif',
    inactive: 'Inactif',
    suspended: 'Suspendu',
    pending_verification: 'En attente de vérification',
    
    // Ticket status
    open: 'Ouvert',
    in_progress: 'En cours',
    resolved: 'Résolu',
    closed: 'Fermé',
    
    // Priority
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Élevée',
    urgent: 'Urgente',
  };
  return labels[status] || status;
}

// ============ VALIDATION ============

export function isObjectEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const regex = /^(\+?[0-9]{1,3})?[0-9]{9,12}$/;
  return regex.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPostalCode(postalCode: string): boolean {
  const regex = /^[0-9]{5}$/;
  return regex.test(postalCode);
}

// ============ NOMBRES ============

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============ FICHIERS ============

export function getFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

export function isImageFile(filename: string): boolean {
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  return extensions.includes(getFileExtension(filename).toLowerCase());
}

export function isVideoFile(filename: string): boolean {
  const extensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
  return extensions.includes(getFileExtension(filename).toLowerCase());
}

export function isDocumentFile(filename: string): boolean {
  const extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  return extensions.includes(getFileExtension(filename).toLowerCase());
}

// ============ DEBOUNCE / THROTTLE ============

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ============ COULEURS ============

export function getRandomColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
    '#06B6D4', '#D946EF', '#8B5CF6', '#F472B6', '#34D399',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

// ============ BROWSER ============

export function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'unknown';
}

export function getOS(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'unknown';
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

// ============ URL ============

export function getUrlParams(url: string): Record<string, string> {
  try {
    const params: Record<string, string> = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

export function addUrlParams(url: string, params: Record<string, string>): string {
  try {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
    return urlObj.toString();
  } catch {
    return url;
  }
}

// ============ STORAGE ============

export function setStorageItem<T>(key: string, value: T, ttl: number = 86400000): void {
  try {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    // Ignorer les erreurs de stockage
  }
}

export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

// ============ RANDOM ============

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateNumericCode(length: number = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// ============ SECURITÉ ============

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
}

// ============ EXPORT ============

export default {
  cn,
  formatPrice,
  formatPriceWithCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  daysBetween,
  hoursBetween,
  minutesBetween,
  getInitials,
  getInitialsFromEmail,
  truncateText,
  generateSlug,
  capitalize,
  titleCase,
  camelToSnake,
  snakeToCamel,
  getStatusColor,
  getStatusLabel,
  isObjectEmpty,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidPostalCode,
  formatNumber,
  formatCompactNumber,
  calculatePercentage,
  calculateAverage,
  clamp,
  roundTo,
  getFileSize,
  getFileExtension,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  debounce,
  throttle,
  getRandomColor,
  getColorFromString,
  getBrowser,
  getOS,
  isMobile,
  isTablet,
  isDesktop,
  getUrlParams,
  addUrlParams,
  setStorageItem,
  getStorageItem,
  generateId,
  generateCode,
  generateNumericCode,
  escapeHtml,
  sanitizeString,
};