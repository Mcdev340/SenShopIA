"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useAuth, useProducts, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Avatar from "@/components/ui/Avatar";
import ProductRating from "./ProductRating";
import Spinner from "@/components/ui/Spinner";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Star, ThumbsUp, ThumbsDown, Loader2, CheckCircle } from "lucide-react";

const AvatarComponent = Avatar as any;
const TextareaComponent = Textarea as any;

interface ProductReviewsProps {
  productId: string;
  className?: string;
  limit?: number;
}

export default function ProductReviews({
  productId,
  className = "",
  limit = 10,
}: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const { loadProductReviews, createProductReview, markReviewHelpful } =
    useProducts();
  const { success, error: showError } = useToast();

  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadReviews = useCallback(
    async (reset = true) => {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      try {
        const result = (await loadProductReviews(productId)) as any;
        setReviews(result.reviews || []);
        setStats({
          averageRating: result.averageRating || 0,
          totalReviews: result.total || 0,
          distribution: result.ratingDistribution || {},
        });
        setHasMore(result.reviews.length >= limit);
      } catch (error) {
        showError("Erreur de chargement des avis");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId, loadProductReviews, limit, showError],
  );

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showError("Connectez-vous pour laisser un avis");
      return;
    }
    if (rating === 0) {
      showError("Veuillez noter le produit");
      return;
    }

    setSubmitting(true);
    try {
      await createProductReview(productId, rating, title, comment);
      success("Avis ajouté avec succès");
      setShowForm(false);
      setRating(0);
      setTitle("");
      setComment("");
      loadReviews();
    } catch (error) {
      showError("Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await markReviewHelpful(reviewId, helpful);
      loadReviews();
    } catch (error) {
      showError("Erreur");
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
    loadReviews(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Avis clients
          </h3>
          {stats && stats.totalReviews > 0 && (
            <div className="flex items-center gap-4 mt-1">
              <ProductRating rating={stats.averageRating} size="lg" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.totalReviews} avis
              </span>
            </div>
          )}
        </div>
        {isAuthenticated && !showForm && (
          <Button onClick={() => setShowForm(true)}>Donner un avis</Button>
        )}
      </div>

      {/* Distribution */}
      {stats && stats.totalReviews > 0 && (
        <div className="space-y-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star] || 0;
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {star}★
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Donner un avis
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="Titre de l'avis"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextareaComponent
            placeholder="Votre commentaire..."
            value={comment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            rows={4}
            required
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              "Publier l'avis"
            )}
          </Button>
        </form>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500 dark:text-gray-400">
              Aucun avis pour ce produit.
            </p>
            {isAuthenticated && !showForm && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                Soyez le premier à donner un avis
              </Button>
            )}
          </div>
        ) : (
          <>
            {reviews.slice(0, page * limit).map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <AvatarComponent
                    src={review.user?.avatar}
                    alt={review.user?.username || "Utilisateur"}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {review.user?.username || "Anonyme"}
                      </span>
                      <ProductRating
                        rating={review.rating}
                        size="sm"
                        showCount={false}
                        showLabel={false}
                      />
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(review.createdAt)}
                      </span>
                      {review.isVerified && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-0.5" />
                          Achat vérifié
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mt-1">
                      {review.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleHelpful(review.id, true)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{review.helpful || 0}</span>
                      </button>
                      <button
                        onClick={() => handleHelpful(review.id, false)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {review.user?.id === user?.id && (
                        <span className="text-xs text-gray-400">
                          Votre avis
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && reviews.length > page * limit && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Voir plus d'avis"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
