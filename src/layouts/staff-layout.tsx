"use client";

import { useEffect } from "react";
import CategoryManagement from "../pages/admin/CategoryManagement";
import { Package, ShoppingCart, LogOut, List } from "lucide-react";

import type {
  UserRole,
  PageType,
  ProductSummary,
  Order,
} from "../types";

// Staff có chức năng CRUD sản phẩm và đơn hàng, nên ta có thể dùng lại component của admin.
import AdminProducts from "../pages/admin/admin-products";
import AdminOrders from "../pages/admin/admin-orders";
import ChatbotWidget from "../component/common/chatbot-widget";

// Props được đơn giản hóa vì staff chỉ quản lý sản phẩm và đơn hàng.
interface StaffLayoutProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  onLogout: () => void;
  products: ProductSummary[];
  setProducts: (products: ProductSummary[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

const navItems = [
  {
    page: "staff-products" as PageType,
    label: "Products",
    icon: Package,
  },
  { 
    page: "staff-categories" as PageType, 
    label: "Categories", 
    icon: List 
  },
  { page: "staff-orders" as PageType, label: "Orders", icon: ShoppingCart },
];

export default function StaffLayout({
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
    <div className="flex min-h-screen bg-secondary/50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-card border-r border-border p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-primary mb-10">Staff Panel</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Staff có thể quản lý sản phẩm và đơn hàng, nên ta dùng lại component của admin */}
        {currentPage === "staff-products" && <AdminProducts products={products} setProducts={setProducts} />}
        {currentPage === "staff-orders" && <AdminOrders orders={orders} setOrders={setOrders} />}
        {currentPage === "staff-categories" && <CategoryManagement />}
      </main>

      <ChatbotWidget role="staff" />
    </div>
  );
}