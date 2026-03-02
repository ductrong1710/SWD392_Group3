"use client";

import{ useEffect, Dispatch, SetStateAction } from "react";
import type { PageType, UserRole } from "../types";
import StaffProducts from "../pages/staff/staff-products";
import { Package, LogOut } from "lucide-react";

interface StaffLayoutProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setRole: Dispatch<SetStateAction<UserRole>>;
}

export default function StaffLayout({
  currentPage,
  setCurrentPage,
  setRole,
}: StaffLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleLogout = () => {
    setRole("guest");
    setCurrentPage("home");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Staff Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === "staff-products" && <StaffProducts />}
      </main>
    </div>
  );
}
