"use client";

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
import type { OrderResponse } from "./services/order-api";
import type {
  UserRole,
  PageType,
  CartItem,
  Review,
  User,
  ProductSummary,
} from "./types";

function buildHistoryState(
  page: PageType,
  extras?: Record<string, string | null>
) {
  return { page, ...extras };
}

function pageToHash(
  page: PageType,
  extras?: Record<string, string | null>
): string {
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

function isVnpayReturn(): boolean {
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

  const [paymentReturn] = useState<boolean>(() => isVnpayReturn());

  const [role, setRole] = useState<UserRole>(() => {
    const token = getToken();
    if (!token) {
      localStorage.removeItem("role");
      localStorage.removeItem("userRole");
      return "guest";
    }
    const saved = localStorage.getItem("role");
    return (saved as UserRole) || "guest";
  });

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (paymentReturn && getToken()) {
      return "payment-result";
    }
    return "home";
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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

  const handlePopState = useCallback((event: PopStateEvent) => {
    setIsPopState(true);

    if (event.state?.page) {
      setCurrentPage(event.state.page as PageType);
      setSelectedCategory(event.state.selectedCategory || null);
      setSelectedProductId(event.state.selectedProductId || null);
      setSelectedOrderId(event.state.selectedOrderId || null);
    } else {
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
        let userRole: "admin" | "staff" | "user" = "user";

        if (
          savedRole === "admin" ||
          savedRole === "user" ||
          savedRole === "staff"
        ) {
          userRole = savedRole;
        } else {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const roleStr = JSON.stringify(
            payload.role ||
              payload.roles ||
              payload.authorities ||
              payload.scope ||
              ""
          ).toLowerCase();

          if (roleStr.includes("admin")) userRole = "admin";
          else if (roleStr.includes("staff")) userRole = "staff";
          else userRole = "user";
        }

        setRole(userRole);

        if (!paymentReturn) {
          if (userRole === "admin") setCurrentPage("admin-dashboard");
          else if (userRole === "staff") setCurrentPage("staff-products");
          else setCurrentPage("home");
        }
      } catch {
        removeToken();
        localStorage.removeItem("userRole");
      }
    }
  }, [paymentReturn]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [role, currentPage]);

  const handleLogin = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setToken(response.token);

    const roleStr = response.role?.toLowerCase() || "";
    let userRole: UserRole = "user";

    if (roleStr === "admin") userRole = "admin";
    else if (roleStr === "staff") userRole = "staff";

    localStorage.setItem("userRole", userRole);
    setRole(userRole);

    if (userRole === "admin") setCurrentPage("admin-dashboard");
    else if (userRole === "staff") setCurrentPage("staff-products");
    else setCurrentPage("home");
  };

  const handleRegister = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      const response = await authApi.register(data);
      setToken(response.token);

      const userRole =
        response.role?.toLowerCase() === "admin" ? "admin" : "user";
      localStorage.setItem("userRole", userRole);

      setRole(userRole);
      setCurrentPage("home");
      return true;
    } catch {
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
    return (
      <PaymentResult
        setCurrentPage={setCurrentPage}
        setCart={setCart}
        setOrders={setOrders}
        setSelectedOrderId={setSelectedOrderId}
      />
    );
  }

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage("register")}
      />
    );
  }

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
        onLogout={handleLogout}
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
        onLogout={handleLogout}
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

  if (role === "staff") {
    return (
      <StaffLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
      />
    );
  }

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
