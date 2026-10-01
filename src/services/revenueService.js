import apiClient, { executeApi } from './api';
import { getStoredOrders } from '../utils/mockData';

const revenueCache = {};

export const revenueService = {
  getRevenueAnalytics: async (timeRange = 'monthly', forceRefresh = false) => {
    const now = Date.now();
    const entry = revenueCache[timeRange];
    if (!forceRefresh && entry && (now - entry.timestamp) < 30000) {
      return entry.data;
    }

    const res = await executeApi(
      () => apiClient.get('/admin/revenue', { params: { range: timeRange } }),
      () => {
        const orders = getStoredOrders();
        const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const orderCount = orders.length;
        const averageOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

        return {
          totalRevenue,
          totalProfit: 0,
          totalCost: 0,
          dailyRevenue: 0,
          weeklyRevenue: 0,
          monthlyRevenue: totalRevenue,
          orderCount,
          averageOrderValue,
          revenueGrowth: 'Live Metrics',
          monthlyTrend: [],
          salesByCategory: [],
          topSellingProducts: []
        };
      }
    );

    if (res) {
      revenueCache[timeRange] = { timestamp: now, data: res };
    }
    return res;
  }
};
