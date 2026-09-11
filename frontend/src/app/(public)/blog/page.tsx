'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowRight, Search, MessageCircle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/shared/EmptyState';

const mockPosts = [
  {
    id: '1',
    title: 'Comment acheter depuis l\'étranger sans se ruiner ?',
    slug: 'comment-acheter-depuis-etranger-sans-se-ruiner',
    excerpt: 'Découvrez nos astuces pour acheter des produits internationaux à moindre coût. Guide complet des économies à réaliser.',
    content: 'Lorem ipsum...',
    image: '/images/blog/achats-etranger.jpg',
    author: 'Mamadou Diallo',
    authorAvatar: '/images/team/1.jpg',
    date: '2024-01-15',
    readTime: 5,
    category: 'Conseils d\'achat',
    tags: ['Achats internationaux', 'Économies', 'Guide'],
    views: 1250,
    comments: 23,
  },
  {
    id: '2',
    title: 'Les meilleures pratiques de paiement en ligne au Sénégal',
    slug: 'meilleures-pratiques-paiement-en-ligne-senegal',
    excerpt: 'Guide des moyens de paiement disponibles au Sénégal pour vos achats en ligne. Sécurité et simplicité.',
    content: 'Lorem ipsum...',
    image: '/images/blog/paiement-senegal.jpg',
    author: 'Aminata Sow',
    authorAvatar: '/images/team/2.jpg',
    date: '2024-01-10',
    readTime: 4,
    category: 'Paiement',
    tags: ['Paiement', 'Sénégal', 'Sécurité'],
    views: 980,
    comments: 15,
  },
  {
    id: '3',
    title: 'Comment suivre votre colis en temps réel',
    slug: 'comment-suivre-colis-temps-reel',
    excerpt: 'Utilisez notre outil de suivi pour connaître en temps réel la position de votre colis. Simple et efficace.',
    content: 'Lorem ipsum...',
    image: '/images/blog/suivi-colis.jpg',
    author: 'Oumar Ndiaye',
    authorAvatar: '/images/team/3.jpg',
    date: '2024-01-05',
    readTime: 3,
    category: 'Livraison',
    tags: ['Suivi', 'Livraison', 'Colis'],
    views: 2100,
    comments: 42,
  },
  {
    id: '4',
    title: 'Les tendances de la mode en 2024',
    slug: 'tendances-mode-2024',
    excerpt: 'Découvrez les tendances mode de l\'année 2024. Les styles à adopter et les pièces incontournables.',
    content: 'Lorem ipsum...',
    image: '/images/blog/mode-2024.jpg',
    author: 'Marie Diop',
    authorAvatar: '/images/team/4.jpg',
    date: '2024-01-01',
    readTime: 6,
    category: 'Mode',
    tags: ['Mode', 'Tendances', '2024'],
    views: 850,
    comments: 18,
  },
];

const categories = [
  { name: 'Conseils d\'achat', count: 12 },
  { name: 'Paiement', count: 8 },
  { name: 'Livraison', count: 10 },
  { name: 'Mode', count: 6 },
  { name: 'Technologie', count: 9 },
  { name: 'Économie', count: 5 },
];

const popularTags = [
  'Achats internationaux',
  'Paiement',
  'Sénégal',
  'Livraison',
  'Mode',
  'Technologie',
  'Économies',
  'Sécurité',
  'Colis',
  'Tendances',
];

export default function BlogPage() {
  const [posts] = useState(mockPosts);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Blog ShopSense AI
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Découvrez nos articles, conseils et actualités
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recherche */}
          <Card>
            <CardBody className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardBody>
          </Card>

          {/* Catégories */}
          <Card>
            <CardBody className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Catégories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between text-sm px-2 py-1 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-400">({category.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Tags */}
          <Card>
            <CardBody className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Tags populaires
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Newsletter */}
          <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800">
            <CardBody className="p-4 text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Restez informé
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Recevez nos derniers articles
              </p>
              <Button className="w-full" size="sm">
                S'abonner
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Articles */}
        <div className="lg:col-span-3">
          {filteredPosts.length === 0 ? (
            <EmptyState
              title="Aucun article trouvé"
              description="Aucun article ne correspond à votre recherche."
              icon={<Search className="w-16 h-16 text-gray-400" />}
            />
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <CardBody className="md:w-2/3 p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime} min de lecture
                        </span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments} commentaires</span>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Lire la suite
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}