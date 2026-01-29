"use client";

import { Dispatch, SetStateAction } from "react";
import type { PageType } from "../types/types";

interface AdminTaskbarProps {
  currentPage: PageType;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
}

export default function AdminTaskbar({
  currentPage,
  setCurrentPage,
}: AdminTaskbarProps) {
  const menuItems: Array<{ id: PageType; label: string }> = [
    { id: "admin-dashboard", label: "Dashboard" },
    { id: "admin-products", label: "Products" },
    { id: "admin-orders", label: "Orders" },
    { id: "admin-reviews", label: "Reviews" },
    { id: "admin-users", label: "Users" },
    { id: "admin-analytics", label: "Analytics" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center h-16 px-4 md:px-8">
        <div className="flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
