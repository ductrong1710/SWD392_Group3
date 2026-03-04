"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import type { PageType } from "../../types";
import { Dispatch, SetStateAction } from "react";
import CategoriesSection from "../../component/common/categories-section";
import FeaturedProductsSection from "../../component/common/featured-products-section";
import VerticalBanner from "../../component/common/vertical-banner";

interface UserHomeProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function UserHome({
  setCurrentPage,
  setSelectedCategory,
}: UserHomeProps) {
  // Scroll to top like guest-home
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const timeout1 = requestAnimationFrame(scrollToTop);
    const timeout2 = setTimeout(scrollToTop, 10);
    const timeout3 = setTimeout(scrollToTop, 50);
    const timeout4 = setTimeout(scrollToTop, 100);
    const timeout5 = setTimeout(scrollToTop, 200);

    return () => {
      cancelAnimationFrame(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(timeout5);
    };
  }, []);

  return (
    <div className="relative">
      {/* Vertical Banner - giống Guest */}
      <VerticalBanner />

      <div className="space-y-16">
        {/* Hero - Video background giống Guest nhưng nội dung cho User */}
        <section className="relative bg-gradient-to-br from-secondary to-secondary/50 py-16 md:py-24 overflow-hidden">
          {/* YouTube Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 w-[300%] h-[300%] pointer-events-none"
              style={{
                transform: "translate(-50%, -50%)",
                minWidth: "100vw",
                minHeight: "100vh",
              }}
              src="https://www.youtube.com/embed/HriD0WOQL8I?autoplay=1&mute=1&loop=1&playlist=HriD0WOQL8I&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playsinline=1"
              title="Background video"
              allow="autoplay; encrypted-media"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="px-8 pl-20 relative z-10">
            <div>
              <p className="text-sm text-accent font-semibold mb-4 drop-shadow-md">
                PERSONALIZED FOR YOU
              </p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-lg">
                Welcome Back, John
              </h2>
              <p className="text-lg font-serif text-white mb-8 drop-shadow-md">
                Continue shopping your favorite collections with personalized
                recommendations.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap mt-12 md:mt-16">
              <button
                onClick={() => setCurrentPage("products")}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-serif font-medium shadow-lg"
              >
                Explore New Arrivals
              </button>
              <button
                onClick={() => setCurrentPage("orders")}
                className="px-6 py-3 bg-transparent text-white rounded-lg hover:border-2 hover:border-white transition-colors font-serif font-medium"
              >
                View My Orders
              </button>
            </div>
          </div>
        </section>

        {/* Categories - dùng component chung giống Guest */}
        <div className="pl-12">
          <CategoriesSection
            setCurrentPage={setCurrentPage}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Featured Products - giống Guest */}
        <div className="pl-12">
          <FeaturedProductsSection
            setCurrentPage={setCurrentPage}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Recommendations - giữ lại phần riêng của User */}
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
    </div>
  );
}