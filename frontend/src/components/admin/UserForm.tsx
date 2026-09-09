'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface UserFormValues { username: string; email: string; role: 'client' | 'admin' | 'advisor' | 'delivery'; }
interface UserFormProps { onSubmit?: (values: UserFormValues) => void; }

export default function UserForm({ onSubmit }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({ username: '', email: '', role: 'client' });
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit?.(values); };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nom d’utilisateur" value={values.username} onChange={(event) => setValues({ ...values, username: event.target.value })} required /><Input label="Email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Rôle<select className="mt-2 w-full rounded-lg border border-gray-300 bg-transparent p-2.5 dark:border-gray-700" value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value as UserFormValues['role'] })}><option value="client">Client</option><option value="admin">Administrateur</option><option value="advisor">Conseiller</option><option value="delivery">Livreur</option></select></label><Button type="submit">Enregistrer l’utilisateur</Button></form>;
}
