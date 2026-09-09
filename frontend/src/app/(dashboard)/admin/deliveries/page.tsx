import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDeliveriesPage() {
  return <OperationsPage title="Livraisons" description="Pilotez les expéditions et identifiez les commandes qui nécessitent une intervention." metrics={[{ label: 'En transit', value: '86' }, { label: 'Livrées aujourd’hui', value: '42', change: '+11 %' }, { label: 'À risque', value: '5' }]}><Card><CardHeader><CardTitle>Suivi des expéditions</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Aucune alerte de livraison critique.</p></CardBody></Card></OperationsPage>;
}
