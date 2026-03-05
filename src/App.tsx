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
function buildHistoryState(
  page: PageType,
  extras?: Record<string, string | null>
) {
  return { page, ...extras };
}

// Helper: build URL hash from page
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

// ===== Detect VNPAY return TRƯỚC khi render (synchronous) =====
function isVnpayReturn(): boolean {
  const params = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;
  return pathname.includes("/payment-result") || params.has("vnp_ResponseCode");
}

export default function App() {
  // Disable browser scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const initialState = parseHash(window.location.hash);

  // ===== Detect VNPAY ngay trong useState initializer =====
  const [paymentReturn] = useState<boolean>(() => isVnpayReturn());

  const [role, setRole] = useState<UserRole>(() => {
    const token = getToken();
    if (!token) {
      // Không có token → chắc chắn là guest, xóa luôn role cũ
      localStorage.removeItem("role");
      localStorage.removeItem("userRole");
      return "guest";
    }
    const saved = localStorage.getItem("role");
    return (saved as UserRole) || "guest";
  });

  // Nếu là VNPAY return → khởi tạo luôn "payment-result", không phải "home"
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (paymentReturn && getToken()) {
      return "payment-result";
    }
    return "home";
  });

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
  const [isPopState, setIsPopState] = useState(false);

  // ===== XÓA useEffect detect VNPAY cũ — đã dời lên useState =====

  // Push history state when navigation changes
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
          else if (roleStr.includes("staff"))
            userRole = "staff"; // Nhận diện staff
          else userRole = "user";
        }

        setRole(userRole);

        // ===== KHÔNG override nếu đang là payment return =====
        if (!paymentReturn) {
          if (userRole === "admin") setCurrentPage("admin-dashboard");
          else if (userRole === "staff")
            setCurrentPage("staff-dashboard"); // Chuyển trang staff
          else setCurrentPage("home");
        }
      } catch {
        removeToken();
        localStorage.removeItem("userRole");
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

      const roleStr = response.role?.toLowerCase() || "";
      let userRole: UserRole = "user";

      if (roleStr === "admin") userRole = "admin";
      else if (roleStr === "staff") userRole = "staff";

      localStorage.setItem("userRole", userRole);
      setRole(userRole);

      if (userRole === "admin") setCurrentPage("admin-dashboard");
      else if (userRole === "staff") setCurrentPage("staff-dashboard");
      else setCurrentPage("home");

      // const response = await authApi.login({ email, password });
      // setToken(response.token);

      // const userRole =
      //   response.role?.toLowerCase() === "admin" ? "admin" : "user";

      // localStorage.setItem("userRole", userRole);

      // setRole(userRole);
      // setCurrentPage(userRole === "admin" ? "admin-dashboard" : "home");
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

  // Handle logout
  const handleLogout = () => {
    console.log("[logout] token BEFORE:", localStorage.getItem("token")); // phải có token
    removeToken();
    console.log("[logout] token AFTER:", localStorage.getItem("token"));  // phải là null
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    setRole("guest");
    setCurrentPage("home");
    setCart([]);
    setOrders([]);
  };

  // ===== Payment Result Page =====
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
        role={role}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRole={setRole}
        onLogout={handleLogout}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
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
