'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/hooks';
import ProductGrid from '@/components/products/ProductGrid';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Building2, Star, Package } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

// Marques mockées (à remplacer par des données réelles)
const mockBrands = [
  {
    id: '1',
    name: 'Apple',
    slug: 'apple',
    logo: '/images/brands/apple.png',
    description: 'Leader mondial de la technologie',
    longDescription: 'Apple Inc. est une entreprise multinationale américaine qui conçoit, développe et vend des produits électroniques grand public, des ordinateurs personnels et des logiciels. Fondée en 1976, Apple est devenue l\'une des marques les plus valorisées au monde.',
    productCount: 45,
    rating: 4.9,
    isFeatured: true,
    founded: '1976',
    headquarters: 'Cupertino, Californie',
    website: 'https://apple.com',
    products: [
      {
        id: '1',
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        price: 1500000,
        salePrice: 1400000,
        image: '/images/products/iphone-15.jpg',
        rating: 4.8,
      },
      {
        id: '2',
        name: 'MacBook Pro M3',
        slug: 'macbook-pro-m3',
        price: 2500000,
        salePrice: 2300000,
        image: '/images/products/macbook-pro.jpg',
        rating: 4.9,
      },
    ],
  },
  {
    id: '2',
    name: 'Samsung',
    slug: 'samsung',
    logo: '/images/brands/samsung.png',
    description: 'Innovation technologique',
    longDescription: 'Samsung est un conglomérat sud-coréen basé à Séoul. Fondé en 1938, Samsung est aujourd\'hui l\'un des plus grands fabricants de produits électroniques au monde.',
    productCount: 38,
    rating: 4.7,
    isFeatured: true,
    founded: '1938',
    headquarters: 'Séoul, Corée du Sud',
    website: 'https://samsung.com',
    products: [],
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 1500000,
    salePrice: 1400000,
    stock: 10,
    images: ['/images/products/iphone-15.jpg'],
    brand: 'Apple',
    rating: 4.8,
    reviewsCount: 120,
    isAvailable: true,
    category: { name: 'Électronique', slug: 'electronics' },
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    price: 2500000,
    salePrice: 2300000,
    stock: 5,
    images: ['/images/products/macbook-pro.jpg'],
    brand: 'Apple',
    rating: 4.9,
    reviewsCount: 60,
    isAvailable: true,
    category: { name: 'Électronique', slug: 'electronics' },
  },
];

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  useProducts();

  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      loadBrand();
    }
  }, [slug]);

  const loadBrand = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simuler le chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      const foundBrand = mockBrands.find(b => b.slug === slug);
      if (foundBrand) {
        setBrand(foundBrand);
        // Charger les produits de la marque
        setProducts(mockProducts.filter(p => p.brand === foundBrand.name));
      } else {
        setError('Marque non trouvée');
      }
    } catch (error) {
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Marque non trouvée">
          La marque que vous recherchez n'existe pas.
          <Button className="mt-4" onClick={() => router.push('/brands')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voir toutes les marques
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Bouton retour */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/brands')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Toutes les marques
      </Button>

      {/* En-tête de la marque */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {brand.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {brand.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {brand.productCount} produits
                </span>
                <span className="text-sm text-yellow-500 flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                  {brand.rating}
                </span>
                {brand.founded && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Fondée en {brand.founded}
                  </span>
                )}
              </div>
            </div>
            {brand.isFeatured && (
              <div className="flex-shrink-0">
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                  Marque vedette
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Description détaillée */}
      {brand.longDescription && (
        <Card>
          <CardBody className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              À propos de {brand.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {brand.longDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {brand.headquarters && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Siège social</p>
                  <p className="text-gray-900 dark:text-white">{brand.headquarters}</p>
                </div>
              )}
              {brand.website && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Site web</p>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    {brand.website.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Produits de la marque */}
      {products.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Produits {brand.name}
          </h2>
          <ProductGrid
            products={products.map(p => ({
              ...p,
              category: p.category || { name: 'Non catégorisé', slug: 'uncategorized' },
            }))}
            loading={false}
            columns={4}
          />
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Aucun produit disponible pour cette marque.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}