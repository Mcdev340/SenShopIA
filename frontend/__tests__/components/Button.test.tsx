import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from '@/components/ui/Button';

describe('Button', () => { it('renders its label and supports disabled state', () => { render(<Button disabled>Enregistrer</Button>); expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeDisabled(); }); });
