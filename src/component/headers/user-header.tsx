"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  Search,
  ShoppingCart,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
} from "lucide-react";
import type { PageType, UserRole } from "../../types";

interface UserHeaderProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setRole: Dispatch<SetStateAction<UserRole>>;
  cartCount: number;
}

export default function UserHeader({
  currentPage,
  setCurrentPage,
  setRole,
  cartCount,
}: UserHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-2xl font-serif font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            STYLE.
          </button>
          <nav className="hidden md:flex gap-8">
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

        <div className="hidden md:flex items-center gap-4">
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
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">
                    john@example.com
                  </p>
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
                    setRole("guest");
                    setDropdownOpen(false);
                    setCurrentPage("home");
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-4">
          <button
            onClick={() => {
              setCurrentPage("home");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentPage("products");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => {
              setCurrentPage("orders");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            Orders
          </button>
          <button
            onClick={() => {
              setCurrentPage("cart");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            Cart ({cartCount})
          </button>
          <div className="pt-2 border-t border-border space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-accent rounded-full"></div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentPage("profile");
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-sm text-left hover:text-accent transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button
              onClick={() => {
                setRole("guest");
                setMobileMenuOpen(false);
                setCurrentPage("home");
              }}
              className="w-full py-2 text-sm text-left text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}