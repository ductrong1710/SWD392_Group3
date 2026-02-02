// ============================================
// TYPE DEFINITIONS - Single Source of Truth
// ============================================

export type UserRole = "guest" | "user" | "admin";

export type PageType =
  | "home"
  | "products"
  | "product-detail"
  | "cart"
  | "checkout"
  | "orders"
  | "order-detail"
  | "profile"
  | "login"
  | "register"
  | "admin-dashboard"
  | "admin-products"
  | "admin-orders"
  | "admin-reviews"
  | "admin-users"
  | "admin-analytics";

// Frontend display types (có thể khác với API response)
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: Record<string, Record<string, number>>;
  description: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  orderItemId?: number; // For API integration
  productVariantId?: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "pending" | "shipping" | "completed" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  userId: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  flagged: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  blocked: boolean;
}

// API Response types (re-export from services/api.ts)
export type {
  ProductResponse,
  ProductVariant,
  CartResponse,
  CartItemResponse,
  OrderResponse,
  OrderItemResponse,
  UserProfile,
  DashboardStats,
} from "../services/api";