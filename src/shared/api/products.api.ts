import { api } from './axios';
import type { ProductsResponse } from '../types/product';

export interface FetchProductsParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  q?: string;
}

export const fetchProducts = (params: FetchProductsParams) => {
  const { q, ...rest } = params;
  if (q?.trim()) {
    return api.get<ProductsResponse>('/products/search', {
      params: { q: q.trim(), ...rest },
    });
  }
  return api.get<ProductsResponse>('/products', { params: rest });
};
