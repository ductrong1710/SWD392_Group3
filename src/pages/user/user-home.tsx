"use client";

import { ArrowRight } from "lucide-react";
import type { PageType } from "../../types";
import { Dispatch, SetStateAction } from "react";

interface UserHomeProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function UserHome({
  setCurrentPage,
  setSelectedCategory,
}: UserHomeProps) {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage("products");
  };

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent/20 to-accent/5 py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm text-accent font-semibold mb-4">
              PERSONALIZED FOR YOU
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Welcome Back, John
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Continue shopping your favorite collections with personalized
              recommendations.
            </p>
            <button
              onClick={() => setCurrentPage("products")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Explore New Arrivals
            </button>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-serif font-semibold mb-8">Quick Shop</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Women", "Men", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-accent transition-all cursor-pointer"
            >
              <p className="text-sm text-muted-foreground mb-2">Shop</p>
              <p className="font-semibold mb-4 text-lg">{cat}</p>
              <div className="flex items-center gap-2 text-primary">
                <span className="text-sm font-medium">Browse</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h3 className="text-2xl font-serif font-semibold mb-8">
          Recommended For You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setCurrentPage("products")}
            className="bg-secondary rounded-lg p-8 h-48 flex flex-col justify-between hover:bg-secondary/80 transition-colors cursor-pointer text-left"
          >
            <div>
              <p className="text-sm text-muted-foreground">
                Based on your style
              </p>
              <h4 className="text-2xl font-semibold mt-2">
                Similar to Your Favorites
              </h4>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-sm font-medium">Discover</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
