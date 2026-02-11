"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import type { PageType, UserRole } from "../types";
import AdminTaskbar from "../pages/admin/admin-taskbar";       
import AdminHeader from "../component/headers/admin-header";
import AdminDashboard from "../pages/admin/admin-dashboard";   
import AdminProducts from "../pages/admin/admin-products";     
import AdminOrders from "../pages/admin/admin-orders";         
import AdminReviews from "../pages/admin/admin-reviews";       
import AdminUsers from "../pages/admin/admin-users";           
import AdminAnalytics from "../pages/admin/admin-analytics";   
import ChatbotWidget from "../component/common/chatbot-widget";


interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: Record<string, Record<string, number>>;
  description: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "pending" | "shipping" | "completed" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  userId: string;
}

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  flagged: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  blocked: boolean;
}

interface AdminLayoutProps {
  role: string;
  setRole: Dispatch<SetStateAction<UserRole>>;
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export default function AdminLayout({
  role,
  setRole,
  currentPage,
  setCurrentPage,
  products,
  setProducts,
  orders,
  setOrders,
  reviews,
  setReviews,
  users,
  setUsers,
}: AdminLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminHeader
        setRole={setRole}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <AdminTaskbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-auto px-4 md:px-8 py-8">
        {currentPage === "admin-dashboard" && (
          <AdminDashboard
            products={products}
            orders={orders}
            reviews={reviews}
            users={users}
          />
        )}
        {currentPage === "admin-products" && (
          <AdminProducts products={products} setProducts={setProducts} />
        )}
        {currentPage === "admin-orders" && (
          <AdminOrders orders={orders} setOrders={setOrders} />
        )}
        {currentPage === "admin-reviews" && (
          <AdminReviews reviews={reviews} setReviews={setReviews} />
        )}
        {currentPage === "admin-users" && (
          <AdminUsers users={users} setUsers={setUsers} />
        )}
        {currentPage === "admin-analytics" && (
          <AdminAnalytics products={products} orders={orders} />
        )}
      </main>
      <ChatbotWidget role="admin" />
    </div>
  );
}
