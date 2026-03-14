import { fetchApi } from "./base-api";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
}

export interface OrderItemResponse {
  productVariantId: number;
  productName: string;
  variantInfo: string;
  imageUrl: string | null;
  quantity: number;
  priceAtPurchase: number;
  itemTotal: number;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  tracking: string;
  orderDate: string;
  shippingAddress: ShippingAddress | null;
  items: OrderItemResponse[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string | null;
}

export const orderApi = {
  getMyOrders: (): Promise<OrderResponse[]> =>
    fetchApi("/v1/orders/my-orders"),

  getMyOrderDetails: (orderId: number): Promise<OrderResponse> =>
    fetchApi(`/v1/orders/my-orders/${orderId}`),

  cancelOrder: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/cancel`, { method: "POST" }),

  confirmReceived: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ tracking: "COMPLETED" }),
    }),

  reportNotReceived: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ tracking: "NOT_RECEIVED" }),
    }),

  updateTracking: (orderId: number, tracking: string): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/tracking`, {
      method: "PATCH",
      body: JSON.stringify({ tracking }),
    }),

  getAllOrders: (): Promise<OrderResponse[]> =>
    fetchApi("/v1/admin/orders"),
};

export const ordersApi = orderApi;
export const adminOrdersApi = orderApi;
