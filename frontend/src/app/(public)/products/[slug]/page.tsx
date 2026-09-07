"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks";
import ProductDetails from "@/components/products/ProductDetails";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProductBySlug } = useProducts();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
      } else {
        setError("Produit non trouvé");
      }
    } catch {
      setError("Erreur de chargement du produit");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Produit non trouvé">
          Le produit que vous recherchez n'existe pas ou a été supprimé.
          <Button className="mt-4" onClick={() => router.push("/products")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voir tous les produits
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} onBack={() => router.back()} />
    </div>
  );
}
