import { Card, CardBody } from '@/components/ui/Card';

interface DeliveryStatsProps { delivered: number; pending: number; successRate: number; }
export default function DeliveryStats({ delivered, pending, successRate }: DeliveryStatsProps) { return <div className="grid gap-4 sm:grid-cols-3"><Card><CardBody><p className="text-sm text-gray-500">Livrées</p><p className="mt-2 text-2xl font-bold">{delivered}</p></CardBody></Card><Card><CardBody><p className="text-sm text-gray-500">En attente</p><p className="mt-2 text-2xl font-bold">{pending}</p></CardBody></Card><Card><CardBody><p className="text-sm text-gray-500">Réussite</p><p className="mt-2 text-2xl font-bold">{successRate}%</p></CardBody></Card></div>; }
