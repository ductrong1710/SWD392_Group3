import { fetchApi } from "./base-api";
import type {
  ProductDetail,
  ProductListResponse,
  ProductCreateRequest,
} from "../types";

// ============================================
// FETCH PRODUCTS (LIST)
// ============================================
export interface FetchProductsParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ProductListResponse> => {
  const { page = 0, size = 12, sort = "id", order = "asc" } = params;
  return fetchApi(
    `/v1/products?page=${page}&size=${size}&sort=${sort}&sort=${order}`
  );
};

// ============================================
// SEARCH PRODUCTS
// ============================================
export interface SearchProductsParams {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export const searchProducts = async (
  params: SearchProductsParams = {}
): Promise<ProductListResponse> => {
  const {
    keyword = "",
    categoryId,
    brand,
    minPrice,
    maxPrice,
    page = 0,
    size = 12,
    sort = "name",
    order = "asc",
  } = params;

  const queryParams = new URLSearchParams();

  if (keyword) queryParams.append("keyword", keyword);
  if (categoryId) queryParams.append("categoryId", categoryId.toString());
  if (brand) queryParams.append("brand", brand);
  if (minPrice !== undefined)
    queryParams.append("minPrice", minPrice.toString());
  if (maxPrice !== undefined)
    queryParams.append("maxPrice", maxPrice.toString());

  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());
  queryParams.append("sort", sort);
  queryParams.append("sort", order);

  return fetchApi(`/v1/products/search?${queryParams.toString()}`);
};

// ============================================
// FETCH PRODUCT DETAIL
// ============================================
export const fetchProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
return fetchApi(`/v1/products/id/${productId}`);};

// ============================================
// FETCH PRODUCTS BY GENDER
// ============================================
export const fetchProductsByGender = async (
  gender: "men" | "women",
  params: { page?: number; size?: number; sort?: string; order?: "asc" | "desc" } = {}
): Promise<ProductListResponse> => {
  const { page = 0, size = 12, sort = "id", order = "asc" } = params;
  return fetchApi(
    `/v1/products/gender/${gender}?page=${page}&size=${size}&sort=${sort},${order}`
  );
};

// ============================================
// ADMIN PRODUCT CRUD
// ============================================
export const productsApi = {
  getAll: (page = 0, size = 20): Promise<ProductListResponse> =>
    fetchApi(`/v1/products?page=${page}&size=${size}`),

  search: (params: SearchProductsParams): Promise<ProductListResponse> =>
    searchProducts(params),

  getById: (id: number): Promise<ProductDetail> => fetchProductDetail(id),

  getByGender: (
    gender: "men" | "women",
    page = 0,
    size = 20
  ): Promise<ProductListResponse> => fetchProductsByGender(gender, { page, size }),

  create: (data: ProductCreateRequest): Promise<ProductDetail> =>
    fetchApi("/v1/products", {
      method: "POST",
      
      body: JSON.stringify(data),
    }),
    

  update: (id: number, data: ProductCreateRequest): Promise<ProductDetail> =>
    fetchApi(`/v1/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<void> =>
    fetchApi(`/v1/products/${id}`, { method: "DELETE" }),

  getAllUnpaged: (): Promise<ProductDetail[]> => {
    return fetchApi("/v1/products/all");
  },
};

