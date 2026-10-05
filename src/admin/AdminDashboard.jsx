import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Calendar,
  Sparkles,
  BarChart3,
  Users,
  UserCheck
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUS_COLORS } from '../utils/constants';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 rounded-2xl" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalProfitVal = stats.totalProfit ?? Math.round(stats.totalRevenue * 0.40);
  const totalCostVal = stats.totalCost ?? Math.round(stats.totalRevenue * 0.60);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: 'Gross Factory Sales',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
      badge: 'Revenue',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(totalProfitVal),
      change: 'Factory Selling Price - My Price',
      icon: Sparkles,
      color: 'bg-green-50 text-emerald-700',
      badge: 'Profit',
    },
    {
      title: 'Total Orders',
      value: (stats.totalOrders || 0).toLocaleString(),
      change: `${stats.pendingOrders || 0} orders pending packing`,
      icon: ShoppingBag,
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'Orders',
    },
    {
      title: 'Total Customers',
      value: (stats.totalCustomers || 0).toLocaleString(),
      change: `${stats.repeatCustomerRate || 0}% Repeat Customer Rate`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      badge: 'Customers',
    },
  ];

  // Safe fallback and calculation for graph bars
  const revenueOverTime = (stats?.revenueOverTime && stats.revenueOverTime.length > 0)
    ? stats.revenueOverTime
    : (stats?.revenue_over_time && stats.revenue_over_time.length > 0)
      ? stats.revenue_over_time
      : [
          { day: 'Mon', revenue: 0, orders: 0 },
          { day: 'Tue', revenue: 0, orders: 0 },
          { day: 'Wed', revenue: 0, orders: 0 },
          { day: 'Thu', revenue: 0, orders: 0 },
          { day: 'Fri', revenue: 0, orders: 0 },
          { day: 'Sat', revenue: 0, orders: 0 },
          { day: 'Sun', revenue: 0, orders: 0 }
        ];

  const rawMax = Math.max(...revenueOverTime.map((d) => Number(d.revenue || 0)));
  const maxDayRevenue = rawMax > 0 ? rawMax : 1;

  const categoryWiseSales = (stats?.categoryWiseSales && stats.categoryWiseSales.length > 0)
    ? stats.categoryWiseSales
    : (stats?.category_wise_sales && stats.category_wise_sales.length > 0)
      ? stats.category_wise_sales
      : [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">
            Operations & Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics for Sivakasi inventory, customer orders, and sales revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/inventory"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Boxes className="w-4 h-4" />
            <span>Manage Inventory (500+)</span>
          </Link>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <span className="text-2xl font-black text-slate-900 font-heading mt-1 block">
                    {card.value}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{card.change}</span>
                <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Revenue & Orders Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Orders Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-600" />
                <span>Weekly Revenue & Orders Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Daily sales performance over the past 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-md bg-red-600" /> Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-md bg-amber-400" /> Orders
              </span>
            </div>
          </div>

          {/* Interactive SVG / Bar Graph */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
            {revenueOverTime.map((item, idx) => {
              const rev = Number(item.revenue || 0);
              const heightPct = Math.min(100, Math.max(6, Math.round((rev / maxDayRevenue) * 100)));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-xs mb-1">
                    {formatCurrency(rev)}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-7 bg-red-600 hover:bg-red-500 rounded-t-lg transition-all"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span className="block text-xs font-bold text-slate-700">{item.day || item.period}</span>
                    <span className="text-[10px] text-slate-400">{item.orders || 0} ord</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category-Wise Sales Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-heading font-black text-slate-900 text-base">
              Category-Wise Sales
            </h3>
            <p className="text-xs text-slate-400 font-medium">Share of total Diwali order value</p>
          </div>

          <div className="space-y-4">
            {categoryWiseSales.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No category sales data recorded yet.</p>
            ) : (
              categoryWiseSales.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{cat.name || cat.category}</span>
                    <span className="font-bold text-slate-900">{cat.percentage || cat.share || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage || cat.share || 0}%`,
                        backgroundColor: cat.color || '#DC2626',
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block text-right font-mono">
                    {formatCurrency(cat.sales || cat.amount || 0)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-400">Latest customer bookings received</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((ord) => {
                  const statusStyle = ORDER_STATUS_COLORS[ord.status] || {
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                  };
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-800">{ord.id}</td>
                      <td className="py-3 font-medium text-slate-800">
                        {ord.customer?.name}
                        <span className="block text-[11px] text-slate-400">{ord.customer?.city}</span>
                      </td>
                      <td className="py-3 text-slate-600">{ord.items?.length || 1} items</td>
                      <td className="py-3 font-bold text-slate-900">{formatCurrency(ord.total)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/admin/orders"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 inline-block"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit & Revenue Financial Summary */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="font-heading font-black text-slate-900 text-base">
                Net Profit Overview
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Formula Active
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
            <span className="text-[10px] font-semiblod uppercase text-slate-400 block">Profit Calculation Standard</span>
            <p className="font-mono text-slate-700 font-bold">
              Profit = Factory Selling Price - My Price
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Total Factory Revenue:</span>
              <span className="font-black text-slate-900">{formatCurrency(stats.totalRevenue)}</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Total Base Cost (My Price):</span>
              <span className="font-semibold text-slate-600">{formatCurrency(totalCostVal)}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/60 flex items-center justify-between text-xs">
              <span className="font-semiblod text-emerald-900">Total Net Profit:</span>
              <span className="font-black text-emerald-700 text-base font-heading">{formatCurrency(totalProfitVal)}</span>
            </div>
          </div>

          <Link
            to="/admin/revenue"
            className="block text-center text-xs font-bold text-red-600 hover:underline pt-2"
          >
            Open Full Revenue & Profit Module →
          </Link>
        </div>
      </div>
    </div>
  );
};
