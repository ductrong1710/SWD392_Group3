// ============================================
// COMMON TYPES
// ============================================
export type UserRole = "guest" | "user" | "admin" | "staff";

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
  | "payment-result"

  | "admin-dashboard"
  | "admin-products"
  | "admin-orders"
  | "admin-users"
  | "admin-reviews"
  | "admin-analytics"

  | "staff-dashboard"
  | "staff-products"
  | "staff-orders";

// ============================================
// AUTH (khớp AuthResponse.java)
// ============================================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}

// ============================================
// CATEGORY (khớp CategoryDto.java)
// ============================================
export interface Category {
  id: number;
  name: string;
}

// ============================================
// PRODUCT IMAGE
// ============================================
export interface ProductImage {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
}

// ============================================
// PRODUCT VARIANT (khớp ProductVariantDto.java)
// ============================================
export interface ProductVariant {
  id: number;
  sku: string;
  color: string;
  size: string;
  material: string;
  priceOverride: number | null;
  stockQuantity: number;
}

// ============================================
// PRODUCT DETAIL (khớp ProductDetailDto.java)
// ============================================
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  brandName: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  category: Category;
  productImages: ProductImage[];
  productVariants: ProductVariant[];
}

// ============================================
// PRODUCT SUMMARY (khớp ProductSummaryDto.java)
// ============================================
export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  brandName: string;
  thumbnailUrl: string | null;
  category?: Category;
}

// ============================================
// PAGINATION
// ============================================
export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface ProductListResponse {
  content: ProductSummary[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ============================================
// CART ITEM (khớp CartItemDto.java)
// ============================================
export interface CartItem {
  productVariantId: number;
  productName: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// ============================================
// CART (khớp CartDto.java)
// ============================================
export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

// ============================================
// CART (khớp CartResponse.java)
// ============================================
export interface CartResponse {
  orderId: number;
  status: string;
  items: CartItem[];
  totalAmount: number;
}

// ============================================
// CART REQUEST
// ============================================
export interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ============================================
// ORDER ITEM (khớp OrderItemResponseDto.java)
// ============================================
export interface OrderItem {
  productVariantId: number;
  productName: string;
  imageUrl: string;
  color: string;
  size: string;
  quantity: number;
  priceAtPurchase: number;
}

// ============================================
// ORDER (khớp OrderResponseDto.java)
// ============================================
export type OrderStatus =
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "NOT_RECEIVED"
  | "CANCELLED";

export interface Order {
  orderId: number;
  status: OrderStatus;
  orderDate: string;
  shippingAddressJson: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  items: OrderItem[];
  paymentMethod: string;
}

// ============================================
// CHECKOUT (khớp CheckoutResponse.java)
// ============================================
export interface CheckoutRequest {
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
  };
  paymentMethod: "VNPAY" | "COD";
}

export interface CheckoutResponse {
  paymentUrl: string | null;
  orderId: number;
}

// ============================================
// PAYMENT (khớp PaymentResponse.java)
// ============================================
export interface PaymentResponse {
  paymentUrl: string;
}

// ============================================
// USER ADDRESS (khớp AddressResponseDto.java)
// ============================================
export interface UserAddress {
  id: number;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

// ============================================
// USER (khớp UserResponseDto.java)
// ============================================
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

// ============================================
// REVIEW (khớp ReviewResponseDto.java)
// ============================================
export interface Review {
  reviewId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRequest {
  orderItemId: number;
  rating: number;
  comment: string;
}

// ============================================
// DASHBOARD (khớp DashboardStatsDto.java)
// ============================================
export interface RevenueOverTime {
  date: string;
  revenue: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}

export interface DashboardStats {
  totalRevenue: number;
  newOrdersCount: number;
  newUsersCount: number;
  revenueOverTime: RevenueOverTime[];
  topSellingProducts: TopSellingProduct[];
}

// ============================================
// CHATBOT (khớp ChatResponse.java)
// ============================================
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatBotResponse {
  botMessage: string;
}

// ============================================
// PRODUCT CREATE/UPDATE REQUEST
// ============================================
export interface ProductCreateRequest {
  name: string;
  description: string;
  brandName: string;
  basePrice: number;
  images?: ImageRequestDto[];       // Cannot find name 'ImageRequestDto'.ts(2304)
  variants?: VariantRequestDto[];  //Cannot find name 'VariantRequestDto'.ts(2304)
}
// ============================================
// PRODUCT CREATE/UPDATE REQUEST
// ============================================

export interface ImageRequestDto {
  imageUrl: string;
  isThumbnail: boolean;
  color?: string;
}


export interface VariantRequestDto {
  sku: string;
  color: string;
  size: string;
  material?: string;
  priceOverride?: number;
  stockQuantity: number;
}