"use client";

import { Dispatch, SetStateAction } from "react";
import type { PageType } from "../types/types";

interface GuestHomeProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function GuestHome({
  setCurrentPage,
  setSelectedCategory,
}: GuestHomeProps) {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage("products");
  };

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-secondary/50 py-20 md:py-32">
        <div className="px-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Discover Timeless Fashion
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our curated collection of premium fashion pieces for every
              occasion. Login to start shopping today.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => setCurrentPage("login")}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Sign Up to Shop
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage("products");
                }}
                className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Browse as Guest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8">
        <h3 className="text-2xl font-serif font-semibold mb-8">
          Shop by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Women", "Men", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="bg-secondary rounded-lg p-8 text-center hover:bg-secondary/80 transition-colors cursor-pointer group"
            >
              <h4 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {cat}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Explore {cat.toLowerCase()} collection
              </p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <span className="text-sm font-medium">Browse</span>
                <img src="/arrow-right.png" alt="arrow" className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="px-8">
        <h3 className="text-2xl font-serif font-semibold mb-8">
          Featured Collections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => {
              setSelectedCategory("Women");
              setCurrentPage("products");
            }}
            className="bg-secondary rounded-lg p-8 h-48 flex flex-col justify-between hover:bg-secondary/80 transition-colors cursor-pointer group text-left"
          >
            <div>
              <p className="text-sm text-muted-foreground">
                Limited Collection
              </p>
              <h4 className="text-2xl font-semibold mt-2 group-hover:text-primary transition-colors">
                Summer Essentials
              </h4>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-sm font-medium">Explore</span>
              <img src="/arrow-right.png" alt="arrow" className="w-4 h-4" />
            </div>
          </button>
          <button
            onClick={() => {
              setSelectedCategory("Men");
              setCurrentPage("products");
            }}
            className="bg-secondary rounded-lg p-8 h-48 flex flex-col justify-between hover:bg-secondary/80 transition-colors cursor-pointer group text-left"
          >
            <div>
              <p className="text-sm text-muted-foreground">New Arrival</p>
              <h4 className="text-2xl font-semibold mt-2 group-hover:text-primary transition-colors">
                Fall Collection
              </h4>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-sm font-medium">Shop Now</span>
              <img src="/arrow-right.png" alt="arrow" className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
