import { fetchApi } from "./base-api";
export const checkoutApi = {
    checkout: (data) => fetchApi("/v1/checkout", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    // Bước 4: Gửi params VNPAY lên backend để xác thực
    verifyVnpay: (params) => fetchApi("/v1/payment/verify-vnpay", {
        method: "POST",
        body: JSON.stringify(params),
    }),
};
