import { fetchApi } from "./base-api";
export const authApi = {
    login: (data) => fetchApi("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    register: (data) => fetchApi("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    }),
};
