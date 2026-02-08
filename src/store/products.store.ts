import { create } from 'zustand';
import { fetchProducts } from '../shared/api/products.api';
import type { Product } from '../shared/types/product';

export type SortField = 'title' | 'brand' | 'sku' | 'rating' | 'price' | '';
export type SortOrder = 'asc' | 'desc';

interface ProductsState {
  items: Product[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;

  setPage: (page: number) => void;
  setSearchQuery: (q: string) => void;
  setSort: (field: SortField, order?: SortOrder) => void;
  loadProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  items: [],
  loading: false,
  page: 1,
  limit: 20,
  total: 0,
  searchQuery: '',
  sortBy: '',
  sortOrder: 'asc',

  setPage: (page) => {
    if (get().page === page) return;
    set({ page });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),

  setSort: (sortBy, order) => {
    const prev = get();
    if (order !== undefined) {
      set({ sortBy, sortOrder: order });
    } else {
      const nextOrder: SortOrder =
        prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      set({ sortBy, sortOrder: nextOrder });
    }
    set({ page: 1 });
  },

  loadProducts: async () => {
    const { page, limit, searchQuery, sortBy, sortOrder } = get();
    set({ loading: true });

    try {
      const skip = (page - 1) * limit;
      const params: Parameters<typeof fetchProducts>[0] = { limit, skip };
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (sortBy) {
        params.sortBy = sortBy;
        params.order = sortOrder;
      }

      const { data } = await fetchProducts(params);

      set({
        items: data.products,
        total: data.total,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
