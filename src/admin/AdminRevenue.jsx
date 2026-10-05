import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  PieChart,
  BarChart2,
  Award,
  Download
} from 'lucide-react';
import { revenueService } from '../services/revenueService';
import { formatCurrency } from '../utils/formatters';

export const AdminRevenue = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('monthly');

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const data = await revenueService.getRevenueAnalytics(range);
        setRevenueData(data);
      } catch (err) {
        console.error('Failed to load revenue analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [range]);

  if (loading || !revenueData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-72 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const monthlyTrend = (revenueData?.monthlyTrend && revenueData.monthlyTrend.length > 0)
    ? revenueData.monthlyTrend
    : (revenueData?.monthly_trend && revenueData.monthly_trend.length > 0)
      ? revenueData.monthly_trend
      : [];

  const rawMax = Math.max(...monthlyTrend.map((m) => Number(m.revenue || 0)));
  const maxMonthRev = rawMax > 0 ? rawMax : 1;

  const salesByCategory = revenueData?.salesByCategory || revenueData?.sales_by_category || [];
  const topSellingProducts = revenueData?.topSellingProducts || revenueData?.top_selling_products || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">
            Revenue Analytics & Sales Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Financial metrics, AOV benchmarks, and category revenue drivers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            {revenueData.revenueGrowth}
          </span>
        </div>
      </div>

      {/* 4 Revenue & Profit Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Factory Revenue
          </span>
          <span className="text-2xl font-black text-red-600 font-heading mt-1 block">
            {formatCurrency(revenueData.totalRevenue)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-2">Sum of Factory Selling Prices</span>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs">
          <span className="text-xs font-semiblod text-emerald-800 uppercase tracking-wider block">
            Net Profit (My Price Margin)
          </span>
          <span className="text-2xl font-black text-emerald-700 font-heading mt-1 block">
            {formatCurrency(revenueData.totalProfit ?? Math.round(revenueData.totalRevenue * 0.40))}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold block mt-2">Factory Price - My Price</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Base Cost (My Price Sum)
          </span>
          <span className="text-2xl font-black text-slate-800 font-heading mt-1 block">
            {formatCurrency(revenueData.totalCost ?? Math.round(revenueData.totalRevenue * 0.60))}
          </span>
          <span className="text-[11px] text-slate-400 block mt-2">Total cost allocation</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Orders / AOV
          </span>
          <span className="text-2xl font-black text-slate-900 font-heading mt-1 block">
            {revenueData.orderCount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">({formatCurrency(revenueData.averageOrderValue)} AOV)</span>
          </span>
          <span className="text-[11px] text-slate-400 block mt-2">Direct customer bookings</span>
        </div>
      </div>

      {/* Revenue Over Time Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-red-600" />
              <span>Diwali Season Revenue Growth Trajectory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {range === 'daily' ? 'Daily' : range === 'weekly' ? 'Weekly' : 'Monthly'} gross sales volume from live customer orders
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'daily', label: 'Day-Wise' },
              { id: 'weekly', label: 'Week-Wise' },
              { id: 'monthly', label: 'Month-Wise' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  range === tab.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-3 sm:gap-8 pt-6 pb-2 px-4 border-b border-slate-100 overflow-x-auto">
          {monthlyTrend.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-12 text-center w-full">No revenue trend data recorded for this period yet.</p>
          ) : (
            monthlyTrend.map((m, idx) => {
              const rev = Number(m.revenue || 0);
              const heightPct = Math.min(100, Math.max(6, Math.round((rev / maxMonthRev) * 100)));
              return (
                <div key={idx} className="flex-1 min-w-[48px] flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded shadow-xs mb-1 whitespace-nowrap">
                    {formatCurrency(rev)}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-10 bg-gradient-to-t from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 rounded-t-xl transition-all shadow-sm"
                  />
                  <div className="text-center mt-2">
                    <span className="block text-xs font-bold text-slate-800 whitespace-nowrap">{m.period || m.month || m.day}</span>
                    <span className="text-[10px] text-slate-400">{m.orders || 0} ord</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid: Sales By Category & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Category Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-red-600" />
              <span>Sales Volume by Category</span>
            </h3>
            <p className="text-xs text-slate-400">Contribution to overall seasonal turnover</p>
          </div>

          <div className="space-y-4">
            {salesByCategory.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No category sales recorded yet.</p>
            ) : (
              salesByCategory.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{cat.category || cat.name}</span>
                    <span className="font-bold text-slate-900">{cat.share || cat.percentage || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${cat.share || cat.percentage || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Gross Sales</span>
                    <span>{formatCurrency(cat.amount || cat.sales || 0)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top-Selling Products Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Top-Selling Fireworks</span>
              </h3>
              <p className="text-xs text-slate-400">Ranked by units sold and generated revenue</p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Diwali Champions
            </span>
          </div>

          <div className="overflow-x-auto">
            {topSellingProducts.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No sales recorded yet.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-center">Units Sold</th>
                    <th className="pb-3 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topSellingProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{p.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{p.code}</span>
                      </td>
                      <td className="py-3 text-slate-600">{p.category}</td>
                      <td className="py-3 text-center font-bold text-slate-800">
                        {(p.unitsSold || p.units_sold || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-black text-red-600 font-heading">
                        {formatCurrency(p.totalRevenue || p.total_revenue || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
