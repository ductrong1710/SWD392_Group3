"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import GuestHeader from "../component/headers/guest-header";
import GuestHome from "../pages/guest/guest-home";
import GuestProducts from "../pages/guest/guest-products";
import ChatbotWidget from "../component/common/chatbot-widget";
import Footer from "../component/common/footer";
import LoginModal from "../component/common/login-modal";
export default function GuestLayout({ currentPage, setCurrentPage, setRole, products, selectedCategory, setSelectedCategory, selectedProductId, setSelectedProductId, }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const handleCheckout = () => {
        setShowLoginModal(true);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [_jsx(GuestHeader, { currentPage: currentPage, setCurrentPage: setCurrentPage, setRole: setRole }), _jsxs("main", { className: "flex-1 pt-16", children: [currentPage === "home" && (_jsx(GuestHome, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory })), currentPage === "products" && (_jsx(GuestProducts, { products: products, selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, selectedProductId: selectedProductId, setSelectedProductId: setSelectedProductId, onCheckout: handleCheckout })), currentPage === "product-detail" && selectedProductId && (_jsx("div", { children: "Product detail would go here" }))] }), _jsx(Footer, {}), _jsx(ChatbotWidget, { role: "guest" }), showLoginModal && (_jsx(LoginModal, { onClose: () => setShowLoginModal(false), onLogin: () => {
                    setRole("user");
                    setShowLoginModal(false);
                    setCurrentPage("login");
                } }))] }));
}
