"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import GuestHeader from "../component/headers/guest-header";
import type { PageType, UserRole, ProductSummary } from "../types";
import GuestHome from "../pages/guest/guest-home";
import GuestProducts from "../pages/guest/guest-products";
import ChatbotWidget from "../component/common/chatbot-widget";
import Footer from "../component/common/footer";
import LoginModal from "../component/common/login-modal";

interface GuestLayoutProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setRole: Dispatch<SetStateAction<UserRole>>;
  products: ProductSummary[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}

export default function GuestLayout({
  currentPage,
  setCurrentPage,
  setRole,
  products,
  selectedCategory,
  setSelectedCategory,
  selectedProductId,
  setSelectedProductId,
}: GuestLayoutProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedCategory]);

  const handleCheckout = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GuestHeader
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRole={setRole}
      />
      <main className="flex-1 pt-16">
        {currentPage === "home" && (
          <GuestHome
            setCurrentPage={setCurrentPage}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        {currentPage === "products" && (
          <GuestProducts
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            onCheckout={handleCheckout}
          />
        )}
        {currentPage === "product-detail" && selectedProductId && (
          <div>Product detail would go here</div>
        )}
      </main>
      <Footer />
      <ChatbotWidget role="guest" />
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => {
            setRole("user");
            setShowLoginModal(false);
            setCurrentPage("products");
          }}
        />
      )}
    </div>
  );
}