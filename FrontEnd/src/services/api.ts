const API_BASE_URL = 'http://localhost:8080/api';

// ============================================
// AUTH TOKEN MANAGEMENT
// ============================================
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// ============================================
// BASE FETCH WRAPPER
// ============================================
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  // Handle empty response
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ============================================
// AUTH API
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
}

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    fetchApi('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    fetchApi('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// PRODUCTS API
// ============================================
export interface ProductVariant {
  id: number;
  sku: string;
  color: string;
  size: string;
  priceOverride: number | null;
  stockQuantity: number;
  material: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  brandName: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
  variants: ProductVariant[];
}

export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export const productsApi = {
  getAll: (page = 0, size = 20): Promise<{ content: ProductResponse[] }> =>
    fetchApi(`/v1/products?page=${page}&size=${size}`),

  search: (params: ProductSearchParams): Promise<{ content: ProductResponse[] }> => {
    const query = new URLSearchParams();
    if (params.keyword) query.append('keyword', params.keyword);
    if (params.categoryId) query.append('categoryId', String(params.categoryId));
    if (params.brand) query.append('brand', params.brand);
    if (params.minPrice) query.append('minPrice', String(params.minPrice));
    if (params.maxPrice) query.append('maxPrice', String(params.maxPrice));
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size) query.append('size', String(params.size));
    return fetchApi(`/v1/products/search?${query.toString()}`);
  },

  getById: (id: number): Promise<ProductResponse> =>
    fetchApi(`/v1/products/${id}`),

  create: (data: ProductCreateRequest): Promise<ProductResponse> =>
    fetchApi('/v1/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ProductCreateRequest): Promise<ProductResponse> =>
    fetchApi(`/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<void> =>
    fetchApi(`/v1/products/${id}`, { method: 'DELETE' }),
};

export interface ProductCreateRequest {
  name: string;
  description: string;
  brandName: string;
  basePrice: number;
  variants: {
    sku: string;
    color: string;
    size: string;
    priceOverride?: number;
    stockQuantity: number;
    material?: string;
  }[];
}

// ============================================
// CART API
// ============================================
export interface CartItemResponse {
  orderItemId: number;
  productVariantId: number;
  productName: string;
  variantInfo: string;
  imageUrl: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface CartResponse {
  orderId: number;
  status: string;
  items: CartItemResponse[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  getCart: (): Promise<CartResponse> =>
    fetchApi('/v1/cart'),

  addItem: (data: AddToCartRequest): Promise<CartResponse> =>
    fetchApi('/v1/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (orderItemId: number, data: UpdateCartItemRequest): Promise<CartResponse> =>
    fetchApi(`/v1/cart/items/${orderItemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  removeItem: (orderItemId: number): Promise<void> =>
    fetchApi(`/v1/cart/items/${orderItemId}`, { method: 'DELETE' }),
};

// ============================================
// CHECKOUT API
// ============================================
export interface CheckoutRequest {
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
  };
  paymentMethod: 'VNPAY' | 'MOMO' | 'COD';
}

export interface CheckoutResponse {
  paymentUrl: string | null;
  orderId: number;
}

export const checkoutApi = {
  checkout: (data: CheckoutRequest): Promise<CheckoutResponse> =>
    fetchApi('/v1/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// ORDERS API
// ============================================
export interface OrderItemResponse {
  productVariantId: number;
  productName: string;
  variantInfo: string;
  imageUrl: string;
  quantity: number;
  priceAtPurchase: number;
  itemTotal: number;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  orderDate: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
  };
  items: OrderItemResponse[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
}

export const ordersApi = {
  getMyOrders: (): Promise<OrderResponse[]> =>
    fetchApi('/v1/orders/my-orders'),

  getMyOrderDetails: (orderId: number): Promise<OrderResponse> =>
    fetchApi(`/v1/orders/my-orders/${orderId}`),

  cancelOrder: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/cancel`, { method: 'POST' }),
};

// ============================================
// ADMIN ORDERS API
// ============================================
export const adminOrdersApi = {
  getAllOrders: (): Promise<OrderResponse[]> =>
    fetchApi('/v1/admin/orders'),

  getOrderById: (orderId: number): Promise<OrderResponse> =>
    fetchApi(`/v1/admin/orders/${orderId}`),

  updateStatus: (orderId: number, status: string): Promise<void> =>
    fetchApi(`/v1/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ============================================
// USER API
// ============================================
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  addresses: {
    id: number;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    isDefault: boolean;
  }[];
}

export const userApi = {
  getProfile: (): Promise<UserProfile> =>
    fetchApi('/v1/user/profile'),
};

// ============================================
// DASHBOARD API
// ============================================
export interface DashboardStats {
  totalRevenue: number;
  newOrdersCount: number;
  newUsersCount: number;
  revenueOverTime: { date: string; revenue: number }[];
  topSellingProducts: { productName: string; totalSold: number }[];
}

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    fetchApi('/dashboard/stats'),
};

// ============================================
// REVIEWS API
// ============================================
export interface ReviewRequest {
  orderItemId: number;
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export const reviewsApi = {
  create: (data: ReviewRequest): Promise<ReviewResponse> =>
    fetchApi('/v1/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByOrderItem: (orderItemId: number): Promise<ReviewResponse[]> =>
    fetchApi(`/v1/reviews/order-item/${orderItemId}`),
};

// ============================================
// CHATBOT API
// ============================================
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  botMessage: string;
}

export const chatbotApi = {
  query: (data: ChatRequest): Promise<ChatResponse> =>
    fetchApi('/v1/chatbot/query', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};