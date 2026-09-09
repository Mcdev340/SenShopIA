import { describe, expect, it } from 'vitest';
import { formatCurrencyCompact, formatPhone } from '@/lib/format';

describe('format utilities', () => { it('formats Senegalese phone numbers', () => { expect(formatPhone('221771234567')).toBe('+221 77 123 45 67'); }); it('formats compact currency', () => { expect(formatCurrencyCompact(1500000)).toBe('1.5M XOF'); }); });
