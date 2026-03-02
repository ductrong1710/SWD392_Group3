import { fetchApi } from "./base-api";
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../types";

export const cartApi = {
  getCart: (): Promise<Cart> => fetchApi("/v1/cart"),

  addItem: (data: AddToCartRequest): Promise<Cart> =>
    fetchApi("/v1/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateItem: (orderItemId: number, data: UpdateCartItemRequest): Promise<Cart> =>
    fetchApi(`/v1/cart/items/${orderItemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  removeItem: (orderItemId: number): Promise<void> =>
    fetchApi(`/v1/cart/items/${orderItemId}`, { method: "DELETE" }),
};