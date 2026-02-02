"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string
  comment: string
  date: string
  flagged: boolean
}

interface AdminReviewsProps {
  reviews: Review[]
  setReviews: (reviews: Review[]) => void
}

export default function AdminReviews({ reviews, setReviews }: AdminReviewsProps) {
  const [filter, setFilter] = useState<"all" | "flagged" | "clean">("all")

  const filteredReviews =
    filter === "all"
      ? reviews
      : filter === "flagged"
        ? reviews.filter((r) => r.flagged)
        : reviews.filter((r) => !r.flagged)

  const handleFlag = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, flagged: !r.flagged } : r)))
  }

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Review Moderation</h2>
        <p className="text-muted-foreground mt-1">Manage and moderate customer reviews</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "clean", "flagged"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              filter === status
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
          >
            {status === "all" ? "All" : status === "clean" ? "Clean" : "Flagged"}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{review.title}</h3>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Product ID: {review.productId}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  review.flagged ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {review.flagged ? "Flagged" : "Clean"}
              </span>
            </div>

            <p className="text-sm mb-4 text-foreground">{review.comment}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
              <span>{review.date}</span>
              <span className="text-xs">User ID: {review.userId}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleFlag(review.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors font-medium text-sm ${
                  review.flagged
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {review.flagged ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                {review.flagged ? "Unflag" : "Flag"}
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                className="flex-1 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
