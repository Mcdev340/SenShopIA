'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface ProductFormValues { name: string; price: number; stock: number; category: string; }
interface ProductFormProps { initialValues?: Partial<ProductFormValues>; onSubmit?: (values: ProductFormValues) => void; }

export default function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({ name: initialValues?.name ?? '', price: initialValues?.price ?? 0, stock: initialValues?.stock ?? 0, category: initialValues?.category ?? '' });
  const update = (key: keyof ProductFormValues, value: string) => setValues((current) => ({ ...current, [key]: key === 'name' || key === 'category' ? value : Number(value) }));
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit?.(values); };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nom du produit" value={values.name} onChange={(event) => update('name', event.target.value)} required /><Input label="Catégorie" value={values.category} onChange={(event) => update('category', event.target.value)} required /><Input label="Prix" type="number" min="0" value={values.price} onChange={(event) => update('price', event.target.value)} required /><Input label="Stock" type="number" min="0" value={values.stock} onChange={(event) => update('stock', event.target.value)} required /><Button type="submit">Enregistrer le produit</Button></form>;
}
