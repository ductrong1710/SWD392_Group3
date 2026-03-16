import { fetchApi } from "./base-api";
export const orderApi = {
    getMyOrders: () => fetchApi("/v1/orders/my-orders"),
    getMyOrderDetails: (orderId) => fetchApi(`/v1/orders/my-orders/${orderId}`),
    cancelOrder: (orderId) => fetchApi(`/v1/orders/${orderId}/cancel`, { method: "POST" }),
    confirmReceived: (orderId) => fetchApi(`/v1/orders/${orderId}/tracking`, {
        method: "PATCH",
        body: JSON.stringify({ tracking: "COMPLETED" }),
    }),
    reportNotReceived: (orderId) => fetchApi(`/v1/orders/${orderId}/tracking`, {
        method: "PATCH",
        body: JSON.stringify({ tracking: "NOT_RECEIVED" }),
    }),
    updateTracking: (orderId, tracking) => fetchApi(`/v1/orders/${orderId}/tracking`, {
        method: "PATCH",
        body: JSON.stringify({ tracking }),
    }),
    getAllOrders: () => fetchApi("/v1/admin/orders"),
};
export const ordersApi = orderApi;
export const adminOrdersApi = orderApi;
