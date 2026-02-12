import type { ProductListResponse } from '../types/product';

const API_BASE_URL = 'http://localhost:8080/api';

export interface SearchProductsParams {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const searchProducts = async (params: SearchProductsParams = {}): Promise<ProductListResponse> => {
  const {
    keyword = '',
    categoryId,
    brand,
    minPrice,
    maxPrice,
    page = 0,
    size = 12,
    sort = 'name',
    order = 'asc'
  } = params;

  const queryParams = new URLSearchParams();
  
  if (keyword) queryParams.append('keyword', keyword);
  if (categoryId) queryParams.append('categoryId', categoryId.toString());
  if (brand) queryParams.append('brand', brand);
  if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
  if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
  
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  queryParams.append('sort', sort);
  queryParams.append('sort', order);

  const url = `${API_BASE_URL}/v1/products/search?${queryParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }
  
  return response.json();
};
