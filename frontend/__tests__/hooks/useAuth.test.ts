import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => { it('exposes the auth store contract', () => { const { result } = renderHook(() => useAuth()); expect(result.current).toHaveProperty('login'); expect(result.current).toHaveProperty('logout'); expect(result.current).toHaveProperty('isAuthenticated'); }); });
