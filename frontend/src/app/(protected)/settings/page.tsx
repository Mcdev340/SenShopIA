import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';

export default function SettingsPage() {
  return (
    <WorkspacePage title="Paramètres" description="Personnalisez votre expérience ShopSense AI et vos notifications.">
      <div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>Préférences</CardTitle></CardHeader><CardBody><div className="space-y-5"><label className="flex items-center justify-between gap-4 text-sm text-gray-700 dark:text-gray-200"><span>Recevoir les recommandations</span><Switch checked={true} onCheckedChange={() => undefined} /></label><label className="flex items-center justify-between gap-4 text-sm text-gray-700 dark:text-gray-200"><span>Recevoir les offres par email</span><Switch checked={false} onCheckedChange={() => undefined} /></label></div></CardBody></Card></div>
    </WorkspacePage>
  );
}
