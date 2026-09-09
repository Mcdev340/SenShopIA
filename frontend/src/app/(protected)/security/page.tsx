import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SecurityPage() {
  return (
    <WorkspacePage title="Sécurité" description="Renforcez la protection de votre compte et gardez la main sur vos sessions.">
      <div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>Mot de passe</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Modifiez régulièrement votre mot de passe pour protéger votre compte.</p><Button className="mt-5" size="sm">Modifier le mot de passe</Button></CardBody></Card><Card><CardHeader><CardTitle>Sessions actives</CardTitle></CardHeader><CardBody><p className="text-sm text-gray-600 dark:text-gray-300">Vous pouvez déconnecter les appareils que vous ne reconnaissez pas.</p><Button className="mt-5" variant="outline" size="sm">Gérer les sessions</Button></CardBody></Card></div>
    </WorkspacePage>
  );
}
