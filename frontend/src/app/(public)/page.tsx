'use client';

import Link from 'next/link';
import { ArrowRight, Search, ShoppingBag, Truck, Bot, Star, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ProductGrid from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks';

export default function HomePage() {
  const { popularProducts, loading } = useProducts();

  const features = [
    {
      icon: Bot,
      title: 'Agent IA intelligent',
      description: 'Obtenez des recommandations personnalisées et des conseils d\'achat grâce à notre assistant AI.',
      color: 'primary',
    },
    {
      icon: ShoppingBag,
      title: 'Achat simplifié',
      description: 'Collez simplement un lien de produit, nous nous occupons du reste : estimation, livraison et suivi.',
      color: 'success',
    },
    {
      icon: Truck,
      title: 'Livraison transparente',
      description: 'Suivez votre colis en temps réel et choisissez votre point de retrait pour plus de flexibilité.',
      color: 'warning',
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      description: 'Transactions sécurisées avec cryptage SSL et multiples options de paiement locales.',
      color: 'info',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Clients satisfaits', icon: Users },
    { value: '50k+', label: 'Produits disponibles', icon: Package },
    { value: '98%', label: 'Taux de satisfaction', icon: Star },
    { value: '24/7', label: 'Support client', icon: Clock },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-primary-400/5 dark:from-primary-900/20 dark:to-primary-700/10" />
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              <span className="mr-2">✨</span>
              Nouvelle version disponible
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simplifiez vos achats internationaux avec{' '}
              <span className="text-primary-600 dark:text-primary-400">ShopSense AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Recherchez, comparez et commandez vos produits préférés du monde entier,
              livrés au Sénégal et en Afrique de l'Ouest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher un produit
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explorer le catalogue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pourquoi choisir ShopSense AI ?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Une expérience d'achat pensée pour vous
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Produits populaires */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Produits populaires
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Découvrez les produits les plus recherchés
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <ProductGrid
          products={popularProducts.slice(0, 4)}
          loading={loading}
          columns={4}
        />
      </section>

      {/* Statistiques */}
      <section className="bg-primary-50 dark:bg-primary-900/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à faire votre premier achat ?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Rejoignez notre communauté et découvrez une nouvelle façon d'acheter
            des produits internationaux.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
              Créer un compte gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Composant Users pour les statistiques
const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Package = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);