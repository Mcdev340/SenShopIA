import WorkspacePage from '@/components/shared/WorkspacePage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';

const questions = [
  ['Comment suivre ma commande ?', 'Ouvrez la rubrique Commandes depuis votre espace personnel pour consulter le statut et les étapes de livraison.'],
  ['Quels moyens de paiement sont acceptés ?', 'Les moyens disponibles sont affichés au moment du paiement selon votre pays et votre commande.'],
  ['Comment contacter le support ?', 'Notre équipe est disponible depuis la page Contact ou le chat de votre espace personnel.'],
];

export default function FAQPage() {
  return (
    <WorkspacePage title="Questions fréquentes" description="Les réponses aux questions que nous recevons le plus souvent.">
      <Accordion type="single" className="rounded-lg border border-gray-200 px-4 dark:border-gray-800">
        {questions.map(([question, answer], index) => (
          <AccordionItem key={question} value={`question-${index}`}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </WorkspacePage>
  );
}
