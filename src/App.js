"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import LoginPage from "./pages/user/login-page";
import RegisterPage from "./pages/user/register-page";
import GuestLayout from "./layouts/guest-layout";
import UserLayout from "./layouts/user-layout";
import AdminLayout from "./layouts/admin-layout";
import StaffLayout from "./layouts/staff-layout";
import PaymentResult from "./pages/user/payment-result";
import { setToken, getToken, removeToken } from "./services/base-api";
import { authApi } from "./services/auth-api";
function buildHistoryState(page, extras) {
    return { page, ...extras };
}
function pageToHash(page, extras) {
    let hash = `#/${page}`;
    if (extras?.selectedProductId) {
        hash += `/product/${extras.selectedProductId}`;
    }
    if (extras?.selectedOrderId) {
        hash += `/order/${extras.selectedOrderId}`;
    }
    if (extras?.selectedCategory) {
        hash += `?category=${encodeURIComponent(extras.selectedCategory)}`;
    }
    return hash;
}
function parseHash(hash) {
    const defaultState = {
        page: "home",
        selectedCategory: null,
        selectedProductId: null,
        selectedOrderId: null,
    };
    if (!hash || hash === "#" || hash === "#/")
        return defaultState;
    const cleanHash = hash.replace("#/", "");
    const [pathPart, queryPart] = cleanHash.split("?");
    const segments = pathPart.split("/");
    const page = (segments[0] || "home");
    let selectedProductId = null;
    let selectedOrderId = null;
    let selectedCategory = null;
    for (let i = 1; i < segments.length; i++) {
        if (segments[i] === "product" && segments[i + 1]) {
            selectedProductId = segments[i + 1];
            i++;
        }
        if (segments[i] === "order" && segments[i + 1]) {
            selectedOrderId = segments[i + 1];
            i++;
        }
    }
    if (queryPart) {
        const params = new URLSearchParams(queryPart);
        const cat = params.get("category");
        selectedCategory = cat ? decodeURIComponent(cat) : null;
    }
    return { page, selectedCategory, selectedProductId, selectedOrderId };
}
function isVnpayReturn() {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    return pathname.includes("/payment-result") || params.has("vnp_ResponseCode");
}
export default function App() {
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);
    const [paymentReturn] = useState(() => isVnpayReturn());
    const [role, setRole] = useState(() => {
        const token = getToken();
        if (!token) {
            localStorage.removeItem("role");
            localStorage.removeItem("userRole");
            return "guest";
        }
        const saved = localStorage.getItem("role");
        return saved || "guest";
    });
    const [currentPage, setCurrentPage] = useState(() => {
        if (paymentReturn && getToken()) {
            return "payment-result";
        }
        return "home";
    });
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isPopState, setIsPopState] = useState(false);
    useEffect(() => {
        if (isPopState) {
            setIsPopState(false);
            return;
        }
        const extras = { selectedCategory, selectedProductId, selectedOrderId };
        const hash = pageToHash(currentPage, extras);
        const state = buildHistoryState(currentPage, extras);
        if (window.location.hash !== hash) {
            window.history.pushState(state, "", hash);
        }
    }, [currentPage, selectedCategory, selectedProductId, selectedOrderId, isPopState]);
    const handlePopState = useCallback((event) => {
        setIsPopState(true);
        if (event.state?.page) {
            setCurrentPage(event.state.page);
            setSelectedCategory(event.state.selectedCategory || null);
            setSelectedProductId(event.state.selectedProductId || null);
            setSelectedOrderId(event.state.selectedOrderId || null);
        }
        else {
            const parsed = parseHash(window.location.hash);
            setCurrentPage(parsed.page);
            setSelectedCategory(parsed.selectedCategory);
            setSelectedProductId(parsed.selectedProductId);
            setSelectedOrderId(parsed.selectedOrderId);
        }
    }, []);
    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        const extras = { selectedCategory, selectedProductId, selectedOrderId };
        const hash = pageToHash(currentPage, extras);
        const state = buildHistoryState(currentPage, extras);
        window.history.replaceState(state, "", hash);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [currentPage, selectedCategory, selectedProductId, selectedOrderId, handlePopState]);
    useEffect(() => {
        localStorage.setItem("role", role);
    }, [role]);
    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const savedRole = localStorage.getItem("userRole");
                let userRole = "user";
                if (savedRole === "admin" ||
                    savedRole === "user" ||
                    savedRole === "staff") {
                    userRole = savedRole;
                }
                else {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const roleStr = JSON.stringify(payload.role ||
                        payload.roles ||
                        payload.authorities ||
                        payload.scope ||
                        "").toLowerCase();
                    if (roleStr.includes("admin"))
                        userRole = "admin";
                    else if (roleStr.includes("staff"))
                        userRole = "staff";
                    else
                        userRole = "user";
                }
                setRole(userRole);
                if (!paymentReturn) {
                    if (userRole === "admin")
                        setCurrentPage("admin-dashboard");
                    else if (userRole === "staff")
                        setCurrentPage("staff-products");
                    else
                        setCurrentPage("home");
                }
            }
            catch {
                removeToken();
                localStorage.removeItem("userRole");
            }
        }
    }, [paymentReturn]);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [role, currentPage]);
    const handleLogin = async (email, password) => {
        const response = await authApi.login({ email, password });
        setToken(response.token);
        const roleStr = response.role?.toLowerCase() || "";
        let userRole = "user";
        if (roleStr === "admin")
            userRole = "admin";
        else if (roleStr === "staff")
            userRole = "staff";
        localStorage.setItem("userRole", userRole);
        setRole(userRole);
        if (userRole === "admin")
            setCurrentPage("admin-dashboard");
        else if (userRole === "staff")
            setCurrentPage("staff-products");
        else
            setCurrentPage("home");
    };
    const handleRegister = async (data) => {
        try {
            const response = await authApi.register(data);
            setToken(response.token);
            const userRole = response.role?.toLowerCase() === "admin" ? "admin" : "user";
            localStorage.setItem("userRole", userRole);
            setRole(userRole);
            setCurrentPage("home");
            return true;
        }
        catch {
            return false;
        }
    };
    const handleLogout = () => {
        removeToken();
        localStorage.removeItem("userRole");
        localStorage.removeItem("role");
        setRole("guest");
        setCurrentPage("home");
        setCart([]);
        setOrders([]);
    };
    if (currentPage === "payment-result") {
        return (_jsx(PaymentResult, { setCurrentPage: setCurrentPage, setCart: setCart, setOrders: setOrders, setSelectedOrderId: setSelectedOrderId }));
    }
    if (currentPage === "login") {
        return (_jsx(LoginPage, { onLogin: handleLogin, onSwitchToRegister: () => setCurrentPage("register") }));
    }
    if (currentPage === "register") {
        return (_jsx(RegisterPage, { onRegister: handleRegister, onSwitchToLogin: () => setCurrentPage("login") }));
    }
    if (role === "admin") {
        return (_jsx(AdminLayout, { role: role, currentPage: currentPage, setCurrentPage: setCurrentPage, setRole: setRole, onLogout: handleLogout, products: products, setProducts: setProducts, orders: orders, setOrders: setOrders, reviews: reviews, setReviews: setReviews, users: users, setUsers: setUsers }));
    }
    if (role === "user") {
        return (_jsx(UserLayout, { currentPage: currentPage, setCurrentPage: setCurrentPage, setRole: setRole, onLogout: handleLogout, cart: cart, setCart: setCart, orders: orders, setOrders: setOrders, products: products, selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, selectedProductId: selectedProductId, setSelectedProductId: setSelectedProductId, selectedOrderId: selectedOrderId, setSelectedOrderId: setSelectedOrderId }));
    }
    if (role === "staff") {
        return (_jsx(StaffLayout, { currentPage: currentPage, setCurrentPage: setCurrentPage, onLogout: handleLogout, products: products, setProducts: setProducts, orders: orders, setOrders: setOrders }));
    }
    return (_jsx(GuestLayout, { currentPage: currentPage, setCurrentPage: setCurrentPage, setRole: setRole, products: products, selectedCategory: selectedCategory, setSelectedCategory: setSelectedCategory, selectedProductId: selectedProductId, setSelectedProductId: setSelectedProductId }));
}
