'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TicketFormProps { onSubmit?: (values: { subject: string; message: string }) => void; }
export default function TicketForm({ onSubmit }: TicketFormProps) { const [subject, setSubject] = useState(''); const [message, setMessage] = useState(''); const submit = (event: FormEvent) => { event.preventDefault(); onSubmit?.({ subject, message }); }; return <form onSubmit={submit} className="space-y-4"><Input label="Sujet" value={subject} onChange={(event) => setSubject(event.target.value)} required /><label className="block text-sm font-medium">Message<textarea className="mt-2 min-h-32 w-full rounded-lg border border-gray-300 p-3 dark:border-gray-700 dark:bg-gray-900" value={message} onChange={(event) => setMessage(event.target.value)} required /></label><Button type="submit">Créer le ticket</Button></form>; }
