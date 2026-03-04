"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../services/base-api";
import type { PageType } from "../../types";
import { Dispatch, SetStateAction } from "react";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

// Map category name → gender slug for gender-based filtering
const GENDER_MAP: Record<string, string> = {
  "Men's Fashion": "gender:men",
  "Women's Fashion": "gender:women",
};

interface CategoriesSectionProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoriesSection({
  setCurrentPage,
  setSelectedCategory,
}: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchApi<Category[]>("/v1/categories");
        // Only show top-level categories (parentId is null)
        const topLevel = data.filter((c) => c.parentId === null);
        setCategories(topLevel);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    // If it's a gender category, use gender slug; otherwise use categoryId
    const filterValue = GENDER_MAP[category.name] ?? String(category.id);
    setSelectedCategory(filterValue);
    setCurrentPage("products");
  };

  return (
    <section className="max-w-7xl mx-auto px-4">
      <h3 className="text-2xl font-serif font-semibold mb-8">
        Shop by Category
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="bg-secondary rounded-lg p-8 h-40 flex flex-col items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <h4 className="text-lg font-semibold text-foreground">
              {category.name}
            </h4>
          </button>
        ))}
      </div>
    </section>
  );
}