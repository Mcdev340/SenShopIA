import { Metadata } from 'next';
import { Card, CardBody } from '@/components/ui/Card';
import { Link } from '@/components/ui/Link';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation | ShopSense AI',
  description: 'Consultez les conditions d\'utilisation de ShopSense AI.',
};

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptation des conditions',
      content: 'En utilisant ShopSense AI, vous acceptez pleinement les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.',
    },
    {
      title: '2. Compte utilisateur',
      content: 'Vous êtes responsable de la confidentialité de votre compte et de votre mot de passe. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.',
    },
    {
      title: '3. Commandes et paiements',
      content: 'Toutes les commandes passées sur ShopSense AI sont soumises à notre politique de paiement. Les prix affichés sont en FCFA et incluent les taxes applicables.',
    },
    {
      title: '4. Livraison',
      content: 'Les délais de livraison sont indiqués à titre indicatif. Nous nous efforçons de respecter ces délais mais ne pouvons être tenus responsables des retards indépendants de notre volonté.',
    },
    {
      title: '5. Retours et remboursements',
      content: 'Vous disposez d\'un délai de 14 jours à compter de la réception pour retourner un produit. Les frais de retour sont à votre charge sauf en cas de produit défectueux.',
    },
    {
      title: '6. Propriété intellectuelle',
      content: 'Tous les contenus présents sur ShopSense AI sont protégés par les lois sur la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable.',
    },
    {
      title: '7. Limitation de responsabilité',
      content: 'ShopSense AI s\'efforce de fournir des informations exactes mais ne peut garantir l\'exactitude des informations fournies par les tiers.',
    },
    {
      title: '8. Modification des conditions',
      content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme.',
    },
    {
      title: '9. Loi applicable',
      content: 'Les présentes conditions sont régies par la loi sénégalaise. Tout litige sera porté devant les tribunaux compétents de Dakar.',
    },
    {
      title: '10. Contact',
      content: 'Pour toute question concernant ces conditions, contactez-nous à legal@shopsense-ai.com.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Conditions d'utilisation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Dernière mise à jour : 1er janvier 2024
        </p>
      </div>

      <Card>
        <CardBody className="p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Bienvenue sur ShopSense AI. En utilisant notre plateforme, vous acceptez de respecter les présentes conditions d'utilisation. Veuillez les lire attentivement.
          </p>

          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {section.content}
              </p>
            </div>
          ))}

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pour toute question, contactez-nous à :{' '}
              <a href="mailto:legal@shopsense-ai.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                legal@shopsense-ai.com
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}