import OperationsPage from '@/components/dashboard/OperationsPage';

export default function DeliveryStatsPage() {
  return <OperationsPage title="Mes statistiques" description="Mesurez votre ponctualité et la qualité de vos livraisons." metrics={[{ label: 'Colis livrés', value: '128', change: 'Ce mois' }, { label: 'Distance parcourue', value: '842 km' }, { label: 'Note moyenne', value: '4,8 / 5', change: '+0,2' }]} />;
}
