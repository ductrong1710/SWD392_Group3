"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import type {
  CartItem,
  Order,
  Product,
  PageType,
  UserRole,
} from "../../types/types";
import UserHeader from "../../header/user-header";
import UserHome from "../../user/user-home";
import UserProducts from "../../user/user-products";
import UserCart from "../../user/user-cart";
import UserOrders from "../../user/user-orders";
import UserCheckout from "../../user/user-checkout";
import ChatbotWidget from "../../chatbot/chatbot-widget";
import Footer from "../../component/footer";

interface UserLayoutProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setRole: Dispatch<SetStateAction<UserRole>>;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  products: Product[];
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
  setRole,
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserHeader
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRole={setRole}
        cartCount={cart.length}
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
      </main>
      <Footer />
      <ChatbotWidget role="user" />
    </div>
  );
}
