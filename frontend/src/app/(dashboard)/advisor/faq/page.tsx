import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdvisorFAQPage() {
  return <OperationsPage title="Base de connaissances" description="Maintenez les réponses qui aident les conseillers à répondre vite et juste."><Card><CardHeader><CardTitle>Articles FAQ</CardTitle></CardHeader><CardBody><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><p className="text-sm text-gray-600 dark:text-gray-300">12 articles sont publiés et 3 brouillons attendent une relecture.</p><Button size="sm">Nouvel article</Button></div></CardBody></Card></OperationsPage>;
}
