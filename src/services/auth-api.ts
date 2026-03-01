import { fetchApi } from "./base-api";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    fetchApi("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    fetchApi("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};