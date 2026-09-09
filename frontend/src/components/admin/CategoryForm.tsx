'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface CategoryFormValues { name: string; description: string; }
interface CategoryFormProps { onSubmit?: (values: CategoryFormValues) => void; }

export default function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({ name: '', description: '' });
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit?.(values); };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nom" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required /><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description<textarea className="mt-2 min-h-28 w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm dark:border-gray-700" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} /></label><Button type="submit">Créer la catégorie</Button></form>;
}
