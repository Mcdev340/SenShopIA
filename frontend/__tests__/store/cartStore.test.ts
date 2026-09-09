import { describe, expect, it } from 'vitest';
import { useCartStore } from '@/store/cartStore';

describe('cartStore', () => { it('starts with an empty cart summary', () => { useCartStore.getState().reset(); expect(useCartStore.getState().items).toEqual([]); expect(useCartStore.getState().total).toBe(0); }); });
