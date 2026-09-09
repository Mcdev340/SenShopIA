import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProductCard from '@/components/products/ProductCard';

vi.mock('@/hooks', () => ({ useCart: () => ({ addItem: vi.fn(), addToWishlist: vi.fn(), removeFromWishlist: vi.fn(), isInWishlist: vi.fn().mockResolvedValue(false) }), useToast: () => ({ success: vi.fn(), error: vi.fn() }) }));

const product = { id: '1', name: 'Casque audio', slug: 'casque-audio', description: 'Un casque', price: 25000, stock: 4, category: { id: 'c', name: 'Audio', slug: 'audio', productCount: 1, isActive: true, order: 1, createdAt: new Date(), updatedAt: new Date() }, categoryId: 'c', images: [], variants: [], tags: [], rating: 4.5, reviewsCount: 2, isAvailable: true, isFeatured: false, isNew: true, isOnSale: false, viewsCount: 1, soldCount: 1, createdAt: new Date(), updatedAt: new Date() };

describe('ProductCard', () => { it('shows product name and price', () => { render(<ProductCard product={product} showActions={false} />); expect(screen.getByText('Casque audio')).toBeInTheDocument(); expect(screen.getByText(/25/)).toBeInTheDocument(); }); });
