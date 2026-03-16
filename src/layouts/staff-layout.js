"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Package, ShoppingCart, LogOut, List } from "lucide-react";
import CategoryManagement from "../pages/admin/CategoryManagement";
import AdminProducts from "../pages/admin/admin-products";
import AdminOrders from "../pages/admin/admin-orders";
import ChatbotWidget from "../component/common/chatbot-widget";
const navItems = [
    {
        page: "staff-products",
        label: "Products",
        icon: Package,
    },
    {
        page: "staff-categories",
        label: "Categories",
        icon: List,
    },
    {
        page: "staff-orders",
        label: "Orders",
        icon: ShoppingCart,
    },
];
export default function StaffLayout({ currentPage, setCurrentPage, onLogout, products, setProducts, orders, setOrders, }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);
    return (_jsxs("div", { className: "flex min-h-screen bg-secondary/50", children: [_jsxs("aside", { className: "w-64 flex-shrink-0 bg-card border-r border-border p-6 flex flex-col", children: [_jsx("h1", { className: "text-2xl font-bold text-primary mb-10", children: "Staff Panel" }), _jsx("nav", { className: "flex flex-col gap-2", children: navItems.map(({ page, label, icon: Icon }) => (_jsxs("button", { onClick: () => setCurrentPage(page), className: `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary"}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { children: label })] }, page))) }), _jsx("div", { className: "mt-auto", children: _jsxs("button", { onClick: onLogout, className: "flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary text-muted-foreground", children: [_jsx(LogOut, { className: "w-5 h-5" }), _jsx("span", { children: "Logout" })] }) })] }), _jsxs("main", { className: "flex-1 p-8 overflow-auto", children: [currentPage === "staff-products" && (_jsx(AdminProducts, { products: products, setProducts: setProducts })), currentPage === "staff-orders" && (_jsx(AdminOrders, { orders: orders, setOrders: setOrders })), currentPage === "staff-categories" && _jsx(CategoryManagement, {})] }), _jsx(ChatbotWidget, { role: "staff" })] }));
}
