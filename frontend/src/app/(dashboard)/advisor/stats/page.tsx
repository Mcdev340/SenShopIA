import OperationsPage from '@/components/dashboard/OperationsPage';

export default function AdvisorStatsPage() {
  return <OperationsPage title="Statistiques conseiller" description="Suivez votre activité et la qualité de vos échanges." metrics={[{ label: 'Tickets traités', value: '74', change: '+9 %' }, { label: 'Temps de réponse', value: '11 min', change: '-8 %' }, { label: 'Résolution au premier contact', value: '87 %' }]} />;
}
