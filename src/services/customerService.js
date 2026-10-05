import apiClient, { executeApi } from './api';

export const customerService = {
  // Admin route: Get paginated list of customers
  getCustomers: async ({ search = '', phone = '', page = 1, limit = 20, sort_by = 'recent' } = {}) => {
    return executeApi(
      () => apiClient.get('/admin/customers', { params: { search, phone, page, limit, sort_by } }),
      () => ({
        customers: [],
        total: 0,
        page: 1,
        limit: 20,
        total_pages: 1
      })
    );
  },

  // Admin route: Get single customer detail and summary
  getCustomerById: async (id) => {
    return executeApi(
      () => apiClient.get(`/admin/customers/${id}`),
      () => ({
        customer: null,
        summary: {},
        orders: []
      })
    );
  },

  // Admin route: Get customer order history
  getCustomerOrders: async (id) => {
    return executeApi(
      () => apiClient.get(`/admin/customers/${id}/orders`),
      () => ({
        customer_id: id,
        orders: [],
        total: 0
      })
    );
  },

  // Admin route: Get aggregated customer analytics metrics
  getCustomerMetrics: async () => {
    return executeApi(
      () => apiClient.get('/admin/customers/metrics'),
      () => ({
        total_customers: 0,
        new_customers: 0,
        returning_customers: 0,
        repeat_customer_rate: 0.0,
        avg_orders_per_customer: 0.0,
        avg_customer_spend: 0.0
      })
    );
  }
};
