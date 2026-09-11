'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const faqData = [
  {
    category: '🛍️ Général',
    questions: [
      {
        q: 'Qu\'est-ce que ShopSense AI ?',
        a: 'ShopSense AI est une plateforme intelligente qui simplifie les achats internationaux au Sénégal et en Afrique de l\'Ouest. Elle permet de rechercher des produits, de coller des liens de marketplaces internationales, et d\'obtenir des estimations de coûts complètes.',
      },
      {
        q: 'Comment fonctionne ShopSense AI ?',
        a: 'Vous pouvez rechercher des produits dans notre catalogue ou coller un lien d\'un produit provenant d\'une marketplace internationale. Notre agent IA vous aide à trouver les meilleures options et calcule tous les coûts (produit, transport, douane, etc.).',
      },
      {
        q: 'Quels pays sont desservis ?',
        a: 'Actuellement, ShopSense AI est disponible au Sénégal. Nous prévoyons de nous étendre à d\'autres pays d\'Afrique de l\'Ouest comme la Côte d\'Ivoire, le Mali, la Guinée et la Gambie.',
      },
      {
        q: 'Est-ce que je peux acheter sans compte ?',
        a: 'Non, un compte est nécessaire pour passer une commande. Cela nous permet de suivre vos commandes et de vous offrir une expérience personnalisée.',
      },
    ],
  },
  {
    category: '📦 Commandes',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'Ajoutez les produits à votre panier, puis passez à la caisse. Remplissez vos informations de livraison, choisissez votre méthode de paiement, et confirmez la commande.',
      },
      {
        q: 'Puis-je annuler ma commande ?',
        a: 'Oui, vous pouvez annuler votre commande tant qu\'elle n\'est pas encore en cours de traitement. Rendez-vous dans la section "Mes commandes" et cliquez sur "Annuler".',
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Les délais de livraison varient selon la provenance du produit. En général, comptez entre 7 et 15 jours ouvrés pour les produits internationaux.',
      },
      {
        q: 'Puis-je modifier ma commande après validation ?',
        a: 'Oui, vous pouvez modifier votre commande tant qu\'elle n\'est pas encore en cours de traitement. Contactez notre support client pour effectuer les modifications.',
      },
    ],
  },
  {
    category: '💳 Paiement',
    questions: [
      {
        q: 'Quels moyens de paiement sont acceptés ?',
        a: 'Nous acceptons les cartes bancaires (Visa, Mastercard), le Mobile Money (Orange Money, Wave, Free, Expresso), et les virements bancaires.',
      },
      {
        q: 'Les paiements sont-ils sécurisés ?',
        a: 'Oui, tous les paiements sont sécurisés avec un cryptage SSL. Nous utilisons des passerelles de paiement certifiées pour garantir la sécurité de vos transactions.',
      },
      {
        q: 'Puis-je payer à la livraison ?',
        a: 'Oui, nous proposons l\'option de paiement à la livraison pour certains produits. Cette option est disponible lors du choix du moyen de paiement.',
      },
      {
        q: 'Comment utiliser un code promo ?',
        a: 'Entrez votre code promo lors du passage à la caisse. La réduction sera automatiquement appliquée à votre commande.',
      },
    ],
  },
  {
    category: '🚚 Livraison',
    questions: [
      {
        q: 'Comment suivre ma commande ?',
        a: 'Vous pouvez suivre votre commande dans la section "Mes commandes". Un numéro de suivi vous sera fourni dès l\'expédition de votre colis.',
      },
      {
        q: 'Y a-t-il des frais de livraison ?',
        a: 'Les frais de livraison sont calculés en fonction du poids, de la destination et du transporteur. Ils sont inclus dans l\'estimation des coûts que vous recevez avant de valider votre commande.',
      },
      {
        q: 'Que faire si mon colis est endommagé ?',
        a: 'Si votre colis arrive endommagé, contactez notre support client dans les 48h suivant la réception. Nous ouvrirons une enquête et trouverons une solution.',
      },
      {
        q: 'Puis-je choisir un point de retrait ?',
        a: 'Oui, nous proposons des points de retrait dans plusieurs villes. Vous pouvez choisir cette option lors de la validation de votre commande.',
      },
    ],
  },
  {
    category: '🤖 Agent IA',
    questions: [
      {
        q: 'Comment utiliser l\'agent IA ?',
        a: 'L\'agent IA est disponible via la page de chat ou directement sur les pages produits. Posez-lui vos questions, il vous conseillera et vous aidera dans vos choix.',
      },
      {
        q: 'L\'agent IA est-il fiable ?',
        a: 'Oui, notre agent IA est entraîné sur des données fiables et constamment amélioré pour vous fournir des recommandations précises.',
      },
      {
        q: 'Puis-je parler à un humain ?',
        a: 'Oui, si vous le souhaitez, vous pouvez demander à être transféré à un conseiller humain via le chat.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (index: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredFaqs = faqData
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Foire Aux Questions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Trouvez des réponses à vos questions les plus fréquentes
        </p>
      </div>

      <div className="relative max-w-lg mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher dans les FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun résultat trouvé pour "{searchQuery}"
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setSearchQuery('')}
          >
            Effacer la recherche
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredFaqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.questions.map((item, index) => {
                  const key = `${category.category}-${index}`;
                  const isExpanded = expandedItems[key];

                  return (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toggleExpand(key)}
                    >
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.q}
                          </h3>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-gray-600 dark:text-gray-300">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Vous n'avez pas trouvé votre réponse ?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Contactez notre équipe de support pour une assistance personnalisée.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@shopsense-ai.com"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            <Mail className="w-4 h-4" />
            support@shopsense-ai.com
          </a>
          <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
          <a
            href="tel:+221770000000"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            <Phone className="w-4 h-4" />
            +221 77 000 00 00
          </a>
          <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            <MessageCircle className="w-4 h-4" />
            Formulaire de contact
          </a>
        </div>
      </div>
    </div>
  );
}