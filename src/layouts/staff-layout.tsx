"use client";

import { useEffect } from "react";
import type {
  UserRole,
  PageType,
  ProductSummary,
  Order,
} from "../types"; // ✅ Đã xóa Review và User

// Tạm thời dùng chung Header và các component của Admin để đỡ phải code lại
import AdminTaskbar from "../pages/admin/admin-taskbar"; 
import AdminHeader from "../component/headers/admin-header";
import AdminDashboard from "../pages/admin/admin-dashboard";
import AdminProducts from "../pages/admin/admin-products";
import AdminOrders from "../pages/admin/admin-orders";
import ChatbotWidget from "../component/common/chatbot-widget";

// ✅ 1. Cắt bớt Props: Staff không có users và reviews
interface StaffLayoutProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  onLogout: () => void;
  products: ProductSummary[];
  setProducts: (products: ProductSummary[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export default function StaffLayout({
  role,
  setRole,
  currentPage,
  setCurrentPage,
  onLogout,
  products,
  setProducts,
  orders,
  setOrders,
}: StaffLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminHeader onLogout={onLogout} />
      
      {/* ⚠️ Lưu ý: Em sẽ cần tạo 1 cái StaffTaskbar riêng, 
          tạm thời anh để AdminTaskbar truyền role vào nếu nó hỗ trợ */}
      <AdminTaskbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 overflow-auto px-8 py-8">
        
        {/* ✅ 2. Sửa lại các điều kiện check PageType cho khớp với Staff */}
        
        {currentPage === "staff-dashboard" && (
          <AdminDashboard
            products={products}
            orders={orders}
            reviews={[]} // Staff không xem được review -> ném mảng rỗng
            users={[]}   // Staff không xem được user -> ném mảng rỗng
          />
        )}
        
        {currentPage === "staff-products" && (
          <AdminProducts products={products} setProducts={setProducts} />
        )}
        
        {currentPage === "staff-orders" && (
          <AdminOrders orders={orders} setOrders={setOrders} />
        )}
        
        {/* Đã xóa hoàn toàn các tab Reviews, Users, Analytics */}
        
      </main>
      
      {/* Cập nhật role cho Chatbot */}
      <ChatbotWidget role="staff" />
    </div>
  );
}