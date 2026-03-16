import { fetchApi } from "./base-api";
export const cartApi = {
    getCart: () => fetchApi("/v1/cart"),
    addItem: (data) => fetchApi("/v1/cart/items", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    updateItem: (orderItemId, data) => fetchApi(`/v1/cart/items/${orderItemId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    removeItem: (orderItemId) => fetchApi(`/v1/cart/items/${orderItemId}`, { method: "DELETE" }),
};
