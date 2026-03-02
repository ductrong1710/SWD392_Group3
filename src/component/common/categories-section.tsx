import { Dispatch, SetStateAction } from "react";
import type { PageType } from "../../types";

interface CategoriesSectionProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoriesSection({
  setCurrentPage,
  setSelectedCategory,
}: CategoriesSectionProps) {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage("products");
  };

  const categoryImages: { [key: string]: string } = {
    Women: new URL("../../assets/img/Male.jpg", import.meta.url).href,
    Men: new URL("../../assets/img/Men.jpg", import.meta.url).href,
    Accessories: new URL("../../assets/img/Accessories .jpg", import.meta.url).href,
  };

  return (
    <section className="px-8 my-12">
      <h3 className="text-4xl font-serif font-semibold mb-8">
        Shop by Category
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Women", "Men", "Accessories"].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="relative rounded-lg p-8 text-center hover:scale-105 transition-all duration-300 cursor-pointer group overflow-hidden h-[28rem]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${categoryImages[cat]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10">
              <h4 className="text-xl font-serif font-semibold text-white">
                {cat}
              </h4>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
