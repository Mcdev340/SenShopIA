import Link from 'next/link';
import WorkspacePage from '@/components/shared/WorkspacePage';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

const posts = [
  { slug: 'acheter-en-ligne-en-toute-confiance', title: 'Acheter en ligne en toute confiance', excerpt: 'Les réflexes essentiels pour comparer, choisir et suivre une commande.' },
  { slug: 'bien-choisir-son-smartphone', title: 'Bien choisir son smartphone', excerpt: 'Un guide simple pour comparer autonomie, photo, stockage et budget.' },
  { slug: 'livraison-au-senegal', title: 'Comprendre la livraison au Sénégal', excerpt: 'Délais, suivi et conseils pour recevoir vos achats sereinement.' },
];

export default function BlogPage() {
  return (
    <WorkspacePage title="Le journal ShopSense" description="Conseils d’achat, guides produits et idées utiles pour consommer plus simplement.">
      <div className="grid gap-5 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} hoverable>
            <CardHeader><CardTitle>{post.title}</CardTitle></CardHeader>
            <CardBody>
              <p className="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              <Link className="text-sm font-semibold text-primary-600 hover:underline" href={`/blog/${post.slug}`}>Lire l’article</Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </WorkspacePage>
  );
}
