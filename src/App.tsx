"use client";

import { useEffect, useState, useCallback } from "react";
import LoginPage from "./pages/user/login-page";
import RegisterPage from "./pages/user/register-page";
import GuestLayout from "./layouts/guest-layout";
import UserLayout from "./layouts/user-layout";
import AdminLayout from "./layouts/admin-layout";
import { setToken, getToken, removeToken } from "./services/base-api";
import { authApi } from "./services/auth-api";
import type {
  UserRole,
  PageType,
  CartItem,
  Order,
  Review,
  User,
  ProductSummary,
} from "./types";

// Helper: build state object for history
function buildHistoryState(page: PageType, extras?: Record<string, string | null>) {
  return { page, ...extras };
}

// Helper: build URL hash from page
function pageToHash(page: PageType, extras?: Record<string, string | null>): string {
  let hash = `#/${page}`;
  if (extras?.selectedProductId) {
    hash += `/product/${extras.selectedProductId}`;
  }
  if (extras?.selectedOrderId) {
    hash += `/order/${extras.selectedOrderId}`;
  }
  if (extras?.selectedCategory) {
    hash += `?category=${extras.selectedCategory}`;
  }
  return hash;
}

// Helper: parse hash to page state
function parseHash(hash: string): {
  page: PageType;
  selectedCategory: string | null;
  selectedProductId: string | null;
  selectedOrderId: string | null;
} {
  const defaultState = {
    page: "home" as PageType,
    selectedCategory: null,
    selectedProductId: null,
    selectedOrderId: null,
  };

  if (!hash || hash === "#" || hash === "#/") return defaultState;

  const cleanHash = hash.replace("#/", "");
  const [pathPart, queryPart] = cleanHash.split("?");
  const segments = pathPart.split("/");

  const page = (segments[0] || "home") as PageType;
  let selectedProductId: string | null = null;
  let selectedOrderId: string | null = null;
  let selectedCategory: string | null = null;

  // Parse path segments: product/123 or order/456
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

  // Parse query params
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    selectedCategory = params.get("category");
  }

  return { page, selectedCategory, selectedProductId, selectedOrderId };
}

export default function App() {
  // Parse initial state from URL hash
  const initialState = parseHash(window.location.hash);

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("role");
    return (saved as UserRole) || "guest";
  });
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
// Flag to prevent pushing state when handling popstate
  const [isPopState, setIsPopState] = useState(false);

  // Push history state when navigation changes
  useEffect(() => {
    if (isPopState) {
      setIsPopState(false);
      return;
    }

    const extras = { selectedCategory, selectedProductId, selectedOrderId };
    const hash = pageToHash(currentPage, extras);
    const state = buildHistoryState(currentPage, extras);

    // Only push if hash actually changed
    if (window.location.hash !== hash) {
      window.history.pushState(state, "", hash);
    }
  }, [currentPage, selectedCategory, selectedProductId, selectedOrderId]);

  // Listen for browser back/forward
  const handlePopState = useCallback((event: PopStateEvent) => {
    setIsPopState(true);

    if (event.state?.page) {
      setCurrentPage(event.state.page as PageType);
      setSelectedCategory(event.state.selectedCategory || null);
      setSelectedProductId(event.state.selectedProductId || null);
      setSelectedOrderId(event.state.selectedOrderId || null);
    } else {
      // Fallback: parse from hash
      const parsed = parseHash(window.location.hash);
      setCurrentPage(parsed.page);
      setSelectedCategory(parsed.selectedCategory);
      setSelectedProductId(parsed.selectedProductId);
      setSelectedOrderId(parsed.selectedOrderId);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    // Set initial history state
    const extras = { selectedCategory, selectedProductId, selectedOrderId };
    const hash = pageToHash(currentPage, extras);
    const state = buildHistoryState(currentPage, extras);
    window.history.replaceState(state, "", hash);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Save role to localStorage
  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole =
          payload.role?.toLowerCase() === "admin" ? "admin" : "user";
        setRole(userRole);
        setCurrentPage(
          userRole === "admin" ? "admin-dashboard" : "home"
        );
      } catch {
        removeToken();
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [role, currentPage]);

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);
      const payload = JSON.parse(atob(response.token.split(".")[1]));
      const userRole =
        payload.role?.toLowerCase() === "admin" ? "admin" : "user";
      setRole(userRole);
      setCurrentPage(userRole === "admin" ? "admin-dashboard" : "home");
    } catch (error) {
      throw error;
    }
  };

  // Handle register
  const handleRegister = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await authApi.register(data);
      setToken(response.token);
      setRole("user");
      setCurrentPage("home");
      return true;
    } catch {
      return false;
    }
  };

  // Handle logout
  const handleLogout = () => {
    removeToken();
    setRole("guest");
    setCurrentPage("home");
    setCart([]);
    setOrders([]);
  };

  // Login page
  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage("register")}
      />
    );
  }

  // Register page
  if (currentPage === "register") {
    return (
      <RegisterPage
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );
  }

  if (role === "admin") {
    return (
      <AdminLayout
        role={role}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRole={setRole}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        reviews={reviews}
        setReviews={setReviews}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  if (role === "user") {
    return (
      <UserLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRole={setRole}
        cart={cart}
        setCart={setCart}
        orders={orders}
        setOrders={setOrders}
        products={products}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        selectedOrderId={selectedOrderId}
        setSelectedOrderId={setSelectedOrderId}
      />
    );
  }

  // Guest layout
  return (
    <GuestLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      setRole={setRole}
      products={products}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      selectedProductId={selectedProductId}
      setSelectedProductId={setSelectedProductId}
    />
  );
}