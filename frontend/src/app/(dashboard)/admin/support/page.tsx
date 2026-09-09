import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminSupportPage() {
  return <OperationsPage title="Support client" description="Organisez les demandes et suivez la qualité des réponses." metrics={[{ label: 'Tickets ouverts', value: '24' }, { label: 'Temps moyen', value: '18 min', change: '-12 %' }, { label: 'Satisfaction', value: '94 %', change: '+2,1 pt' }]}><Card><CardHeader><CardTitle>File de support</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Les tickets prioritaires seront regroupés ici.</p></CardBody></Card></OperationsPage>;
}
