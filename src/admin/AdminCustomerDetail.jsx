import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  ExternalLink,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { customerService } from '../services/customerService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUS_COLORS } from '../utils/constants';

export const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomerDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await customerService.getCustomerById(id);
      setData(res);
    } catch (err) {
      console.error('Failed to load customer profile details', err);
      setError('Customer record not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCustomerDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Fetching Customer Account Profile...</p>
      </div>
    );
  }

  if (error || !data || !data.customer) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-heading text-slate-900">Customer Profile Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not locate the requested customer record.'}</p>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers List</span>
        </Link>
      </div>
    );
  }

  const { customer, summary, orders } = data;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/customers')}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Customers"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-red-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {customer.customer_code}
              </span>
              {customer.guest_id && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded" title={`Guest ID: ${customer.guest_id}`}>
                  Guest Identity
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              {customer.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Customer ID #{customer.id}</span>
        </div>
      </div>

      {/* Grid: Customer Information Card + Order Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Information Card (Left Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-red-600" />
              <span>Customer Information</span>
            </h3>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Customer Code</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{customer.customer_code}</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Full Name</span>
              <span className="font-bold text-slate-900 text-sm">{customer.name}</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Mobile Phone</span>
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${customer.phone}`} className="hover:text-red-600 transition-colors">
                  {customer.phone}
                </a>
              </div>
            </div>

            {customer.email && (
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Email Address</span>
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${customer.email}`} className="hover:text-red-600 transition-colors">
                    {customer.email}
                  </a>
                </div>
              </div>
            )}

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Delivery Address</span>
              <div className="flex items-start gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed font-normal">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">{customer.address || 'Address not stored'}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {[customer.city, customer.state, customer.pincode].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {customer.guest_id && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Browser Guest UUID</span>
                <span className="font-mono text-[11px] text-slate-600 select-all block truncate mt-0.5 bg-slate-100 p-2 rounded">
                  {customer.guest_id}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary & Stats (Right Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Summary Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Financial Order Summary</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Orders</span>
                <p className="text-xl font-black font-heading text-slate-900 mt-1">
                  {summary.total_orders || 0}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Spent</span>
                <p className="text-xl font-black font-heading text-red-600 mt-1">
                  {formatCurrency(summary.total_spent || 0)}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Order Value</span>
                <p className="text-xl font-black font-heading text-slate-900 mt-1">
                  {formatCurrency(summary.average_order_value || 0)}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">First Order Date</span>
                <p className="text-xs font-bold text-slate-800 mt-1.5">
                  {summary.first_order_date ? formatDate(summary.first_order_date) : 'N/A'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Last Order Date</span>
                <p className="text-xs font-bold text-slate-800 mt-1.5">
                  {summary.last_order_date ? formatDate(summary.last_order_date) : 'N/A'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Profile Created</span>
                <p className="text-xs font-bold text-slate-800 mt-1.5">
                  {customer.created_at ? formatDate(customer.created_at) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Order History List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-red-600" />
                <span>Order History ({orders.length})</span>
              </h3>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No orders linked to this customer profile yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const statusStyle = ORDER_STATUS_COLORS[order.order_status] || {
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                    border: 'border-slate-200'
                  };
                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-red-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            #{order.order_number}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            {order.order_status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>{formatDate(order.created_at)}</span>
                          <span>•</span>
                          <span>{order.item_count} items</span>
                          <span>•</span>
                          <span>{order.payment_method}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Amount</span>
                          <span className="text-base font-black text-slate-900 font-heading">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                        <Link
                          to="/admin/orders"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0"
                        >
                          View Order
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
