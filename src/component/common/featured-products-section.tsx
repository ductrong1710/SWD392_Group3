import { Dispatch, SetStateAction } from "react";
import type { PageType } from "../../types";

interface FeaturedProductsSectionProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function FeaturedProductsSection({
  setCurrentPage,
  setSelectedCategory,
}: FeaturedProductsSectionProps) {
  const featuredImages: { [key: string]: string } = {
    "Summer Essentials": new URL("../../assets/img/Summer Essentials.jpg", import.meta.url).href,
    "Fall Collection": new URL("../../assets/img/Fall Collection.jpg", import.meta.url).href,
  };

  return (
    <section className="px-8 pb-16">
      <h3 className="text-4xl font-serif font-semibold mb-8">
        Featured Collections
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => {
            setSelectedCategory("Women");
            setCurrentPage("products");
          }}
          className="relative rounded-lg p-8 h-48 flex flex-row items-center gap-6 hover:opacity-90 transition-opacity cursor-pointer group text-left overflow-hidden"
          style={{
            backgroundImage: `url(${featuredImages["Summer Essentials"]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          
          <div className="flex flex-col justify-center flex-1 relative z-10">
            <p className="text-sm font-serif text-white drop-shadow-lg">
              Limited Collection
            </p>
            <h4 className="text-2xl font-serif font-semibold mt-2 text-white drop-shadow-lg group-hover:opacity-80 transition-opacity">
              Summer Essentials
            </h4>
            <span className="text-sm font-serif font-medium text-white drop-shadow-lg mt-4">Explore</span>
          </div>
        </button>
        <button
          onClick={() => {
            setSelectedCategory("Men");
            setCurrentPage("products");
          }}
          className="relative rounded-lg p-8 h-48 flex flex-row items-center gap-6 hover:opacity-90 transition-opacity cursor-pointer group text-left overflow-hidden"
          style={{
            backgroundImage: `url(${featuredImages["Fall Collection"]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          
          <div className="flex flex-col justify-center flex-1 relative z-10">
            <p className="text-sm font-serif text-white drop-shadow-lg">New Arrival</p>
            <h4 className="text-2xl font-serif font-semibold mt-2 text-white drop-shadow-lg group-hover:opacity-80 transition-opacity">
              Fall Collection
            </h4>
            <span className="text-sm font-serif font-medium text-white drop-shadow-lg mt-4">Shop Now</span>
          </div>
        </button>
      </div>
    </section>
  );
}
