"use client";

import { Search, Menu, X } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import type { PageType, UserRole } from "../types/types";

interface GuestHeaderProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
  setRole: Dispatch<SetStateAction<UserRole>>;
}

export default function GuestHeader({
  currentPage,
  setCurrentPage,
  setRole,
}: GuestHeaderProps) {
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
            onClick={() => setCurrentPage("login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Login
          </button>
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
              setCurrentPage("login");
              setMobileMenuOpen(false);
            }}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
