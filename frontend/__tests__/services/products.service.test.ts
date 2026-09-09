import { describe, expect, it } from 'vitest';
import { productsService } from '@/services/products.service';

describe('productsService', () => { it('exposes product retrieval methods', () => { expect(typeof productsService.getProducts).toBe('function'); expect(typeof productsService.getProductBySlug).toBe('function'); }); });
