"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import UserHeader from "../component/headers/user-header";
import UserHome from "../pages/user/user-home";
import UserProducts from "../pages/user/user-products";
import UserCart from "../pages/user/user-cart";
import UserOrders from "../pages/user/user-orders";
import UserCheckout from "../pages/user/user-checkout";
import UserProfilePage from "../pages/user/user-profile";
import UserProductDetail from "../pages/user/user-product-detail";
import ChatbotWidget from "../component/common/chatbot-widget";
import Footer from "../component/common/footer";
export default function UserLayout({ currentPage, setCurrentPage, onLogout, cart, setCart, orders, setOrders, products, selectedCategory, setSelectedCategory, selectedProductId, setSelectedProductId, selectedOrderId, setSelectedOrderId, }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage, selectedCategory]);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [_jsx(UserHeader, { currentPage: currentPage, setCurrentPage: setCurrentPage, onLogout: onLogout, cartCount: cartCount }), _jsxs("main", { className: "flex-1 pt-16", children: [currentPage === "home" && (_jsx(UserHome, { setCurrentPage: setCurrentPage, setSelectedCategory: setSelectedCategory })), currentPage === "products" && (_jsx(UserProducts, { products: products, cart: cart, setCart: setCart, selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, selectedProductId: selectedProductId, setSelectedProductId: setSelectedProductId })), currentPage === "product-detail" && selectedProductId && (_jsx(UserProductDetail, { productId: Number(selectedProductId), onClose: () => setCurrentPage("products"), onAddToCart: async () => { } })), currentPage === "cart" && (_jsx(UserCart, { cart: cart, setCart: setCart, setCurrentPage: setCurrentPage })), currentPage === "checkout" && (_jsx(UserCheckout, { cart: cart, setCart: setCart, setOrders: setOrders, setCurrentPage: setCurrentPage })), currentPage === "orders" && (_jsx(UserOrders, { orders: orders, setSelectedOrderId: setSelectedOrderId })), currentPage === "profile" && (_jsx(UserProfilePage, { onBack: () => setCurrentPage("home") }))] }), _jsx(Footer, {}), _jsx(ChatbotWidget, { role: "user" })] }));
}
