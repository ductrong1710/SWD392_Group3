"use client";

import { useEffect, useState } from "react";
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

export default function App() {
  const [role, setRole] = useState<UserRole>("guest");
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

  // Admin layout
  if (role === "admin") {
    return (
      <AdminLayout
        role={role}
        setRole={(newRole) => {
          if (newRole === "guest") handleLogout();
          else setRole(newRole);
        }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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

  // User layout
  if (role === "user") {
    return (
      <UserLayout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setRole={(newRole) => {
          if (newRole === "guest") handleLogout();
          else setRole(newRole);
        }}
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