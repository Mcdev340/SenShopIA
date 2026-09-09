import { Check, Circle } from 'lucide-react';

interface DeliveryRouteProps { steps: string[]; currentStep?: number; }
export default function DeliveryRoute({ steps, currentStep = 0 }: DeliveryRouteProps) { return <ol className="space-y-4">{steps.map((step, index) => <li key={step} className="flex items-center gap-3 text-sm"><span className={index <= currentStep ? 'text-green-600' : 'text-gray-400'}>{index <= currentStep ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}</span><span className={index <= currentStep ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}>{step}</span></li>)}</ol>; }
