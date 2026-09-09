import Link from 'next/link';
import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HelpPage() {
  return (
    <WorkspacePage title="Centre d’aide" description="Trouvez rapidement une réponse ou contactez notre équipe support.">
      <div className="grid gap-4 sm:grid-cols-2"><Card hoverable><CardHeader><CardTitle>Questions fréquentes</CardTitle></CardHeader><CardBody><Link href="/faq" className="text-sm font-semibold text-primary-600 hover:underline">Consulter la FAQ</Link></CardBody></Card><Card hoverable><CardHeader><CardTitle>Nous contacter</CardTitle></CardHeader><CardBody><Link href="/contact" className="text-sm font-semibold text-primary-600 hover:underline">Ouvrir la page contact</Link></CardBody></Card></div>
    </WorkspacePage>
  );
}
