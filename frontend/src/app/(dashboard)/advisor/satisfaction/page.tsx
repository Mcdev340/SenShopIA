import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdvisorSatisfactionPage() {
  return <OperationsPage title="Satisfaction client" description="Comprenez les retours clients et identifiez les points à améliorer." metrics={[{ label: 'Note moyenne', value: '4,7 / 5', change: '+0,3' }, { label: 'Réponses reçues', value: '56' }, { label: 'Avis positifs', value: '91 %' }]}><Card><CardHeader><CardTitle>Retours récents</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Les derniers retours seront affichés ici.</p></CardBody></Card></OperationsPage>;
}
