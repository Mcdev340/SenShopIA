import { Metadata } from 'next';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Users, 
  Rocket, 
  Heart, 
  Shield,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos | ShopSense AI',
  description: 'Découvrez ShopSense AI, la plateforme intelligente qui simplifie les achats internationaux au Sénégal et en Afrique de l\'Ouest.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Communauté',
      description: 'Nous croyons en une communauté forte d\'acheteurs et de vendeurs en Afrique.',
    },
    {
      icon: Shield,
      title: 'Confiance',
      description: 'La sécurité et la transparence sont au cœur de nos opérations.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Nous utilisons l\'IA pour simplifier et améliorer votre expérience d\'achat.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous sommes passionnés par la facilitation du commerce en Afrique.',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Clients satisfaits' },
    { value: '50k+', label: 'Produits disponibles' },
    { value: '98%', label: 'Taux de satisfaction' },
    { value: '24/7', label: 'Support client' },
  ];

  const team = [
    {
      name: 'Mamadou Diallo',
      role: 'CEO & Co-fondateur',
      description: 'Expert en e-commerce avec 10 ans d\'expérience.',
      image: '/images/team/1.jpg',
    },
    {
      name: 'Aminata Sow',
      role: 'CTO & Co-fondatrice',
      description: 'Spécialiste en intelligence artificielle et machine learning.',
      image: '/images/team/2.jpg',
    },
    {
      name: 'Oumar Ndiaye',
      role: 'Head of Operations',
      description: 'Expert en logistique et chaîne d\'approvisionnement.',
      image: '/images/team/3.jpg',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          À propos de ShopSense AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          Nous révolutionnons la manière dont les Africains achètent des produits internationaux.
        </p>
      </div>

      {/* Mission */}
      <Card>
        <CardBody className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notre Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Simplifier les achats internationaux pour les consommateurs africains,
            en utilisant la technologie pour rendre le commerce plus accessible, 
            transparent et fiable.
          </p>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="p-6 text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Values */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Nos Valeurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index}>
                <CardBody className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {value.description}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Notre Équipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index}>
              <CardBody className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center text-3xl">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {member.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Rejoignez notre aventure
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Ensemble, simplifions les achats en Afrique.
        </p>
        <Link href="/contact">
          <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
            Contactez-nous
          </Button>
        </Link>
      </div>
    </div>
  );
}