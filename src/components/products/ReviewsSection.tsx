"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2, MessageSquare, Send } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/context/ToastContext";

interface ReviewUser {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface Review {
  _id: string;
  userId?: ReviewUser;
  rating: number;
  comment: string;
  createdAt?: string;
}

interface ReviewsSectionProps {
  productId: string;
  initialRating?: number;
  initialTotalReviews?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Stars = ({
  value,
  className = "w-4 h-4",
}: {
  value: number;
  className?: string;
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${className} ${
          star <= Math.round(value)
            ? "fill-amber-400 text-amber-400"
            : "text-purple-200"
        }`}
      />
    ))}
  </div>
);

export default function ReviewsSection({
  productId,
  initialRating = 0,
  initialTotalReviews = 0,
}: ReviewsSectionProps) {
  const { data: session } = useSession();
  const { success, error: showError } = useToast();
  const token = session?.session?.token;
  const isAuthenticated = !!session?.user;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async (): Promise<Review[]> => {
    if (!API_URL || !productId) return [];
    try {
      const res = await fetch(`${API_URL}/reviews/${productId}`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error("Reviews fetch error:", err);
      return [];
    }
  }, [productId]);

  useEffect(() => {
    let cancelled = false;

    fetchReviews().then((list) => {
      if (cancelled) return;
      setReviews(list);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchReviews]);

  const summary = useMemo(() => {
    const total = reviews.length;
    const average =
      total > 0
        ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total
        : initialRating || 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => Math.round(r.rating) === star).length,
    }));
    return {
      total: total || initialTotalReviews || 0,
      average: Math.round(average * 10) / 10,
      distribution,
    };
  }, [reviews, initialRating, initialTotalReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API_URL) return;

    if (!isAuthenticated || !token) {
      showError("Please sign in to write a review.", "Login Required");
      return;
    }
    if (!comment.trim()) {
      showError("Please write a short comment before submitting.", "Review");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to submit review");
      }

      success("Thanks for sharing your feedback!", "Review Submitted");
      setComment("");
      setRating(5);
      const updated = await fetchReviews();
      setReviews(updated);
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to submit review",
        "Review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 bg-white p-6 sm:p-10 rounded-3xl border border-purple-100 shadow-sm">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Customer Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-purple-50/30 rounded-2xl p-6 text-center border border-purple-100">
            <div className="text-5xl font-black text-purple-950">
              {summary.average.toFixed(1)}
            </div>
            <div className="flex justify-center mt-2">
              <Stars value={summary.average} className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Based on {summary.total}{" "}
              {summary.total === 1 ? "review" : "reviews"}
            </p>

            <div className="mt-5 space-y-2">
              {summary.distribution.map(({ star, count }) => {
                const pct =
                  summary.total > 0 ? (count / summary.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-600">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <div className="flex-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-gray-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Write review + list */}
        <div className="lg:col-span-2">
          {/* Review form */}
          <form
            onSubmit={handleSubmit}
            className="border border-purple-100 rounded-2xl p-5 mb-6 bg-purple-50/20"
          >
            <h3 className="font-bold text-gray-900 text-sm mb-3">
              Write a Review
            </h3>

            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star`}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-purple-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this product..."
              className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3 text-xs sm:text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 resize-none transition"
            />

            <div className="flex items-center justify-between mt-3 gap-3">
              {!isAuthenticated ? (
                <p className="text-xs text-gray-600">
                  <Link
                    href="/login"
                    className="font-semibold text-purple-600 hover:text-purple-700 underline"
                  >
                    Sign in
                  </Link>{" "}
                  to write a review.
                </p>
              ) : (
                <span className="text-xs text-gray-500">
                  Reviewing as {session?.user?.name || session?.user?.email}
                </span>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm shadow-purple-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="grid place-items-center h-4 w-0 group-hover/btn:w-4 opacity-0 group-hover/btn:opacity-100 translate-y-3 group-hover/btn:translate-y-0 transition-all duration-150 ease-out">
                    <Send className="w-4 h-4" />
                  </div>
                )}
                <span>Submit</span>
              </button>
            </div>
          </form>

          {/* Reviews list */}
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-purple-50/50 rounded-2xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-purple-100 rounded-2xl bg-purple-50/10">
              <p className="text-xs sm:text-sm text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const user = review.userId || {};
                const name = user.name || "Verified Customer";
                const avatar = user.avatar;
                return (
                  <div
                    key={review._id}
                    className="border border-purple-100 rounded-2xl p-4 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-100 shrink-0 flex items-center justify-center">
                        {avatar ? (
                          <Image
                            src={avatar}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-purple-700">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <Stars
                            value={review.rating}
                            className="w-3.5 h-3.5"
                          />
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
