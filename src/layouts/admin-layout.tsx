"use client";

import { useEffect } from "react";
import type { OrderResponse } from "../services/order-api";
import type {
  UserRole,
  PageType,
  ProductSummary,
  Review,
  User,
} from "../types";
import AdminTaskbar from "../pages/admin/admin-taskbar";
import AdminHeader from "../component/headers/admin-header";
import AdminDashboard from "../pages/admin/admin-dashboard";
import AdminProducts from "../pages/admin/admin-products";
import AdminOrders from "../pages/admin/admin-orders";
import AdminReviews from "../pages/admin/admin-reviews";
import AdminUsers from "../pages/admin/admin-users";
import AdminAnalytics from "../pages/admin/admin-analytics";
import ChatbotWidget from "../component/common/chatbot-widget";
import CategoryManagement from "../pages/admin/CategoryManagement";

interface AdminLayoutProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  onLogout: () => void;
  products: ProductSummary[];
  setProducts: (products: ProductSummary[]) => void;
  orders: OrderResponse[];
  setOrders: (orders: OrderResponse[]) => void;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export default function AdminLayout({
  currentPage,
  setCurrentPage,
  onLogout,
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminHeader onLogout={onLogout} />
      <AdminTaskbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-auto px-8 py-8">
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
        {currentPage === "admin-categories" && <CategoryManagement />}
      </main>
      <ChatbotWidget role="admin" />
    </div>
  );
}
