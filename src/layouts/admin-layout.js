"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import AdminTaskbar from "../pages/admin/admin-taskbar";
import AdminHeader from "../component/headers/admin-header";
import AdminDashboard from "../pages/admin/admin-dashboard";
import AdminProducts from "../pages/admin/admin-products";
import AdminOrders from "../pages/admin/admin-orders";
import AdminReviews from "../pages/admin/admin-reviews";
import AdminUsers from "../pages/admin/admin-users";
import AdminAnalytics from "../pages/admin/admin-analytics";
import ChatbotWidget from "../component/common/chatbot-widget";
import CategoryManagement from "../pages/admin/CategoryManagement";
export default function AdminLayout({ currentPage, setCurrentPage, onLogout, products, setProducts, orders, setOrders, reviews, setReviews, users, setUsers, }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [_jsx(AdminHeader, { onLogout: onLogout }), _jsx(AdminTaskbar, { currentPage: currentPage, setCurrentPage: setCurrentPage }), _jsxs("main", { className: "flex-1 overflow-auto px-8 py-8", children: [currentPage === "admin-dashboard" && (_jsx(AdminDashboard, { products: products, orders: orders, reviews: reviews, users: users })), currentPage === "admin-products" && (_jsx(AdminProducts, { products: products, setProducts: setProducts })), currentPage === "admin-orders" && (_jsx(AdminOrders, { orders: orders, setOrders: setOrders })), currentPage === "admin-reviews" && (_jsx(AdminReviews, { reviews: reviews, setReviews: setReviews })), currentPage === "admin-users" && (_jsx(AdminUsers, { users: users, setUsers: setUsers })), currentPage === "admin-analytics" && (_jsx(AdminAnalytics, { products: products, orders: orders })), currentPage === "admin-categories" && _jsx(CategoryManagement, {})] }), _jsx(ChatbotWidget, { role: "admin" })] }));
}
