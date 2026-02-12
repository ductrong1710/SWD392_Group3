import type { ProductDetail } from '../types/product-detail';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchProductDetail = async (productId: number): Promise<ProductDetail> => {
  const url = `${API_BASE_URL}/v1/products/${productId}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product detail: ${response.statusText}`);
  }
  
  return response.json();
};
