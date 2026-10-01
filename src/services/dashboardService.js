import apiClient, { executeApi } from './api';
import { getStoredOrders, getOrInitCatalog } from '../utils/mockData';

let dashboardCache = { timestamp: 0, data: null };

export const invalidateDashboardCache = () => {
  dashboardCache = { timestamp: 0, data: null };
};

export const dashboardService = {
  getDashboardStats: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && dashboardCache.data && (now - dashboardCache.timestamp) < 30000) {
      return dashboardCache.data;
    }

    const res = await executeApi(
      () => apiClient.get('/admin/dashboard/stats'),
      () => {
        const orders = getStoredOrders();
        const activeOrders = orders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
        const products = getOrInitCatalog();

        const totalRevenue = activeOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const todayRevenue = 0;
        const totalOrders = activeOrders.length;
        const pendingOrders = activeOrders.filter(o => o.status === 'Pending').length;
        const completedOrders = activeOrders.filter(o => o.status === 'Delivered').length;

        return {
          totalProducts: products.length,
          activeProducts: products.filter(p => p.isActive !== false).length,
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue,
          todayRevenue,
          totalProfit: 0,
          totalCost: 0,
          lowStockCount: 0,
          lowStockProducts: [],
          recentOrders: activeOrders.slice(0, 5),
          revenueOverTime: [],
          categoryWiseSales: []
        };
      }
    );

    if (res) {
      dashboardCache = { timestamp: now, data: res };
    }
    return res;
  }
};
