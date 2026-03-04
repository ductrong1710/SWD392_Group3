"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  Search,
  ShoppingCart,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import type { PageType, UserRole } from "../../types";

interface UserHeaderProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  onLogout: () => void;  // ← đổi setRole thành onLogout
  cartCount: number;
}

export default function UserHeader({
  currentPage,
  setCurrentPage,
  onLogout,  // ← nhận onLogout
  cartCount,
}: UserHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-2xl font-serif font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            STYLE.
          </button>
          <nav className="flex gap-8">
            <button
              onClick={() => setCurrentPage("home")}
              className={`text-sm font-medium transition-colors ${
                currentPage === "home"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("products")}
              className={`text-sm font-medium transition-colors ${
                currentPage === "products"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setCurrentPage("orders")}
              className={`text-sm font-medium transition-colors ${
                currentPage === "orders"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Orders
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-secondary rounded px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-32"
            />
          </div>

          <button
            onClick={() => setCurrentPage("cart")}
            className="relative p-2 hover:bg-secondary rounded transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 hover:bg-secondary rounded transition-colors"
            >
              <div className="w-6 h-6 bg-accent rounded-full"></div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium">My Account</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage("profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    console.log("=== USER LOGOUT CLICKED ===");
                    setDropdownOpen(false);
                    onLogout(); // ← gọi đúng handleLogout từ App.tsx
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}