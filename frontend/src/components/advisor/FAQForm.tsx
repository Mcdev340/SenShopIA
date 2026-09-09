'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface FAQFormProps { onSubmit?: (values: { question: string; answer: string }) => void; }
export default function FAQForm({ onSubmit }: FAQFormProps) { const [question, setQuestion] = useState(''); const [answer, setAnswer] = useState(''); const submit = (event: FormEvent) => { event.preventDefault(); onSubmit?.({ question, answer }); }; return <form onSubmit={submit} className="space-y-4"><Input label="Question" value={question} onChange={(event) => setQuestion(event.target.value)} required /><label className="block text-sm font-medium">Réponse<textarea className="mt-2 min-h-32 w-full rounded-lg border border-gray-300 p-3 dark:border-gray-700 dark:bg-gray-900" value={answer} onChange={(event) => setAnswer(event.target.value)} required /></label><Button type="submit">Publier la réponse</Button></form>; }
