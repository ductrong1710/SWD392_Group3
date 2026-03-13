import { fetchApi } from "./base-api";
import type { Category, CategoryRequest } from "../types";

export const categoryApi = {
  getAll: () => 
    fetchApi<Category[]>("/v1/categories", { method: "GET" }),

  getById: (id: number) => 
    fetchApi<Category>(`/v1/categories/${id}`, { method: "GET" }),

  create: (data: CategoryRequest) => 
    fetchApi<Category>("/v1/categories", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),

  update: (id: number, data: CategoryRequest) => 
    fetchApi<Category>(`/v1/categories/${id}`, { 
      method: "PUT", 
      body: JSON.stringify(data) 
    }),

  delete: (id: number) => 
    fetchApi<void>(`/v1/categories/${id}`, { method: "DELETE" }),
};