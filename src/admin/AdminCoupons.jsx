import React, { useState, useEffect } from 'react';
import {
  Tag,
  Percent,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  RefreshCw,
  X,
  Eye,
  ArrowRight,
  UserCheck,
  MapPin,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { couponService } from '../services/couponService';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);

  // Edit / Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // View Orders Modal State
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponOrders, setCouponOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: 5.0,
    description: '',
    min_order_amount: 0.0,
    max_discount_amount: '',
    is_active: true
  });

  const { addToast } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed loading coupons:', err);
      addToast({
        title: 'Error Loading Coupons',
        message: 'Unable to fetch coupon records.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    addToast({
      title: 'Code Copied!',
      message: `Coupon '${code}' copied to clipboard.`,
      type: 'success'
    });
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_percentage: 5.0,
      description: 'Festive Discount Coupon',
      min_order_amount: 0.0,
      max_discount_amount: '',
      is_active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code || '',
      discount_percentage: c.discount_percentage ?? c.discountPercentage ?? 5.0,
      description: c.description || '',
      min_order_amount: c.min_order_amount ?? c.minOrderAmount ?? 0.0,
      max_discount_amount: c.max_discount_amount ?? c.maxDiscountAmount ?? '',
      is_active: c.is_active ?? c.isActive ?? true
    });
    setShowModal(true);
  };

  const handleViewOrders = async (coupon) => {
    setSelectedCoupon(coupon);
    setShowOrdersModal(true);
    setLoadingOrders(true);
    try {
      const orders = await couponService.getCouponOrders(coupon.id);
      setCouponOrders(Array.isArray(orders) ? orders : []);
    } catch (err) {
      console.error('Failed loading coupon orders:', err);
      setCouponOrders([]);
      addToast({
        title: 'Error Loading Orders',
        message: `Failed to load orders for coupon ${coupon.code}.`,
        type: 'error'
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      addToast({ title: 'Validation Error', message: 'Coupon code is required.', type: 'error' });
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discount_percentage: parseFloat(formData.discount_percentage) || 5.0,
      description: formData.description.trim(),
      min_order_amount: parseFloat(formData.min_order_amount) || 0.0,
      max_discount_amount: formData.max_discount_amount !== '' ? parseFloat(formData.max_discount_amount) : null,
      is_active: formData.is_active
    };

    setSubmitting(true);
    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, payload);
        addToast({ title: 'Coupon Updated', message: `Coupon '${payload.code}' updated successfully.`, type: 'success' });
      } else {
        await couponService.createCoupon(payload);
        addToast({ title: 'Coupon Created', message: `New coupon '${payload.code}' created successfully.`, type: 'success' });
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      console.error('Coupon save error:', err);
      addToast({
        title: 'Save Failed',
        message: err.response?.data?.message || err.message || 'Failed to save coupon.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await couponService.toggleCoupon(coupon.id);
      addToast({
        title: 'Status Updated',
        message: `Coupon '${coupon.code}' is now ${!coupon.is_active && !coupon.isActive ? 'Active' : 'Inactive'}.`,
        type: 'success'
      });
      fetchCoupons();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon '${coupon.code}'?`)) return;
    try {
      await couponService.deleteCoupon(coupon.id);
      addToast({ title: 'Coupon Deleted', message: `Coupon '${coupon.code}' removed.`, type: 'success' });
      fetchCoupons();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((c) => {
    const codeStr = (c.code || '').toLowerCase();
    const descStr = (c.description || '').toLowerCase();
    const matchesSearch = codeStr.includes(searchQuery.toLowerCase()) || descStr.includes(searchQuery.toLowerCase());

    const activeState = c.is_active ?? c.isActive ?? true;
    if (filterActive === 'active') return matchesSearch && activeState;
    if (filterActive === 'inactive') return matchesSearch && !activeState;
    return matchesSearch;
  });

  // Calculate Metrics
  const totalCoupons = coupons.length;
  const activeCount = coupons.filter((c) => c.is_active ?? c.isActive).length;
  const totalUsage = coupons.reduce((acc, c) => acc + (c.usage_count ?? c.usageCount ?? 0), 0);
  const avgDiscount = totalCoupons > 0
    ? Math.round(coupons.reduce((acc, c) => acc + (c.discount_percentage ?? c.discountPercentage ?? 5), 0) / totalCoupons)
    : 5;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-red-600" />
            <span>Discount Coupon Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create percentage reduction coupons (e.g. 5% off) and track which customer orders were placed using each coupon.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Coupons</span>
            <span className="text-2xl font-black text-slate-900 font-heading mt-0.5 block">{totalCoupons}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Active Coupons</span>
            <span className="text-2xl font-black text-emerald-700 font-heading mt-0.5 block">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Reduction</span>
            <span className="text-2xl font-black text-amber-600 font-heading mt-0.5 block">{avgDiscount}% Off</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Times Used</span>
            <span className="text-2xl font-black text-slate-900 font-heading mt-0.5 block">{totalUsage}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500">Filter:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'inactive', label: 'Inactive' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterActive(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterActive === tab.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchCoupons}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Fetching coupon records from database...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Coupon Codes Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first percentage reduction coupon (e.g. 5% off) by clicking "+ Create New Coupon".
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount %</th>
                  <th className="py-3.5 px-4">Min Cart Order</th>
                  <th className="py-3.5 px-4">Usage & Orders</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.map((c) => {
                  const pct = c.discount_percentage ?? c.discountPercentage ?? 5.0;
                  const minAmt = c.min_order_amount ?? c.minOrderAmount ?? 0.0;
                  const active = c.is_active ?? c.isActive ?? true;
                  const usage = c.usage_count ?? c.usageCount ?? 0;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-xl uppercase tracking-wider">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                            title="Copy Code"
                          >
                            {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {c.description && <p className="text-[11px] text-slate-400 mt-1 max-w-xs">{c.description}</p>}
                      </td>

                      {/* Discount % */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs">
                          <Percent className="w-3 h-3 text-amber-500" />
                          {pct}% OFF
                        </span>
                      </td>

                      {/* Min Order */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-700">
                        {minAmt > 0 ? formatCurrency(minAmt) : <span className="text-slate-400 italic">No Minimum</span>}
                      </td>

                      {/* Usage Count & Orders Button */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewOrders(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-xs shadow-2xs transition-all"
                          title="View Orders Placed Under This Coupon"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{usage} orders</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                            active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewOrders(c)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                            title="View Orders Placed with Coupon"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Create / Edit Coupon */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mb-3">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black font-heading text-slate-900">
                {editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set coupon code and percentage reduction (e.g. 5% off total order).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI5, FESTIVE10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              {/* Discount Percentage & Min Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reduction Discount % *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      required
                      placeholder="5"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                      className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">e.g. 5 = 5% off total amount</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Min Order Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">0 = No minimum required</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Offer Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Festive 5% reduction on all Sivakasi crackers"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active_cb"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <label htmlFor="is_active_cb" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Activate this coupon code immediately for customers
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: View Orders Placed Under Selected Coupon */}
      {showOrdersModal && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowOrdersModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-heading text-slate-900 flex items-center gap-2">
                    <span>Orders Placed Under Coupon</span>
                    <span className="font-mono font-black text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-0.5 rounded-xl uppercase">
                      {selectedCoupon.code}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedCoupon.discount_percentage ?? selectedCoupon.discountPercentage}% discount offer ({selectedCoupon.description || 'Festive Offer'})
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Banner inside Modal */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
                <span className="text-lg font-black text-slate-900 font-heading">{couponOrders.length}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount Granted</span>
                <span className="text-lg font-black text-emerald-700 font-heading">
                  {formatCurrency(couponOrders.reduce((acc, o) => acc + (o.discount || 0), 0))}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Sales</span>
                <span className="text-lg font-black text-slate-900 font-heading">
                  {formatCurrency(couponOrders.reduce((acc, o) => acc + (o.total || o.total_amount || 0), 0))}
                </span>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
              {loadingOrders ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Querying customer orders for {selectedCoupon.code}...</p>
                </div>
              ) : couponOrders.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No Orders Found</p>
                  <p className="text-[11px] text-slate-400">
                    No customer orders have been placed using coupon code '{selectedCoupon.code}' yet.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Discount Saved</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {couponOrders.map((ord) => {
                      const custName = ord.customer_name || ord.customer?.name || 'Customer';
                      const custPhone = ord.customer_phone || ord.customer?.phone || 'N/A';
                      const city = ord.city || ord.customer?.city || 'N/A';
                      const status = ord.order_status || ord.status || 'Pending';
                      const discountVal = ord.discount || 0;
                      const totalVal = ord.total || ord.total_amount || 0;

                      return (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          {/* Order ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            #{ord.order_number || ord.orderNumber || ord.id}
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-800 block">{custName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{custPhone}</span>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {city}
                            </span>
                          </td>

                          {/* Discount Saved */}
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                            - {formatCurrency(discountVal)}
                          </td>

                          {/* Total Amount */}
                          <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                            {formatCurrency(totalVal)}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <Link
                to="/admin/orders"
                onClick={() => setShowOrdersModal(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Go to All Orders Management</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setShowOrdersModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
