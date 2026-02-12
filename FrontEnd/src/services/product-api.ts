import type { ProductListResponse } from '../types/product';

const API_BASE_URL = 'http://localhost:8080/api';

export interface FetchProductsParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export const fetchProducts = async (params: FetchProductsParams = {}): Promise<ProductListResponse> => {
  const {
    page = 0,
    size = 12,
    sort = 'id',
    order = 'asc'
  } = params;

  const url = `${API_BASE_URL}/v1/products?page=${page}&size=${size}&sort=${sort}&sort=${order}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
};
