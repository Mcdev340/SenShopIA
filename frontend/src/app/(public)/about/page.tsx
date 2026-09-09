import { Metadata } from 'next';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Users, 
  Rocket, 
  Globe, 
  Target, 
  Award, 
  Heart, 
  Shield,
  Zap,
  TrendingUp,
  MessageCircle,
  ShoppingBag,
  Truck,
  Clock,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
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
    { value: '10k+', label: 'Clients satisfaits', icon: Users },
    { value: '50k+', label: 'Produits disponibles', icon: ShoppingBag },
    { value: '98%', label: 'Taux de satisfaction', icon: Star },
    { value: '24/7', label: 'Support client', icon: Clock },
  ];

  const team = [
    {
      name: 'Mamadou Diallo',
      role: 'CEO & Co-fondateur',
      description: 'Expert en e-commerce avec 10 ans d\'expérience.',
      initials: 'MD',
    },
    {
      name: 'Aminata Sow',
      role: 'CTO & Co-fondatrice',
      description: 'Spécialiste en intelligence artificielle et machine learning.',
      initials: 'AS',
    },
    {
      name: 'Oumar Ndiaye',
      role: 'Head of Operations',
      description: 'Expert en logistique et chaîne d\'approvisionnement.',
      initials: 'ON',
    },
    {
      name: 'Marie Diop',
      role: 'Head of Marketing',
      description: 'Experte en marketing digital et croissance.',
      initials: 'MD',
    },
  ];

  const milestones = [
    { year: '2020', title: 'Fondation', description: 'Création de ShopSense AI avec une vision claire.' },
    { year: '2021', title: 'Première version', description: 'Lancement de la plateforme MVP.' },
    { year: '2022', title: 'Expansion', description: 'Extension à 5 pays d\'Afrique de l\'Ouest.' },
    { year: '2023', title: 'IA avancée', description: 'Intégration de l\'intelligence artificielle.' },
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardBody className="p-6 text-center">
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Notre Histoire
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary-200 dark:bg-primary-800" />
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2" />
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center z-10">
                  <span className="text-white text-sm font-bold">{milestone.year.slice(-2)}</span>
                </div>
                <Card className="w-1/2">
                  <CardBody className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.description}</p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index}>
              <CardBody className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {member.initials}
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

      {/* Contact */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Rejoignez notre aventure
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Ensemble, simplifions les achats en Afrique.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Dakar, Sénégal</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+221 77 000 00 00</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>contact@shopsense-ai.com</span>
          </div>
        </div>
        <Link href="/contact">
          <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
            Contactez-nous
          </Button>
        </Link>
      </div>
    </div>
  );
}