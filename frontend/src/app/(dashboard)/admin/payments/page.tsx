import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminPaymentsPage() {
  return <OperationsPage title="Paiements" description="Contrôlez les encaissements, remboursements et transactions en attente." metrics={[{ label: 'Encaissé aujourd’hui', value: '682 000 FCFA', change: '+6,4 %' }, { label: 'En attente', value: '12', change: 'À traiter' }, { label: 'Remboursements', value: '8', change: 'Ce mois' }]}><Card><CardHeader><CardTitle>Dernières transactions</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Les transactions récentes apparaîtront ici dès leur synchronisation.</p></CardBody></Card></OperationsPage>;
}
