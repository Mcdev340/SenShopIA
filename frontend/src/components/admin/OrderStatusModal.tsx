'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
interface OrderStatusModalProps { open: boolean; orderId: string; status: OrderStatus; onClose: () => void; onSave?: (status: OrderStatus) => void; }

export default function OrderStatusModal({ open, orderId, status, onClose, onSave }: OrderStatusModalProps) {
  return <Modal isOpen={open} onClose={onClose} title={`Commande ${orderId}`}><div className="space-y-4"><p className="text-sm text-gray-600 dark:text-gray-300">Mettez à jour le statut visible par le client.</p><select className="w-full rounded-lg border border-gray-300 bg-transparent p-2.5 dark:border-gray-700" defaultValue={status} onChange={(event) => onSave?.(event.target.value as OrderStatus)}><option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="shipped">Expédiée</option><option value="delivered">Livrée</option><option value="cancelled">Annulée</option></select><Button variant="outline" onClick={onClose}>Fermer</Button></div></Modal>;
}
