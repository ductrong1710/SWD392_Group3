"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import type { OrderResponse } from "../services/order-api";
import type {
  CartItem,
  ProductSummary,
  PageType,
  UserRole,
} from "../types";
import UserHeader from "../component/headers/user-header";
import UserHome from "../pages/user/user-home";
import UserProducts from "../pages/user/user-products";
import UserCart from "../pages/user/user-cart";
import UserOrders from "../pages/user/user-orders";
import UserCheckout from "../pages/user/user-checkout";
import UserProfilePage from "../pages/user/user-profile";
import UserProductDetail from "../pages/user/user-product-detail";
import ChatbotWidget from "../component/common/chatbot-widget";
import Footer from "../component/common/footer";

interface UserLayoutProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setRole: Dispatch<SetStateAction<UserRole>>;
  onLogout: () => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  orders: OrderResponse[];
  setOrders: (orders: OrderResponse[]) => void;
  products: ProductSummary[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
}

export default function UserLayout({
  currentPage,
  setCurrentPage,
  onLogout,
  cart,
  setCart,
  orders,
  setOrders,
  products,
  selectedCategory,
  setSelectedCategory,
  selectedProductId,
  setSelectedProductId,
  selectedOrderId,
  setSelectedOrderId,
}: UserLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserHeader
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={onLogout}
        cartCount={cartCount}
      />
      <main className="flex-1 pt-16">
        {currentPage === "home" && (
          <UserHome
            setCurrentPage={setCurrentPage}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {currentPage === "products" && (
          <UserProducts
            products={products}
            cart={cart}
            setCart={setCart}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
          />
        )}

        {currentPage === "product-detail" && selectedProductId && (
          <UserProductDetail
            productId={Number(selectedProductId)}
            onClose={() => setCurrentPage("products")}
            onAddToCart={async () => {}}
          />
        )}

        {currentPage === "cart" && (
          <UserCart
            cart={cart}
            setCart={setCart}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "checkout" && (
          <UserCheckout
            cart={cart}
            setCart={setCart}
            setOrders={setOrders}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "orders" && (
          <UserOrders orders={orders} setSelectedOrderId={setSelectedOrderId} />
        )}

        {currentPage === "profile" && (
          <UserProfilePage onBack={() => setCurrentPage("home")} />
        )}
      </main>

      <Footer />
      <ChatbotWidget role="user" />
    </div>
  );
}
