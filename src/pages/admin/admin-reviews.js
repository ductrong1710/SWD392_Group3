"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Trash2, Star } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
export default function AdminReviews({ reviews, setReviews }) {
    const [filter, setFilter] = useState("all");
    const toast = useToast();
    const filteredReviews = filter === "all"
        ? reviews
        : filter === "high"
            ? reviews.filter((r) => r.rating >= 4)
            : reviews.filter((r) => r.rating <= 2);
    const handleDelete = (reviewId) => {
        setReviews(reviews.filter((r) => r.reviewId !== reviewId));
        toast.success("Review deleted", "Review has been removed successfully");
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Review Management" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "View and manage customer reviews" })] }), _jsx("div", { className: "flex gap-2", children: [
                    { key: "all", label: "All" },
                    { key: "high", label: "High Rating (4-5★)" },
                    { key: "low", label: "Low Rating (1-2★)" },
                ].map((item) => (_jsx("button", { onClick: () => setFilter(item.key), className: `px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filter === item.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"}`, children: item.label }, item.key))) }), _jsxs("div", { className: "space-y-4", children: [filteredReviews.map((review) => (_jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "font-semibold", children: review.userName }), _jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: 5 }).map((_, i) => (_jsx(Star, { className: `w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}` }, i))) })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: review.createdAt })] }), _jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${review.rating >= 4
                                            ? "bg-green-100 text-green-700"
                                            : review.rating >= 3
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"}`, children: [review.rating, "\u2605"] })] }), _jsx("p", { className: "text-sm mb-4 text-foreground", children: review.comment }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { onClick: () => handleDelete(review.reviewId), className: "flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors font-medium text-sm", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Delete"] }) })] }, review.reviewId))), filteredReviews.length === 0 && (_jsx("p", { className: "text-center text-muted-foreground py-8", children: "No reviews found" }))] })] }));
}
