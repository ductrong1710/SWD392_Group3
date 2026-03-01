import { fetchApi } from "./base-api";
import type { Review, ReviewRequest } from "../types";

export const reviewsApi = {
  create: (data: ReviewRequest): Promise<Review> =>
    fetchApi("/v1/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getByOrderItem: (orderItemId: number): Promise<Review[]> =>
    fetchApi(`/v1/reviews/order-item/${orderItemId}`),
};