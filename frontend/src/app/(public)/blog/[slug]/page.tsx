import Link from 'next/link';
import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody } from '@/components/ui/Card';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const title = slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <WorkspacePage title={title} description="Un conseil clair, pensé pour vous aider à prendre une meilleure décision d’achat.">
      <Card>
        <CardBody>
          <div className="prose max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
            <p>Chez ShopSense AI, nous mettons l’information utile au premier plan. Comparez les caractéristiques, vérifiez les conditions et choisissez selon votre usage réel.</p>
            <h2>Les bons réflexes</h2>
            <p>Définissez votre budget, identifiez les critères importants et consultez les informations de livraison avant de confirmer votre commande.</p>
            <p><Link className="font-semibold text-primary-600 hover:underline" href="/blog">Retour au journal</Link></p>
          </div>
        </CardBody>
      </Card>
    </WorkspacePage>
  );
}
