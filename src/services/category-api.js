import { fetchApi } from "./base-api";
export const categoryApi = {
    getAll: () => fetchApi("/v1/categories", { method: "GET" }),
    getById: (id) => fetchApi(`/v1/categories/${id}`, { method: "GET" }),
    create: (data) => fetchApi("/v1/categories", {
        method: "POST",
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/v1/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/v1/categories/${id}`, { method: "DELETE" }),
};
