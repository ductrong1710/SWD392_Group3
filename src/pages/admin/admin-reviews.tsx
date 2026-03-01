"use client"

import { useState } from "react"
import { Trash2, Star } from "lucide-react"
import type { Review } from "../../types"

interface AdminReviewsProps {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
}

export default function AdminReviews({ reviews, setReviews }: AdminReviewsProps) {
  const [filter, setFilter] = useState<"all" | "high" | "low">("all")

  const filteredReviews =
    filter === "all"
      ? reviews
      : filter === "high"
        ? reviews.filter((r) => r.rating >= 4)
        : reviews.filter((r) => r.rating <= 2)

  const handleDelete = (reviewId: number) => {
    setReviews(reviews.filter((r) => r.reviewId !== reviewId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Review Management</h2>
        <p className="text-muted-foreground mt-1">View and manage customer reviews</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "high", label: "High Rating (4-5★)" },
          { key: "low", label: "Low Rating (1-2★)" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as "all" | "high" | "low")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === item.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.reviewId} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{review.userName}</h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{review.createdAt}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  review.rating >= 4
                    ? "bg-green-100 text-green-700"
                    : review.rating >= 3
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {review.rating}★
              </span>
            </div>

            <p className="text-sm mb-4 text-foreground">{review.comment}</p>

            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(review.reviewId)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredReviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No reviews found</p>
        )}
      </div>
    </div>
  )
}