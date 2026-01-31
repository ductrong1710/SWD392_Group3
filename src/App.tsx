"use client";

import { useEffect, useState } from "react";
import LoginPage from "./pages/user/login-page";           
import GuestLayout from "./layouts/guest-layout";           
import UserLayout from "./layouts/user-layout";            
import AdminLayout from "./layouts/admin-layout";           
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_REVIEWS, MOCK_USERS } from "./data/mockData";
import type { UserRole, PageType, Product, CartItem, Order, Review, User } from "./types";

export default function App() {
  const [role, setRole] = useState<UserRole>("guest");
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [role]);

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={(email: string, role: UserRole) => {
          setRole(role);
          setCurrentPage(role === "admin" ? "admin-dashboard" : "home");
        }}
      />
    );
  }

  if (role === "admin") {
    return (
      <AdminLayout
        role={role}
        setRole={setRole}
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