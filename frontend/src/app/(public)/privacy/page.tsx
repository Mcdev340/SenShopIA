import { Metadata } from 'next';
import { Card, CardBody } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | ShopSense AI',
  description: 'Consultez notre politique de confidentialité et comment nous protégeons vos données.',
};

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Collecte des données',
      content: 'Nous collectons les informations que vous nous fournissez lors de la création de votre compte, de vos commandes et de vos interactions avec notre plateforme.',
    },
    {
      title: '2. Utilisation des données',
      content: 'Vos données sont utilisées pour : traiter vos commandes, améliorer nos services, vous envoyer des communications marketing (avec votre consentement).',
    },
    {
      title: '3. Protection des données',
      content: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.',
    },
    {
      title: '4. Partage des données',
      content: 'Nous ne partageons pas vos données personnelles avec des tiers, sauf dans les cas suivants : prestataires de services, obligations légales.',
    },
    {
      title: '5. Cookies',
      content: 'Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez gérer vos préférences de cookies à tout moment.',
    },
    {
      title: '6. Vos droits',
      content: 'Conformément à la réglementation, vous disposez d\'un droit d\'accès, de rectification, de suppression et d\'opposition au traitement de vos données.',
    },
    {
      title: '7. Conservation des données',
      content: 'Nous conservons vos données pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées.',
    },
    {
      title: '8. Sécurité des paiements',
      content: 'Les transactions de paiement sont sécurisées et cryptées. Nous ne stockons pas les informations de vos cartes bancaires.',
    },
    {
      title: '9. Transfert de données',
      content: 'Vos données peuvent être transférées et stockées dans des pays autres que le vôtre, dans le respect des lois applicables.',
    },
    {
      title: '10. Contact',
      content: 'Pour toute question concernant notre politique de confidentialité, contactez-nous à privacy@shopsense-ai.com.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Politique de confidentialité
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Dernière mise à jour : 1er janvier 2024
        </p>
      </div>

      <Card>
        <CardBody className="p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Chez ShopSense AI, la protection de vos données personnelles est une priorité. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations.
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
              Pour toute question concernant vos données personnelles, contactez-nous à :{' '}
              <a href="mailto:privacy@shopsense-ai.com" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                privacy@shopsense-ai.com
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}