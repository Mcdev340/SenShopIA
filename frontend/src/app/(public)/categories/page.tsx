'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';
import { 
  Package, 
  Smartphone, 
  Shirt, 
  Home, 
  Sparkles, 
  Dumbbell,
  Book,
  Gamepad2,
  Car,
  Coffee,
  Gift,
  ShoppingBag,
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  electronics: Smartphone,
  clothing: Shirt,
  home: Home,
  beauty: Sparkles,
  sports: Dumbbell,
  books: Book,
  gaming: Gamepad2,
  automotive: Car,
  food: Coffee,
  gifts: Gift,
};

export default function CategoriesPage() {
  const { categories, loading, loadCategories } = useProducts();

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        title="Aucune catégorie"
        description="Aucune catégorie disponible pour le moment."
        icon={<Package className="w-16 h-16 text-gray-400" />}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catégories
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Parcourez nos catégories et trouvez ce que vous cherchez
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] || ShoppingBag;
          return (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <CardBody className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {category.productCount || 0} produits
                  </p>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}