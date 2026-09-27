import apiClient, { executeApi } from './api';
import { queryMockProducts, getMockProductById } from '../utils/mockData';

export const productService = {
  // Fetch paginated products with filtering & search
  getProducts: async ({ page = 1, limit = 12, category = 'all', search = '', sortBy = 'featured', priceMin = 0, priceMax = 100000, inStockOnly = false }) => {
    const params = {
      page,
      limit,
      category,
      search,
      sort_by: sortBy,
      price_min: priceMin,
      price_max: priceMax,
    };
    if (inStockOnly) {
      params.in_stock = true;
    }
    return executeApi(
      () => apiClient.get('/products', { params }),
      () => queryMockProducts({ page, limit, category, search, sortBy, priceMin, priceMax, inStockOnly })
    );
  },

  // Fetch single product by ID
  getProductById: async (id) => {
    return executeApi(
      () => apiClient.get(`/products/${id}`),
      () => {
        const prod = getMockProductById(id);
        if (!prod) throw new Error('Product not found');
        return prod;
      }
    );
  },

  // Fetch featured / bestseller products for Home page
  getFeaturedProducts: async (limit = 8) => {
    return executeApi(
      () => apiClient.get('/products/featured', { params: { limit } }),
      () => {
        const res = queryMockProducts({ page: 1, limit, sortBy: 'featured' });
        return res.products;
      }
    );
  },

  // Fetch special festive offers / new arrivals
  getSpecialOffers: async (limit = 8) => {
    return executeApi(
      () => apiClient.get('/products/special-offers', { params: { limit } }),
      () => {
        const res = queryMockProducts({ page: 1, limit, category: 'festival-special', sortBy: 'discount' });
        return res.products;
      }
    );
  },

  // Global search autocomplete / preview (debounced)
  searchProducts: async (query) => {
    return executeApi(
      () => apiClient.get('/products/search', { params: { q: query } }),
      () => {
        const res = queryMockProducts({ page: 1, limit: 6, search: query });
        return res.products;
      }
    );
  }
};
