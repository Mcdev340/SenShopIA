import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminAnalyticsPage() {
  return <OperationsPage title="Analytics" description="Suivez la santé commerciale de la plateforme." metrics={[{ label: 'Chiffre d’affaires', value: '4,8 M FCFA', change: '+12,4 %' }, { label: 'Commandes', value: '1 284', change: '+8,1 %' }, { label: 'Panier moyen', value: '37 450 FCFA', change: '+3,2 %' }, { label: 'Conversion', value: '4,6 %', change: '+0,8 pt' }]}><Card><CardHeader><CardTitle>Tendance des ventes</CardTitle></CardHeader><CardBody><div className="flex h-48 items-end gap-3">{[38, 52, 44, 68, 58, 82, 72, 94].map((height, index) => <div key={index} className="flex-1 rounded-t bg-primary-600/80" style={{ height: `${height}%` }} aria-label={`Période ${index + 1}`} />)}</div></CardBody></Card></OperationsPage>;
}
