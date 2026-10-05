import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserCheck,
  UserPlus,
  TrendingUp,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  RefreshCw,
  Clock
} from 'lucide-react';
import { customerService } from '../services/customerService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Pagination } from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customersData, setCustomersData] = useState({
    customers: [],
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 1
  });
  const [metrics, setMetrics] = useState({
    total_customers: 0,
    new_customers: 0,
    returning_customers: 0,
    repeat_customer_rate: 0.0,
    avg_orders_per_customer: 0.0,
    avg_customer_spend: 0.0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 350);

  const loadData = async () => {
    setLoading(true);
    try {
      const [res, met] = await Promise.all([
        customerService.getCustomers({
          search: debouncedSearch,
          page,
          limit
        }),
        customerService.getCustomerMetrics()
      ]);
      setCustomersData(res || { customers: [], total: 0, page: 1, limit: 20, total_pages: 1 });
      setMetrics(met || {});
    } catch (err) {
      console.error('Failed to load admin customers data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Customer Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Guest & Repeat Customers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seamlessly track customer profiles and repeat orders without mandatory login.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Admin Dashboard Customer Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            {metrics.total_customers || customersData.total || 0}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Unique Guest Identities</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Returning Customers</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-heading text-emerald-600">
            {metrics.returning_customers || 0}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Multiple Orders Placed</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Repeat Rate</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-heading text-rose-600">
            {metrics.repeat_customer_rate || 0}%
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Repeat Purchase Ratio</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Customer Spend</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            {formatCurrency(metrics.avg_customer_spend || 0)}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Average Lifetime Value</p>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search code (CUS-000128), name, phone, email, city..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-900">{customersData.customers.length}</span> of{' '}
          <span className="font-bold text-red-600">{customersData.total}</span> customers
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading Customer Profiles...</p>
          </div>
        ) : customersData.customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Customers Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No customer records matched your search query. New customer profiles are automatically generated upon order placement.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Customer Code</th>
                  <th className="py-3.5 px-4">Name & Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Total Spent</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {customersData.customers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => navigate(`/admin/customers/${customer.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600 whitespace-nowrap">
                      {customer.customer_code}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {customer.name}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {customer.phone}
                        </span>
                        {customer.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{customer.city || 'N/A'}</span>
                        {customer.state && <span className="text-slate-400">({customer.state})</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black ${customer.total_orders > 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                        {customer.total_orders} {customer.total_orders === 1 ? 'Order' : 'Orders'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(customer.total_spent)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {customer.last_order_at ? formatDate(customer.last_order_at) : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-normal">
                      {customer.created_at ? formatDate(customer.created_at) : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/customers/${customer.id}`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-red-600 group-hover:text-white text-slate-600 transition-colors"
                        title="View Profile Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={customersData.total_pages || 1}
        totalItems={customersData.total || 0}
        itemsPerPage={limit}
        onPageChange={(newPage) => setPage(newPage)}
        onItemsPerPageChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};
