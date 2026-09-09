import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DeliveryHistoryPage() {
  return <OperationsPage title="Historique des livraisons" description="Retrouvez vos tournées terminées et les colis remis aux clients." metrics={[{ label: 'Livraisons terminées', value: '128' }, { label: 'Taux de réussite', value: '98,2 %', change: '+1,4 %' }]}><Card><CardHeader><CardTitle>Dernières tournées</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Votre historique de tournées apparaîtra ici.</p></CardBody></Card></OperationsPage>;
}
