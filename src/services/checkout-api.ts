import { fetchApi } from "./base-api";
import type { CheckoutRequest, CheckoutResponse } from "../types";

export const checkoutApi = {
  checkout: (data: CheckoutRequest): Promise<CheckoutResponse> =>
    fetchApi("/v1/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};