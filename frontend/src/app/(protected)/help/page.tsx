'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  Book, 
  Video, 
  FileText,
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  User,
  Settings,
  Shield,
  RefreshCw,
  Package,
  Bot,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const helpCategories = [
  {
    icon: ShoppingBag,
    title: 'Commandes',
    description: 'Gérez vos commandes, suivez vos livraisons',
    href: '/faq#commandes',
    color: 'primary',
  },
  {
    icon: CreditCard,
    title: 'Paiement',
    description: 'Moyens de paiement, factures, remboursements',
    href: '/faq#paiement',
    color: 'success',
  },
  {
    icon: Truck,
    title: 'Livraison',
    description: 'Délais, suivi, points de retrait',
    href: '/faq#livraison',
    color: 'warning',
  },
  {
    icon: User,
    title: 'Compte',
    description: 'Profil, sécurité, préférences',
    href: '/profile',
    color: 'info',
  },
  {
    icon: Bot,
    title: 'Agent IA',
    description: 'Utilisation de l\'assistant intelligent',
    href: '/chat',
    color: 'purple',
  },
  {
    icon: Shield,
    title: 'Sécurité',
    description: 'Protection des données, confidentialité',
    href: '/privacy',
    color: 'danger',
  },
];

const quickLinks = [
  { label: 'Suivre ma commande', href: '/orders', icon: Package },
  { label: 'Retourner un article', href: '/faq#retours', icon: RefreshCw },
  { label: 'Modifier mon profil', href: '/profile', icon: Settings },
  { label: 'Contacter le support', href: '/contact', icon: MessageCircle },
];

const colorClasses: Record<string, string> = {
  primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = helpCategories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
          <HelpCircle className="w-8 h-8 mr-3 text-primary-600" />
          Centre d'aide
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Comment pouvons-nous vous aider aujourd'hui ?
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher dans l'aide..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link key={index} href={link.href}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardBody className="p-3 text-center">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {link.label}
                  </p>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Categories */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun résultat pour "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {filteredCategories.map((cat, index) => {
            const Icon = cat.icon;
            const colorClass = colorClasses[cat.color];
            return (
              <Link key={index} href={cat.href}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                  <CardBody className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {cat.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {cat.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="p-5 text-center">
            <Book className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Guides</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tutoriels pas à pas
            </p>
            <Link href="/faq">
              <Button variant="link" size="sm" className="mt-2">
                Consulter
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 text-center">
            <Video className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Vidéos</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tutoriels vidéo
            </p>
            <Button variant="link" size="sm" className="mt-2">
              Bientôt disponible
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 text-center">
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">FAQ</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Questions fréquentes
            </p>
            <Link href="/faq">
              <Button variant="link" size="sm" className="mt-2">
                Consulter
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Contact Support */}
      <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800">
        <CardBody className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Besoin d'aide supplémentaire ?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
            Notre équipe de support est là pour vous aider
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@shopsense-ai.com"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <Mail className="w-4 h-4" />
              support@shopsense-ai.com
            </a>
            <a
              href="tel:+221770000000"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <Phone className="w-4 h-4" />
              +221 77 000 00 00
            </a>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <MessageCircle className="w-4 h-4" />
              Chat en direct
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}