import { LockKeyhole } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SecuritySettings() { return <Card><CardBody><div className="flex items-start gap-3"><LockKeyhole className="mt-1 h-5 w-5 text-primary-600" /><div><h3 className="font-semibold">Mot de passe et sessions</h3><p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Modifiez votre mot de passe ou déconnectez les appareils inconnus.</p><Button className="mt-4" variant="outline" size="sm">Gérer la sécurité</Button></div></div></CardBody></Card>; }
