import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardTitle } from '@/components/ui/Card';

describe('Card', () => { it('renders content', () => { render(<Card><CardTitle>Résumé</CardTitle></Card>); expect(screen.getByText('Résumé')).toBeInTheDocument(); }); });
