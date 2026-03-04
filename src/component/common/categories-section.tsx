import { Dispatch, SetStateAction } from "react";
import type { PageType } from "../../types";

interface CategoriesSectionProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

const GENDER_MAP: Record<string, string> = {
  "Women's Fashion": "gender:women",
  "Men's Fashion": "gender:men",
};

const categories = [
  {
    name: "Women's Fashion",
    image: new URL("../../assets/img/Male.jpg", import.meta.url).href,
    description: "Explore our women's collection",
  },
  {
    name: "Men's Fashion",
    image: new URL("../../assets/img/Men.jpg", import.meta.url).href,
    description: "Explore our men's collection",
  },
];

export default function CategoriesSection({
  setCurrentPage,
  setSelectedCategory,
}: CategoriesSectionProps) {
  const handleCategoryClick = (categoryName: string) => {
    // Convert category name to "gender:men" or "gender:women" format
    const filterValue = GENDER_MAP[categoryName] ?? categoryName;
    setSelectedCategory(filterValue);
    setCurrentPage("products");
  };

  return (
    <section className="px-8 my-12">
      <h3 className="text-4xl font-serif font-semibold mb-8">
        Shop by Category
      </h3>
      <div className="grid grid-cols-2 gap-8">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="relative rounded-lg text-center hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden h-[28rem]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.5)), url(${cat.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 flex flex-col items-center justify-end h-full pb-10">
              <h4 className="text-3xl font-serif font-bold text-white mb-2">
                {cat.name}
              </h4>
              <p className="text-white/80 text-sm mb-4">{cat.description}</p>
              <span className="inline-flex items-center gap-2 text-white font-medium text-sm border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                Shop Now →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}