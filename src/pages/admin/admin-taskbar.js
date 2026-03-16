"use client";
import { jsx as _jsx } from "react/jsx-runtime";
export default function AdminTaskbar({ currentPage, setCurrentPage, }) {
    const menuItems = [
        { id: "admin-dashboard", label: "Dashboard" },
        { id: "admin-products", label: "Products" },
        { id: "admin-orders", label: "Orders" },
        //{ id: "admin-reviews", label: "Reviews" },
        { id: "admin-users", label: "Users" },
        { id: "admin-analytics", label: "Analytics" },
        { id: "admin-categories", label: "Categories" }
    ];
    return (_jsx("nav", { className: "sticky top-0 z-40 bg-background border-b border-border", children: _jsx("div", { className: "flex items-center h-16 px-4 md:px-8", children: _jsx("div", { className: "flex items-center gap-1", children: menuItems.map((item) => (_jsx("button", { onClick: () => setCurrentPage(item.id), className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`, children: item.label }, item.id))) }) }) }));
}
