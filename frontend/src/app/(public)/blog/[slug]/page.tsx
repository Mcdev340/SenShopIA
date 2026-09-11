"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Link2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Card, CardBody } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/hooks";

const mockPost = {
  id: "1",
  title: "Comment acheter depuis l'étranger sans se ruiner ?",
  slug: "comment-acheter-depuis-etranger-sans-se-ruiner",
  excerpt:
    "Découvrez nos astuces pour acheter des produits internationaux à moindre coût. Guide complet des économies à réaliser.",
  content: `
    <p>L'achat de produits internationaux peut sembler complexe et coûteux. Pourtant, avec les bonnes stratégies, vous pouvez réaliser des économies significatives. Dans cet article, nous vous dévoilons toutes nos astuces pour acheter depuis l'étranger sans vous ruiner.</p>

    <h2>1. Comparez les prix</h2>
    <p>Avant tout achat, prenez le temps de comparer les prix sur différentes plateformes. Utilisez des outils de comparaison et n'hésitez pas à consulter plusieurs marketplaces internationales.</p>

    <h2>2. Profitez des périodes de promotion</h2>
    <p>Les soldes, le Black Friday, le Cyber Monday et autres événements promotionnels sont des occasions idéales pour faire de bonnes affaires. Planifiez vos achats en fonction de ces périodes.</p>

    <h2>3. Calculez tous les frais</h2>
    <p>N'oubliez pas d'inclure les frais de transport, les droits de douane et les taxes dans votre budget. Notre outil d'estimation des coûts vous aide à avoir une vision complète.</p>

    <h2>4. Utilisez notre agent IA</h2>
    <p>Notre assistant intelligent peut vous recommander les meilleures options en fonction de vos besoins et de votre budget. N'hésitez pas à lui poser toutes vos questions.</p>

    <h2>5. Optez pour la livraison groupée</h2>
    <p>Regroupez vos achats pour réduire les frais de livraison. Certains services proposent des solutions de consolidation de commandes.</p>

    <h2>Conclusion</h2>
    <p>Avec ShopSense AI, acheter depuis l'étranger devient simple et économique. Utilisez nos outils et conseils pour optimiser vos achats et réaliser des économies substantielles.</p>
  `,
  image: "/images/blog/achats-etranger.jpg",
  author: "Mamadou Diallo",
  authorAvatar: "/images/team/1.jpg",
  date: "2024-01-15",
  readTime: 5,
  category: "Conseils d'achat",
  tags: ["Achats internationaux", "Économies", "Guide"],
  views: 1250,
  comments: 23,
  relatedPosts: [
    {
      id: "2",
      title: "Les meilleures pratiques de paiement en ligne au Sénégal",
      slug: "meilleures-pratiques-paiement-en-ligne-senegal",
      excerpt: "Guide des moyens de paiement disponibles au Sénégal.",
      image: "/images/blog/paiement-senegal.jpg",
    },
    {
      id: "3",
      title: "Comment suivre votre colis en temps réel",
      slug: "comment-suivre-colis-temps-reel",
      excerpt:
        "Utilisez notre outil de suivi pour connaître la position de votre colis.",
      image: "/images/blog/suivi-colis.jpg",
    },
  ],
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { success } = useToast();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (slug === mockPost.slug) {
        setPost(mockPost);
      } else {
        setError("Article non trouvé");
      }
    } catch (error) {
      setError("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post?.title || "";

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        success("Lien copié !");
        setTimeout(() => setIsCopied(false), 3000);
      } catch {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setIsCopied(true);
        success("Lien copié !");
        setTimeout(() => setIsCopied(false), 3000);
      }
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Article non trouvé">
          L'article que vous recherchez n'existe pas.
          <Button className="mt-4" onClick={() => router.push("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au blog
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Bouton retour */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/blog")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au blog
      </Button>

      {/* Article */}
      <article>
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime} min de lecture
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.author}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>{post.views} vues</span>
            </div>
          </div>
        </div>

        {/* Image */}
        {post.image && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden mb-6">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? "text-red-500 border-red-200" : ""}
          >
            <Heart
              className={`w-4 h-4 mr-2 ${isLiked ? "fill-red-500" : ""}`}
            />
            {isLiked ? "J'aime" : "Aimer"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={isSaved ? "text-primary-600 border-primary-200" : ""}
          >
            <Bookmark
              className={`w-4 h-4 mr-2 ${isSaved ? "fill-primary-600" : ""}`}
            />
            {isSaved ? "Sauvegardé" : "Sauvegarder"}
          </Button>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("facebook")}
              className="text-gray-400 hover:text-blue-600"
            >
              <FaFacebook size={24} />{" "}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("twitter")}
              className="text-gray-400 hover:text-sky-500"
            >
              <FaTwitter size={24} />{" "}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("linkedin")}
              className="text-gray-400 hover:text-blue-700"
            >
              <FaLinkedin size={24} /> {" "}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("copy")}
              className="text-gray-400 hover:text-gray-600"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Contenu */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Commentaires */}
        <Card>
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Commentaires ({post.comments})
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Connectez-vous pour laisser un commentaire.
            </p>
            <div className="mt-4 space-y-4">
              {/* Simuler des commentaires */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Jean Dupont
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Super article, très instructif !
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Il y a 2 heures
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Marie Diop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Merci pour ces conseils, je vais les appliquer !
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Il y a 5 heures
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Articles similaires */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Articles similaires
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.relatedPosts.map((related: any) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardBody className="p-4">
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        {related.image ? (
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {related.excerpt}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
