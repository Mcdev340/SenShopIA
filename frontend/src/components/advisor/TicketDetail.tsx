import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

interface TicketDetailProps { id: string; subject: string; description: string; status: string; }
export default function TicketDetail({ id, subject, description, status }: TicketDetailProps) { return <Card><CardHeader><CardTitle>{subject}</CardTitle><p className="text-xs text-gray-500">Ticket #{id} · {status}</p></CardHeader><CardBody><p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p></CardBody></Card>; }
