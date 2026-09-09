import OperationsPage from '@/components/dashboard/OperationsPage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminCategoriesPage() {
  return <OperationsPage title="Catégories" description="Structurez le catalogue pour aider les clients à trouver les bons produits."><Card><CardHeader><CardTitle>Catalogue organisé</CardTitle></CardHeader><CardBody><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><p className="text-sm text-gray-600 dark:text-gray-300">Gérez les familles, sous-catégories et leur visibilité.</p><Button size="sm">Nouvelle catégorie</Button></div></CardBody></Card></OperationsPage>;
}
