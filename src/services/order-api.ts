import { fetchApi } from "./base-api";

export interface OrderResponseDto {
  orderId: number;
  status: string;      // payment: AWAITING_PAYMENT, COMPLETED, CANCELLED
  tracking: string;    // shipping: PREPARING, SHIPPING, DELIVERED, COMPLETED, NOT_RECEIVED
  orderDate: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
  } | null;
  items: OrderItemDto[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string | null;
}

export interface OrderItemDto {
  productVariantId: number;
  productName: string;
  variantInfo: string;
  imageUrl: string | null;
  quantity: number;
  priceAtPurchase: number;
  itemTotal: number;
}

export const orderApi = {
  // ── USER ──────────────────────────────────────────
  getMyOrders: (): Promise<OrderResponseDto[]> =>
    fetchApi("/v1/orders/my-orders"),

  getMyOrderDetails: (orderId: number): Promise<OrderResponseDto> =>
    fetchApi(`/v1/orders/my-orders/${orderId}`),

  cancelOrder: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/cancel`, { method: "POST" }),

  // Customer xác nhận đã nhận → PATCH /tracking { tracking: "COMPLETED" }
  confirmReceived: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ tracking: "COMPLETED" }),
    }),

  // Customer báo chưa nhận → PATCH /tracking { tracking: "NOT_RECEIVED" }
  reportNotReceived: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ tracking: "NOT_RECEIVED" }),
    }),

  // ── STAFF / ADMIN ──────────────────────────────────
  // Staff cập nhật tracking: PREPARING → SHIPPING → DELIVERED
  updateTracking: (orderId: number, tracking: string): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ tracking }),
    }),

  // Admin lấy tất cả orders
  getAllOrders: (): Promise<OrderResponseDto[]> =>
    fetchApi("/v1/admin/orders"),
};

// Aliases
export const ordersApi = orderApi;
export const adminOrdersApi = orderApi;