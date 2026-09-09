import { describe, expect, it } from 'vitest';
import { authService } from '@/services/auth.service';

describe('authService', () => { it('is available as the authentication service', () => { expect(authService).toBeDefined(); expect(typeof authService.login).toBe('function'); }); });
