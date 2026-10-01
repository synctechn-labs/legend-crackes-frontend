import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Phone,
  MapPin,
  Calendar,
  X,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  Printer,
  Tag,
  Percent,
  Check,
  Download
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { invalidateDashboardCache } from '../services/dashboardService';
import { invalidateRevenueCache } from '../services/revenueService';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUSES, ORDER_STATUS_COLORS } from '../utils/constants';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';

export const AdminOrders = () => {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeOrder, setActiveOrder] = useState(null); // for details modal
  const [extraDiscountInput, setExtraDiscountInput] = useState('');
  const [updatingDiscount, setUpdatingDiscount] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders({
        search: searchQuery,
        status: selectedStatus,
        limit: 50
      });
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    if (activeOrder) {
      const currentPct = activeOrder.extraDiscountPercentage ?? activeOrder.extra_discount_percentage ?? 0;
      setExtraDiscountInput(currentPct > 0 ? String(currentPct) : '');
    }
  }, [activeOrder]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      invalidateDashboardCache();
      invalidateRevenueCache();
      addToast({
        title: 'Status Updated',
        message: `Order #${orderId} marked as ${newStatus}.`,
        type: 'success'
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      addToast({
        title: 'Update Failed',
        message: err.message || 'Could not update order status.',
        type: 'error'
      });
    }
  };

  const handleApplyExtraDiscount = async () => {
    if (!activeOrder) return;
    setUpdatingDiscount(true);
    try {
      const pct = parseFloat(extraDiscountInput) || 0;
      const updatedOrder = await orderService.updateExtraDiscount(activeOrder.id, pct);
      
      const orderSubtotal = Number(updatedOrder.total || updatedOrder.subtotal || 0);
      const extraDiscAmt = Number(updatedOrder.extraDiscountAmount ?? updatedOrder.extra_discount_amount ?? 0);
      const finalVal = updatedOrder.finalTotal ?? updatedOrder.final_total_amount ?? (orderSubtotal - extraDiscAmt);

      addToast({
        title: 'Extra Discount Applied',
        message: `Applied ${pct}% extra discount from profit (-${formatCurrency(extraDiscAmt)}). Final Payable: ${formatCurrency(finalVal)}.`,
        type: 'success'
      });

      const fullUpdated = {
        ...activeOrder,
        ...updatedOrder,
        extraDiscountPercentage: pct,
        extraDiscountAmount: extraDiscAmt,
        finalTotal: finalVal
      };

      setActiveOrder(fullUpdated);
      setOrders((prev) => prev.map((o) => (String(o.id) === String(activeOrder.id) ? fullUpdated : o)));
    } catch (err) {
      addToast({
        title: 'Discount Update Failed',
        message: err.message || 'Could not update extra discount.',
        type: 'error'
      });
    } finally {
      setUpdatingDiscount(false);
    }
  };

  const handlePrintInvoice = (ord) => {
    if (!ord) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = (ord.items || []).map((it, idx) => {
      const itemName = it.name || it.product_name_snapshot || it.productName || `Cracker Item #${idx + 1}`;
      const itemCode = it.code || it.product_code || '';
      const unitPrice = Number(it.price || it.unit_price || 0);
      const qty = Number(it.quantity || 1);
      const lineTotal = Number(it.total || it.total_price || (unitPrice * qty));
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <strong style="color: #0f172a;">${itemName}</strong>
            ${itemCode ? `<br/><span style="color: #64748b; font-size: 11px; font-family: monospace;">Code: ${itemCode}</span>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${unitPrice.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">₹${lineTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');

    const subtotal = Number(ord.subtotal || ord.total || 0);
    const extraDiscPct = Number(ord.extraDiscountPercentage ?? ord.extra_discount_percentage ?? 0);
    const extraDiscAmt = Number(ord.extraDiscountAmount ?? ord.extra_discount_amount ?? 0);
    const finalTotal = Number(ord.finalTotal ?? ord.final_total_amount ?? (subtotal - extraDiscAmt));

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice #${ord.id || ord.order_number}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 30px; margin: 0; background: #fff; }
            .invoice-box { max-w-700px; margin: auto; border: 1px solid #cbd5e1; padding: 25px; border-radius: 16px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #dc2626; padding-bottom: 15px; margin-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 900; color: #dc2626; font-family: sans-serif; }
            .inv-no { font-size: 14px; font-weight: 700; color: #475569; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 12px; }
            .info-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #f1f5f9; padding: 10px; text-align: left; text-transform: uppercase; font-size: 11px; color: #475569; letter-spacing: 0.5px; }
            .total-section { width: 320px; margin-left: auto; margin-top: 20px; font-size: 13px; }
            .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
            .grand-total { border-top: 2px solid #e2e8f0; padding-top: 8px; margin-top: 6px; font-size: 18px; font-weight: 900; color: #dc2626; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <div class="brand">SIVAKASI FESTIVE CRACKERS</div>
                <div style="font-size: 11px; color: #64748b;">Direct Sivakasi Factory Wholesale Booking</div>
              </div>
              <div style="text-align: right;">
                <div class="inv-no">INVOICE #${ord.id || ord.order_number}</div>
                <div style="font-size: 11px; color: #64748b;">${formatDate(ord.createdAt)}</div>
              </div>
            </div>

            <div class="grid">
              <div class="info-card">
                <strong style="color: #0f172a; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Customer Details</strong><br/>
                <div style="font-weight: 700; font-size: 14px; margin-top: 4px; color: #0f172a;">${ord.customer?.name || 'Customer'}</div>
                <div style="color: #475569; margin-top: 2px;">Phone: +91 ${ord.customer?.phone || 'N/A'}</div>
                ${ord.customer?.email ? `<div style="color: #64748b;">Email: ${ord.customer.email}</div>` : ''}
              </div>

              <div class="info-card">
                <strong style="color: #0f172a; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">Delivery Coordinates</strong><br/>
                <div style="color: #334155; margin-top: 4px;">${ord.customer?.address || ''}</div>
                <div style="font-weight: 700; color: #0f172a;">${ord.customer?.city || ''}, ${ord.customer?.state || ''} - ${ord.customer?.pincode || ''}</div>
                <div style="color: #059669; font-weight: 600; font-size: 11px; margin-top: 4px;">Status: ${ord.status || 'Confirmed'}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>Order Subtotal:</span>
                <span style="font-weight: 700;">₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              ${extraDiscPct > 0 ? `
                <div class="total-row" style="color: #059669; font-weight: 600;">
                  <span>Extra Discount:</span>
                  <span>- ₹${extraDiscAmt.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
              <div class="total-row grand-total">
                <span>Total Payable:</span>
                <span>₹${finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div class="footer">
              Thank you for ordering authentic Sivakasi Crackers. Legal non-hazardous transport guaranteed.
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Helper calculations for activeOrder inspection modal
  const orderSubtotal = Number(activeOrder?.total || activeOrder?.subtotal || 0);
  const extraDiscPct = Number(activeOrder?.extraDiscountPercentage ?? activeOrder?.extra_discount_percentage ?? 0);
  
  const orderProfitBeforeExtra = activeOrder?.items?.reduce((acc, item) => {
    const sellP = Number(item.price || item.unit_price || 0);
    const myP = Number(item.myPrice || item.my_price || sellP * 0.5);
    return acc + (sellP - myP) * (item.quantity || 1);
  }, 0) || (orderSubtotal * 0.2);

  const extraDiscAmt = Number(activeOrder?.extraDiscountAmount ?? activeOrder?.extra_discount_amount ?? (orderProfitBeforeExtra * (extraDiscPct / 100)));
  const finalTotalPayable = orderSubtotal - extraDiscAmt;
  const netProfitAfterExtra = orderProfitBeforeExtra - extraDiscAmt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">
            Customer Orders Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch queue, customer contact details, profit control, and order invoices.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs w-fit flex items-center gap-1.5 text-xs font-bold"
          title="Refresh Orders"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status & Update</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
              ) : orders.length > 0 ? (
                orders.map((ord) => {
                  const style = ORDER_STATUS_COLORS[ord.status] || {
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                  };
                  const displayTotal = ord.finalTotal || ord.final_total_amount || ord.total;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID and Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{ord.id}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {formatDate(ord.createdAt)}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{ord.customer?.name}</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {ord.customer?.phone}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                            {ord.customer?.city}, {ord.customer?.state}
                          </span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {ord.items?.length || 1} Varieties
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block max-w-xs">
                          {ord.items?.map((it) => `${it.quantity}x ${it.name || it.product_name_snapshot || 'Item'}`).join(', ')}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-red-600 font-heading text-sm block">
                          {formatCurrency(displayTotal)}
                        </span>
                        {ord.extraDiscountAmount > 0 && (
                          <span className="text-[10px] text-emerald-600 font-semibold block">
                            (-{formatCurrency(ord.extraDiscountAmount)} Extra Disc)
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block">{ord.paymentMethod}</span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 ${style.bg} ${style.text}`}
                        >
                          {Object.values(ORDER_STATUSES).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions: Inspect + Print Invoice */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePrintInvoice(ord)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                            title="Print / Download Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveOrder(ord)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No orders matching search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">Order Inspection</span>
                <h3 className="font-heading font-black text-xl text-slate-900 mt-0.5">
                  #{activeOrder.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(activeOrder)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Invoice</span>
                </button>
                <button
                  onClick={() => setActiveOrder(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Customer</span>
                <p className="font-bold text-sm text-slate-900">{activeOrder.customer?.name}</p>
                <p className="text-slate-600">Phone: +91 {activeOrder.customer?.phone}</p>
                {activeOrder.customer?.email && (
                  <p className="text-slate-600">Email: {activeOrder.customer.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Delivery Coordinates</span>
                <p className="text-slate-700">{activeOrder.customer?.address}</p>
                <p className="font-medium text-slate-900">
                  {activeOrder.customer?.city}, {activeOrder.customer?.state} - {activeOrder.customer?.pincode}
                </p>
                {activeOrder.customer?.deliveryNotes && (
                  <p className="text-slate-500 italic mt-1">Note: {activeOrder.customer.deliveryNotes}</p>
                )}
              </div>
            </div>

            {/* Order Items Table (Name, Qty, Price, Total) */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Order Items ({activeOrder.items?.length || 0})</span>
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeOrder.items?.map((item, idx) => {
                      const itemName = item.name || item.product_name_snapshot || item.productName || item.product?.name || `Cracker Item #${idx + 1}`;
                      const itemCode = item.code || item.product_code;
                      const unitPrice = Number(item.price || item.unit_price || 0);
                      const itemTotal = Number(item.total || item.total_price || (unitPrice * item.quantity));

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{itemName}</span>
                            {itemCode && <span className="font-mono text-[10px] text-slate-400 block">{itemCode}</span>}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.quantity}×</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">{formatCurrency(unitPrice)}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">{formatCurrency(itemTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admin Extra Discount (Deducted from Profit) Module */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase text-[11px]">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Extra Discount
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  Est. Order Profit: <strong>{formatCurrency(orderProfitBeforeExtra)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={extraDiscountInput}
                    onChange={(e) => setExtraDiscountInput(e.target.value)}
                    placeholder="Enter discount % e.g. 5"
                    className="w-full pl-3 pr-8 py-2 text-xs font-bold bg-white border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="button"
                  onClick={handleApplyExtraDiscount}
                  disabled={updatingDiscount}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 shrink-0 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{updatingDiscount ? 'Saving...' : 'Apply Extra Discount'}</span>
                </button>
              </div>

              {extraDiscPct > 0 && (
                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Subtotal</span>
                    <span className="font-bold text-slate-800">{formatCurrency(orderSubtotal)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block">Discount ({extraDiscPct}%)</span>
                    <span className="font-bold text-emerald-700">- {formatCurrency(extraDiscAmt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Final Total</span>
                    <span className="font-black text-red-600">{formatCurrency(finalTotalPayable)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Adjusted Profit</span>
                    <span className="font-bold text-emerald-800">{formatCurrency(netProfitAfterExtra)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cost Breakdown & Status Selector */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Fulfillment Status:</span>
                <select
                  value={activeOrder.status}
                  onChange={(e) => handleStatusChange(activeOrder.id, e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  {Object.values(ORDER_STATUSES).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Payable</span>
                <span className="text-2xl font-black text-red-600 font-heading">
                  {formatCurrency(finalTotalPayable)}
                </span>
                {extraDiscAmt > 0 && (
                  <span className="text-[11px] text-emerald-600 font-bold block">
                    (Includes {extraDiscPct}% Extra Discount)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
