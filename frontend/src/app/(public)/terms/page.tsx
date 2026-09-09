import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <WorkspacePage title="Conditions d’utilisation" description="Les règles simples qui encadrent l’utilisation de ShopSense AI.">
      <Card><CardHeader><CardTitle>Utiliser le service</CardTitle></CardHeader><CardBody><div className="space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-300"><p>Vous vous engagez à fournir des informations exactes et à utiliser la plateforme conformément à la loi.</p><p>Les prix, stocks et délais sont indiqués avec le plus grand soin et peuvent évoluer jusqu’à la confirmation de la commande.</p><p>Pour toute question, notre équipe support reste disponible depuis la page contact.</p></div></CardBody></Card>
    </WorkspacePage>
  );
}
