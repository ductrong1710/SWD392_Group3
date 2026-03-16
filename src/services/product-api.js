import { fetchApi } from "./base-api";
export const fetchProducts = async (params = {}) => {
    const { page = 0, size = 12, sort = "id", order = "asc" } = params;
    return fetchApi(`/v1/products?page=${page}&size=${size}&sort=${sort}&sort=${order}`);
};
export const searchProducts = async (params = {}) => {
    const { keyword = "", categoryId, brand, minPrice, maxPrice, page = 0, size = 12, sort = "name", order = "asc", } = params;
    const queryParams = new URLSearchParams();
    if (keyword)
        queryParams.append("keyword", keyword);
    if (categoryId)
        queryParams.append("categoryId", categoryId.toString());
    if (brand)
        queryParams.append("brand", brand);
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
export const fetchProductDetail = async (productId) => {
    return fetchApi(`/v1/products/id/${productId}`);
};
// ============================================
// FETCH PRODUCTS BY GENDER
// ============================================
export const fetchProductsByGender = async (gender, params = {}) => {
    const { page = 0, size = 12, sort = "id", order = "asc" } = params;
    return fetchApi(`/v1/products/gender/${gender}?page=${page}&size=${size}&sort=${sort},${order}`);
};
// ============================================
// ADMIN PRODUCT CRUD
// ============================================
export const productsApi = {
    getAll: (page = 0, size = 20) => fetchApi(`/v1/products?page=${page}&size=${size}`),
    search: (params) => searchProducts(params),
    getById: (id) => fetchProductDetail(id),
    getByGender: (gender, page = 0, size = 20) => fetchProductsByGender(gender, { page, size }),
    create: (data) => fetchApi("/v1/products", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    update: (id, data) => fetchApi(`/v1/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    delete: (id) => fetchApi(`/v1/products/${id}`, { method: "DELETE" }),
    getAllUnpaged: () => {
        return fetchApi("/v1/products/all");
    },
};
