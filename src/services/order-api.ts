import { fetchApi } from "./base-api";
import type { Order } from "../types";

export const ordersApi = {
  getMyOrders: (): Promise<Order[]> => fetchApi("/v1/orders/my-orders"),

  getMyOrderDetails: (orderId: number): Promise<Order> =>
    fetchApi(`/v1/orders/my-orders/${orderId}`),

  cancelOrder: (orderId: number): Promise<void> =>
    fetchApi(`/v1/orders/${orderId}/cancel`, { method: "POST" }),
};

// ============================================
// ADMIN ORDERS API
// ============================================
export const adminOrdersApi = {
  getAllOrders: (): Promise<Order[]> => fetchApi("/v1/admin/orders"),

  getOrderById: (orderId: number): Promise<Order> =>
    fetchApi(`/v1/admin/orders/${orderId}`),

  updateStatus: (orderId: number, status: string): Promise<void> =>
    fetchApi(`/v1/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};