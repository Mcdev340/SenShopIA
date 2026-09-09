'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Search, Building2, Package, Star, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/Input';

// Marques mockées (à remplacer par des données réelles)
const mockBrands = [
  {
    id: '1',
    name: 'Apple',
    slug: 'apple',
    logo: '/images/brands/apple.png',
    description: 'Leader mondial de la technologie',
    productCount: 45,
    rating: 4.9,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Samsung',
    slug: 'samsung',
    logo: '/images/brands/samsung.png',
    description: 'Innovation technologique',
    productCount: 38,
    rating: 4.7,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Nike',
    slug: 'nike',
    logo: '/images/brands/nike.png',
    description: 'Équipement sportif de qualité',
    productCount: 52,
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Adidas',
    slug: 'adidas',
    logo: '/images/brands/adidas.png',
    description: 'Performance et style',
    productCount: 41,
    rating: 4.6,
    isFeatured: false,
  },
  {
    id: '5',
    name: 'Sony',
    slug: 'sony',
    logo: '/images/brands/sony.png',
    description: 'Électronique et divertissement',
    productCount: 29,
    rating: 4.5,
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Dell',
    slug: 'dell',
    logo: '/images/brands/dell.png',
    description: 'Informatique et solutions technologiques',
    productCount: 23,
    rating: 4.4,
    isFeatured: false,
  },
  {
    id: '7',
    name: 'HP',
    slug: 'hp',
    logo: '/images/brands/hp.png',
    description: 'Impression et informatique',
    productCount: 19,
    rating: 4.3,
    isFeatured: false,
  },
  {
    id: '8',
    name: 'Lenovo',
    slug: 'lenovo',
    logo: '/images/brands/lenovo.png',
    description: 'PC et solutions intelligentes',
    productCount: 17,
    rating: 4.2,
    isFeatured: false,
  },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState(mockBrands);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simuler le chargement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBrands = filteredBrands.filter((b) => b.isFeatured);
  const otherBrands = filteredBrands.filter((b) => !b.isFeatured);

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
          <Building2 className="w-8 h-8 mr-3 text-primary-600" />
          Marques
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Découvrez toutes les marques disponibles sur ShopSense AI
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher une marque..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredBrands.length === 0 ? (
        <EmptyState
          title="Aucune marque trouvée"
          description={`Aucune marque ne correspond à "${searchQuery}"`}
          icon={<Building2 className="w-16 h-16 text-gray-400" />}
        />
      ) : (
        <div className="space-y-8">
          {/* Marques en vedette */}
          {featuredBrands.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
                Marques en vedette
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredBrands.map((brand) => (
                  <Link key={brand.id} href={`/brands/${brand.slug}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            {brand.logo ? (
                              <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {brand.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {brand.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <Package className="w-3 h-3 mr-1" />
                                {brand.productCount} produits
                              </span>
                              <span className="text-xs text-yellow-500 flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                                {brand.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                              Vedette
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Toutes les marques */}
          {otherBrands.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Toutes les marques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherBrands.map((brand) => (
                  <Link key={brand.id} href={`/brands/${brand.slug}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                      <CardBody className="p-4 text-center">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                          {brand.logo ? (
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <Building2 className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {brand.productCount} produits
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {brand.rating}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Statistiques */}
          <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {brands.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Marques</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {brands.reduce((acc, b) => acc + b.productCount, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Produits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {brands.filter(b => b.isFeatured).length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Marques vedettes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {(brands.reduce((acc, b) => acc + b.rating, 0) / brands.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}