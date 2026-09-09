import { MapPin } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

interface DeliveryMapProps { destination?: string; }
export default function DeliveryMap({ destination = 'Dakar, Sénégal' }: DeliveryMapProps) { return <Card><CardBody><div className="flex min-h-64 items-center justify-center rounded-lg bg-sky-50 text-center dark:bg-sky-950/30"><div><MapPin className="mx-auto h-10 w-10 text-primary-600" /><p className="mt-3 font-semibold text-gray-900 dark:text-white">Zone de livraison</p><p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{destination}</p></div></div></CardBody></Card>; }
