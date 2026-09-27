import apiClient, { executeApi } from './api';
import { getStoredOrders, getOrInitCatalog } from '../utils/mockData';

export const dashboardService = {
  getDashboardStats: async () => {
    return executeApi(
      () => apiClient.get('/admin/dashboard/stats'),
      () => {
        const orders = getStoredOrders();
        const products = getOrInitCatalog();

        const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const todayRevenue = 0;
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const completedOrders = orders.filter(o => o.status === 'Delivered').length;

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
          recentOrders: orders.slice(0, 5),
          revenueOverTime: [],
          categoryWiseSales: []
        };
      }
    );
  }
};
