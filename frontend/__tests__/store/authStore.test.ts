import { describe, expect, it } from 'vitest';
import { useAuthStore } from '@/store/authStore';

describe('authStore', () => { it('starts signed out', () => { useAuthStore.getState().reset(); expect(useAuthStore.getState().isAuthenticated).toBe(false); }); });
