import { fetchApi } from "./base-api";
import type { CheckoutRequest, CheckoutResponse } from "../types";

export interface VnpayVerifyResponse {
  success: boolean;
  orderId: number;
  message?: string;
}

export const checkoutApi = {
  checkout: (data: CheckoutRequest): Promise<CheckoutResponse> =>
    fetchApi("/v1/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Bước 4: Gửi params VNPAY lên backend để xác thực
  verifyVnpay: (params: Record<string, string>): Promise<VnpayVerifyResponse> =>
    fetchApi("/v1/payment/verify-vnpay", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};