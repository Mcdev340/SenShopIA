import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCart } from '@/hooks/useCart';

describe('useCart', () => { it('exposes cart actions and state', () => { const { result } = renderHook(() => useCart()); expect(result.current).toHaveProperty('addItem'); expect(result.current).toHaveProperty('items'); expect(result.current).toHaveProperty('total'); }); });
