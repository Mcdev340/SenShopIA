import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AddressesPage() {
  return (
    <WorkspacePage title="Mes adresses" description="Gérez vos adresses de livraison pour accélérer vos prochaines commandes." actions={[{ label: 'Ajouter une adresse' }]}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Adresse principale</CardTitle></CardHeader><CardBody><p className="text-sm leading-6 text-gray-600 dark:text-gray-300">Aucune adresse enregistrée.</p><Button className="mt-5" variant="outline" size="sm">Ajouter une adresse</Button></CardBody></Card>
      </div>
    </WorkspacePage>
  );
}
