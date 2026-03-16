"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
export default function GuestHeader({ currentPage, setCurrentPage, setRole, }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (_jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-6", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsx("button", { onClick: () => setCurrentPage("home"), className: "text-2xl font-serif font-bold tracking-tight hover:opacity-80 transition-opacity", children: "STYLE." }), _jsxs("nav", { className: "hidden md:flex gap-8", children: [_jsx("button", { onClick: () => setCurrentPage("home"), className: `text-sm font-medium transition-colors ${currentPage === "home"
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"}`, children: "Home" }), _jsx("button", { onClick: () => setCurrentPage("products"), className: `text-sm font-medium transition-colors ${currentPage === "products"
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"}`, children: "Products" })] })] }), _jsxs("div", { className: "hidden md:flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center bg-secondary rounded px-3 py-2 gap-2", children: [_jsx(Search, { className: "w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Search...", className: "bg-transparent outline-none text-sm w-32" })] }), _jsx("button", { onClick: () => setCurrentPage("login"), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm", children: "Login" })] }), _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "md:hidden", children: mobileMenuOpen ? (_jsx(X, { className: "w-5 h-5" })) : (_jsx(Menu, { className: "w-5 h-5" })) })] }), mobileMenuOpen && (_jsxs("div", { className: "md:hidden border-t border-border bg-background p-4 space-y-4", children: [_jsx("button", { onClick: () => {
                            setCurrentPage("home");
                            setMobileMenuOpen(false);
                        }, className: "block w-full text-left py-2 text-sm font-medium hover:text-accent transition-colors", children: "Home" }), _jsx("button", { onClick: () => {
                            setCurrentPage("products");
                            setMobileMenuOpen(false);
                        }, className: "block w-full text-left py-2 text-sm font-medium hover:text-accent transition-colors", children: "Products" }), _jsx("button", { onClick: () => {
                            setCurrentPage("login");
                            setMobileMenuOpen(false);
                        }, className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm", children: "Login" })] }))] }));
}
