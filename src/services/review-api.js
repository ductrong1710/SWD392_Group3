import { fetchApi } from "./base-api";
export const reviewsApi = {
    create: (data) => fetchApi("/v1/reviews", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getByOrderItem: (orderItemId) => fetchApi(`/v1/reviews/order-item/${orderItemId}`),
};
