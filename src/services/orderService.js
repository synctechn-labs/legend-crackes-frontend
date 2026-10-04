import apiClient, { executeApi } from './api';
import { getStoredOrders, saveNewOrder, updateOrderStatusInMock } from '../utils/mockData';
import { generateOrderId } from '../utils/formatters';

export const orderService = {
  // Public route: create order without authentication
  createOrder: async (orderPayload) => {
    const formattedOrder = {
      id: generateOrderId(),
      ...orderPayload,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    return executeApi(
      () => apiClient.post('/orders', formattedOrder),
      () => {
        saveNewOrder(formattedOrder);
        return formattedOrder;
      }
    );
  },

  // Admin route: get all orders with search and status filters
  getOrders: async ({ search = '', status = 'all', page = 1, limit = 10 } = {}) => {
    return executeApi(
      () => apiClient.get('/admin/orders', { params: { search, status, page, limit } }),
      () => {
        let orders = getStoredOrders();
        
        if (status && status !== 'all') {
          orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
        }

        if (search) {
          const q = search.toLowerCase();
          orders = orders.filter(o => 
            o.id.toLowerCase().includes(q) ||
            o.customer?.phone?.includes(q) ||
            o.customer?.name?.toLowerCase().includes(q)
          );
        }

        const total = orders.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const paginated = orders.slice(startIndex, startIndex + limit);

        return {
          orders: paginated,
          total,
          page,
          totalPages
        };
      }
    );
  },

  // Admin route: get single order details
  getOrderById: async (orderId) => {
    return executeApi(
      () => apiClient.get(`/admin/orders/${orderId}`),
      () => {
        const orders = getStoredOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');
        return order;
      }
    );
  },

  // Admin route: update order status
  updateOrderStatus: async (orderId, newStatus) => {
    return executeApi(
      () => apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus }),
      () => {
        const updated = updateOrderStatusInMock(orderId, newStatus);
        if (!updated) throw new Error('Failed to update order');
        return updated;
      }
    );
  },

  // Admin route: update extra discount percentage or flat amount
  updateExtraDiscount: async (orderId, discountPayload) => {
    const payload = typeof discountPayload === 'object'
      ? discountPayload
      : { extra_discount_percentage: Number(discountPayload) };

    return executeApi(
      () => apiClient.patch(`/admin/orders/${orderId}/extra-discount`, payload),
      () => {
        const orders = getStoredOrders();
        const idx = orders.findIndex(o => String(o.id) === String(orderId));
        if (idx !== -1) {
          if (payload.extra_discount_amount !== undefined) {
            orders[idx].extraDiscountAmount = Number(payload.extra_discount_amount);
          } else {
            orders[idx].extraDiscountPercentage = Number(payload.extra_discount_percentage);
          }
          localStorage.setItem('sivakasi_crackers_orders_v1', JSON.stringify(orders));
          return orders[idx];
        }
        return { success: true };
      }
    );
  },

  // Admin route: delete order permanently
  deleteOrder: async (orderId) => {
    return executeApi(
      () => apiClient.delete(`/admin/orders/${orderId}`),
      () => {
        const orders = getStoredOrders();
        const filtered = orders.filter(o => String(o.id) !== String(orderId));
        localStorage.setItem('sivakasi_crackers_orders_v1', JSON.stringify(filtered));
        return { success: true, message: `Order #${orderId} deleted` };
      }
    );
  }
};
