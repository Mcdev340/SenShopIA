'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState  from '@/components/shared/EmptyState';
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
  ChevronRight,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';

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
  default: ShoppingBag,
};

const mockCategories = [
  { id: '1', name: 'Électronique', slug: 'electronics', productCount: 45, icon: 'electronics', color: 'primary' },
  { id: '2', name: 'Vêtements', slug: 'clothing', productCount: 32, icon: 'clothing', color: 'success' },
  { id: '3', name: 'Maison', slug: 'home', productCount: 28, icon: 'home', color: 'warning' },
  { id: '4', name: 'Beauté', slug: 'beauty', productCount: 15, icon: 'beauty', color: 'pink' },
  { id: '5', name: 'Sports', slug: 'sports', productCount: 20, icon: 'sports', color: 'info' },
  { id: '6', name: 'Livres', slug: 'books', productCount: 18, icon: 'books', color: 'purple' },
  { id: '7', name: 'Gaming', slug: 'gaming', productCount: 12, icon: 'gaming', color: 'indigo' },
  { id: '8', name: 'Automobile', slug: 'automotive', productCount: 10, icon: 'automotive', color: 'secondary' },
  { id: '9', name: 'Alimentation', slug: 'food', productCount: 8, icon: 'food', color: 'orange' },
  { id: '10', name: 'Cadeaux', slug: 'gifts', productCount: 6, icon: 'gifts', color: 'red' },
];

const colorClasses: Record<string, string> = {
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  secondary: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export default function CategoriesPage() {
  const [categories] = useState(mockCategories);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="w-8 h-8 mr-3 text-primary-600" />
          Catégories
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Parcourez nos catégories et trouvez ce que vous cherchez
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="Aucune catégorie trouvée"
          description={`Aucune catégorie ne correspond à "${searchQuery}"`}
          icon={<Package className="w-16 h-16 text-gray-400" />}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((category) => {
              const Icon = categoryIcons[category.icon] || categoryIcons.default;
              const colorClass = colorClasses[category.color] || colorClasses.secondary;

              return (
                <Link key={category.id} href={`/products?category=${category.slug}`}>
                  <Card className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                    <CardBody className="p-6 text-center">
                      <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {category.productCount} produits
                      </p>
                      <div className="mt-3 flex items-center justify-center text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm">Voir les produits</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Statistiques */}
          <div className="mt-8 bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {categories.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Catégories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {categories.reduce((acc, c) => acc + c.productCount, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Produits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {categories.filter(c => c.productCount > 20).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Catégories populaires</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {Math.max(...categories.map(c => c.productCount))}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Max produits</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}