"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import type { PageType } from "../../types";
import HeroSection from "../../component/common/hero-section";
import CategoriesSection from "../../component/common/categories-section";
import FeaturedProductsSection from "../../component/common/featured-products-section";
import VerticalBanner from "../../component/common/vertical-banner";

interface GuestHomeProps {
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setSelectedCategory: (category: string | null) => void;
}

export default function GuestHome({
  setCurrentPage,
  setSelectedCategory,
}: GuestHomeProps) {
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Multiple attempts to ensure scroll happens
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
      {/* Vertical Banner */}
      <VerticalBanner />
      
      <div className="space-y-16">
        {/* Hero */}
        <HeroSection
          setCurrentPage={setCurrentPage}
          setSelectedCategory={setSelectedCategory}
        />

      {/* Categories */}
      <div className="pl-12">
        <CategoriesSection
          setCurrentPage={setCurrentPage}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Featured Products Preview */}
      <div className="pl-12 mb-16">
        <FeaturedProductsSection
          setCurrentPage={setCurrentPage}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
    </div>
    </div>
  );
}
