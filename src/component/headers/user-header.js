"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, ShoppingCart, LogOut, ChevronDown, User, } from "lucide-react";
export default function UserHeader({ currentPage, setCurrentPage, onLogout, // ← nhận onLogout
cartCount, }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (_jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsx("button", { onClick: () => setCurrentPage("home"), className: "text-2xl font-serif font-bold tracking-tight hover:opacity-80 transition-opacity", children: "STYLE." }), _jsxs("nav", { className: "flex gap-8", children: [_jsx("button", { onClick: () => setCurrentPage("home"), className: `text-sm font-medium transition-colors ${currentPage === "home"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"}`, children: "Home" }), _jsx("button", { onClick: () => setCurrentPage("products"), className: `text-sm font-medium transition-colors ${currentPage === "products"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"}`, children: "Products" }), _jsx("button", { onClick: () => setCurrentPage("orders"), className: `text-sm font-medium transition-colors ${currentPage === "orders"
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"}`, children: "Orders" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center bg-secondary rounded px-3 py-2 gap-2", children: [_jsx(Search, { className: "w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Search...", className: "bg-transparent outline-none text-sm w-32" })] }), _jsxs("button", { onClick: () => setCurrentPage("cart"), className: "relative p-2 hover:bg-secondary rounded transition-colors", children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), cartCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold", children: cartCount }))] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setDropdownOpen(!dropdownOpen), className: "flex items-center gap-2 p-2 hover:bg-secondary rounded transition-colors", children: [_jsx("div", { className: "w-6 h-6 bg-accent rounded-full" }), _jsx(ChevronDown, { className: "w-4 h-4" })] }), dropdownOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50", children: [_jsx("div", { className: "p-3 border-b border-border", children: _jsx("p", { className: "text-sm font-medium", children: "My Account" }) }), _jsxs("button", { onClick: () => {
                                                setCurrentPage("profile");
                                                setDropdownOpen(false);
                                            }, className: "w-full px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors", children: [_jsx(User, { className: "w-4 h-4" }), "My Profile"] }), _jsxs("button", { onClick: () => {
                                                console.log("=== USER LOGOUT CLICKED ===");
                                                setDropdownOpen(false);
                                                onLogout(); // ← gọi đúng handleLogout từ App.tsx
                                            }, className: "w-full px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors text-destructive", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Logout"] })] }))] })] })] }) }));
}
