import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <WorkspacePage title="Politique de confidentialité" description="Comment nous protégeons vos données et gardons le contrôle entre vos mains.">
      <Card><CardHeader><CardTitle>Vos données</CardTitle></CardHeader><CardBody><div className="space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-300"><p>Nous collectons uniquement les informations nécessaires au fonctionnement du compte, au traitement des commandes et au support.</p><p>Vos données ne sont pas vendues. Vous pouvez demander l’accès, la correction ou la suppression de vos informations.</p><p>Les cookies nécessaires au service peuvent être utilisés pour maintenir votre session et sécuriser votre compte.</p></div></CardBody></Card>
    </WorkspacePage>
  );
}
