import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// ============ PHONE ============

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Sénégal: +221 XX XXX XX XX
  if (cleaned.startsWith('221')) {
    const number = cleaned.slice(3);
    if (number.length === 9) {
      return `+221 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
    }
  }
  
  // Format générique
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, cleaned.length - 9)} ${cleaned.slice(-9, -6)} ${cleaned.slice(-6, -3)} ${cleaned.slice(-3)}`;
  }
  
  return phone;
};

export const maskPhone = (phone: string, visible: number = 4): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= visible) return cleaned;
  const masked = '*'.repeat(cleaned.length - visible);
  return masked + cleaned.slice(-visible);
};

// ============ CARD ============

export const formatCardNumber = (card: string): string => {
  const cleaned = card.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : card;
};

export const maskCardNumber = (card: string): string => {
  const cleaned = card.replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  return '**** **** **** ' + cleaned.slice(-4);
};

export const detectCardType = (card: string): string => {
  const cleaned = card.replace(/\D/g, '');
  const patterns: Record<string, RegExp> = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    jcb: /^(?:2131|1800|35)/,
    unionpay: /^62/,
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return type;
    }
  }
  return 'unknown';
};

export const getCardIcon = (card: string): string => {
  const type = detectCardType(card);
  const icons: Record<string, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    diners: '💳',
    jcb: '💳',
    unionpay: '💳',
    unknown: '💳',
  };
  return icons[type] || '💳';
};

// ============ CURRENCY ============

export const formatCurrency = (
  amount: number,
  currency: string = 'XOF',
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number, currency: string = 'XOF'): string => {
  const abs = Math.abs(amount);
  let value = amount;
  let suffix = '';
  
  if (abs >= 1_000_000_000) {
    value = amount / 1_000_000_000;
    suffix = 'B';
  } else if (abs >= 1_000_000) {
    value = amount / 1_000_000;
    suffix = 'M';
  } else if (abs >= 1_000) {
    value = amount / 1_000;
    suffix = 'k';
  }
  
  const formatted = value.toFixed(value % 1 === 0 ? 0 : 1);
  return `${formatted}${suffix} ${currency}`;
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number => {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  return (amount / fromRate) * toRate;
};

// ============ DATE ============

export const formatRelativeDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
};

export const formatShortDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: fr });
};

export const formatDateTimeShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

export const formatDurationFromNow = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Il y a ${days}j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months}mois`;
  return `Il y a ${Math.floor(months / 12)}ans`;
};

// ============ NUMBER ============

export const formatNumberWithSpaces = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatRounded = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

// ============ ADDRESS ============

export const formatAddress = (address: {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}): string => {
  const parts = [address.street];
  if (address.state) {
    parts.push(`${address.postalCode} ${address.city}, ${address.state}`);
  } else {
    parts.push(`${address.postalCode} ${address.city}`);
  }
  parts.push(address.country);
  return parts.join('\n');
};

export const formatShortAddress = (address: {
  city: string;
  state?: string;
  country: string;
}): string => {
  const parts = [address.city];
  if (address.state) parts.push(address.state);
  parts.push(address.country);
  return parts.join(', ');
};

// ============ SIZE ============

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// ============ TIME ============

export const formatTimeString = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const parseTimeString = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
};

// ============ EXPORT ============

export default {
  formatPhone,
  maskPhone,
  formatCardNumber,
  maskCardNumber,
  detectCardType,
  getCardIcon,
  formatCurrency,
  formatCurrencyCompact,
  convertCurrency,
  formatRelativeDate,
  formatShortDate,
  formatDateTimeShort,
  formatDuration,
  formatDurationFromNow,
  formatNumberWithSpaces,
  formatPercentage,
  formatRounded,
  formatAddress,
  formatShortAddress,
  formatBytes,
  formatTimeString,
  parseTimeString,
};