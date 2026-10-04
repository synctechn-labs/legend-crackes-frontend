import React, { useState, useEffect, useRef } from 'react';
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
  Download,
  Settings,
  Edit3,
  Building,
  Save,
  FileText,
  Volume2,
  VolumeX,
  Bell,
  Trash2
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { invalidateDashboardCache } from '../services/dashboardService';
import { invalidateRevenueCache } from '../services/revenueService';
import { useToast } from '../hooks/useToast';
import { formatCurrency, formatDate, formatOrderId } from '../utils/formatters';
import { ORDER_STATUSES, ORDER_STATUS_COLORS } from '../utils/constants';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';

const DEFAULT_COMPANY_SETTINGS = {
  companyName: 'Classic Legend Crackers',
  tagline: 'Sivakasi Direct Factory Wholesale Crackers',
  address: '142/B, Factory Main Road, Sivakasi, Tamil Nadu - 626123',
  gstin: '33AABCC1234D1Z5',
  phone: '+91 70108 49600',
  email: 'classiclegendcrackers@gmail.com',
  terms: `1. All items are direct Sivakasi factory packed and quality verified.\n2. Goods once sold will not be returned or exchanged.\n3. Transported via authorized legal non-hazardous cargo carriers.\n4. All disputes subject to Sivakasi Jurisdiction only.`,
  signatoryTitle: 'For Classic Legend Crackers',
  signatureName: 'Gugan SR',
  signatureImg: ''
};

const cleanStr = (val) => String(val || '').replace(/^string:/i, '').trim();

export const AdminOrders = () => {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeOrder, setActiveOrder] = useState(null); // for details modal
  const [extraDiscountInput, setExtraDiscountInput] = useState('');
  const [extraDiscountType, setExtraDiscountType] = useState('percent'); // 'percent' | 'amount'
  const [updatingDiscount, setUpdatingDiscount] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const [companySettings, setCompanySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('invoice_company_settings');
      return saved ? { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(saved) } : DEFAULT_COMPANY_SETTINGS;
    } catch (e) {
      return DEFAULT_COMPANY_SETTINGS;
    }
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState(companySettings);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const knownOrderIdsRef = useRef(null);

  const playOrderNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playNote = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playNote(587.33, now, 0.35);      // D5 note
      playNote(880, now + 0.15, 0.55);  // A5 note
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  const handleSaveSettings = (e) => {
    e?.preventDefault();
    setCompanySettings(settingsForm);
    localStorage.setItem('invoice_company_settings', JSON.stringify(settingsForm));
    setShowSettingsModal(false);
    addToast({
      title: 'Invoice Settings Saved',
      message: 'Company details, terms, and signature updated successfully.',
      type: 'success'
    });
  };

  const checkForNewOrders = async () => {
    try {
      const data = await orderService.getOrders({ limit: 50 });
      const fetchedOrders = data.orders || [];
      const fetchedIds = new Set(fetchedOrders.map((o) => String(o.id)));

      if (knownOrderIdsRef.current !== null) {
        const newOrders = fetchedOrders.filter((o) => !knownOrderIdsRef.current.has(String(o.id)));
        if (newOrders.length > 0) {
          playOrderNotificationSound();
          newOrders.forEach((newOrd) => {
            const custName = cleanStr(newOrd.customer?.name || 'Customer');
            const amt = formatCurrency(newOrd.finalTotal || newOrd.total || 0);
            addToast({
              title: '🚨 NEW ORDER RECEIVED!',
              message: `Order #${newOrd.id} by ${custName} for ${amt}`,
              type: 'success'
            });

            if (window.Notification && Notification.permission === 'granted') {
              new Notification(`🚨 New Order #${newOrd.id}`, {
                body: `Customer: ${custName} | Total: ${amt}`,
                icon: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790708530/1000240064.png'
              });
            }
          });
          setOrders(fetchedOrders);
        }
      } else {
        knownOrderIdsRef.current = fetchedIds;
      }
    } catch (err) {
      console.error('Failed checking new orders:', err);
    }
  };

  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForNewOrders();
    }, 12000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

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
      const val = parseFloat(extraDiscountInput) || 0;
      const payload = extraDiscountType === 'amount'
        ? { extra_discount_amount: val }
        : { extra_discount_percentage: val };

      const updatedOrder = await orderService.updateExtraDiscount(activeOrder.id, payload);

      const orderSubtotal = Number(updatedOrder.total || updatedOrder.subtotal || 0);
      const extraDiscAmt = Number(updatedOrder.extraDiscountAmount ?? updatedOrder.extra_discount_amount ?? 0);
      const finalVal = updatedOrder.finalTotal ?? updatedOrder.final_total_amount ?? (orderSubtotal - extraDiscAmt);
      const extraPct = Number(updatedOrder.extraDiscountPercentage ?? updatedOrder.extra_discount_percentage ?? 0);

      addToast({
        title: 'Extra Discount Applied',
        message: extraDiscountType === 'amount'
          ? `Applied ₹${val} flat extra discount from profit (-${formatCurrency(extraDiscAmt)}). Final Payable: ${formatCurrency(finalVal)}.`
          : `Applied ${val}% extra discount from profit (-${formatCurrency(extraDiscAmt)}). Final Payable: ${formatCurrency(finalVal)}.`,
        type: 'success'
      });

      const fullUpdated = {
        ...activeOrder,
        ...updatedOrder,
        extraDiscountPercentage: extraPct,
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

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${orderId}? This action cannot be undone.`)) {
      return;
    }
    setDeletingOrderId(orderId);
    try {
      await orderService.deleteOrder(orderId);
      invalidateDashboardCache();
      invalidateRevenueCache();
      addToast({
        title: 'Order Deleted',
        message: `Order #${orderId} was permanently deleted.`,
        type: 'success'
      });
      setOrders((prev) => prev.filter((o) => String(o.id) !== String(orderId)));
      if (activeOrder && String(activeOrder.id) === String(orderId)) {
        setActiveOrder(null);
      }
    } catch (err) {
      addToast({
        title: 'Delete Failed',
        message: err.message || 'Could not delete order.',
        type: 'error'
      });
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handlePrintInvoice = (ord) => {
    if (!ord) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const clean = (val) => String(val || '').replace(/^string:/i, '').trim();

    const itemsHtml = (ord.items || []).map((it, idx) => {
      const itemName = clean(it.name || it.product_name_snapshot || it.productName || `Cracker Item #${idx + 1}`);
      const itemCode = clean(it.code || it.product_code || '-');
      const unitPrice = Number(it.price || it.unit_price || 0);
      const qty = Number(it.quantity || 1);
      const lineTotal = Number(it.total || it.total_price || (unitPrice * qty));

      return `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; text-align: center; color: #64748b; font-size: 11px; font-weight: 600;">${idx + 1}</td>
          <td style="padding: 10px 12px; font-family: monospace; font-size: 11px; font-weight: 700; color: #0f172a;">${itemCode}</td>
          <td style="padding: 10px 12px;">
            <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${itemName}</div>
          </td>
          <td style="padding: 10px 12px; text-align: center; font-weight: 800; color: #0f172a; font-size: 13px;">${qty}</td>
          <td style="padding: 10px 12px; text-align: right; color: #334155; font-size: 12px;">₹${unitPrice.toLocaleString('en-IN')}</td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #0f172a; font-size: 13px;">₹${lineTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');

    const subtotal = Number(ord.subtotal || ord.total || 0);
    const extraDiscPct = Number(ord.extraDiscountPercentage ?? ord.extra_discount_percentage ?? 0);
    const extraDiscAmt = Number(ord.extraDiscountAmount ?? ord.extra_discount_amount ?? 0);
    const finalTotal = Number(ord.finalTotal ?? ord.final_total_amount ?? (subtotal - extraDiscAmt));
    const status = clean(ord.status || 'Confirmed');

    const statusBg = status === 'Cancelled' ? '#ffe4e6' : status === 'Delivered' ? '#d1fae5' : '#e0f2fe';
    const statusColor = status === 'Cancelled' ? '#e11d48' : status === 'Delivered' ? '#059669' : '#0284c7';

    const customerName = clean(ord.customer?.name || 'Valued Customer');
    const customerPhone = clean(ord.customer?.phone || '');
    const customerAltPhone = clean(ord.customer?.alternatePhone || ord.customer?.alternate_phone || ord.customer_alternate_phone || '');
    const customerEmail = clean(ord.customer?.email || '');
    const customerAddress = clean(ord.customer?.address || '');
    const customerCity = clean(ord.customer?.city || '');
    const customerState = clean(ord.customer?.state || '');
    const customerPincode = clean(ord.customer?.pincode || '');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice #${ord.id || ord.order_number} - Classic Legend Crackers</title>
          <style>
            @media print {
              body { padding: 0 !important; background: #fff !important; }
              .no-print { display: none !important; }
              .invoice-card { border: none !important; box-shadow: none !important; width: 100% !important; max-width: none !important; padding: 0 !important; }
            }
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; background: #f1f5f9; margin: 0; padding: 24px; }
            .invoice-card { max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
            .brand-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 24px; }
            .brand-logo-title { display: flex; align-items: center; gap: 14px; }
            .brand-logo { width: 56px; height: 56px; object-fit: contain; }
            .brand-name { font-size: 22px; font-weight: 900; color: #dc2626; letter-spacing: -0.5px; text-transform: uppercase; }
            .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; font-weight: 600; }
            .invoice-title-block { text-align: right; }
            .invoice-tag { font-size: 20px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
            .inv-id { font-size: 13px; font-weight: 800; color: #dc2626; margin-top: 2px; }
            .inv-date { font-size: 11px; color: #64748b; margin-top: 2px; }
            
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
            .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; }
            .box-heading { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
            .cust-name { font-size: 15px; font-weight: 800; color: #0f172a; }
            .cust-detail { font-size: 12px; color: #475569; margin-top: 3px; line-height: 1.4; }
            
            .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; background: ${statusBg}; color: ${statusColor}; margin-top: 6px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #0f172a; color: #ffffff; padding: 10px 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border: none; }
            th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
            th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
            
            .summary-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 24px; }
            .terms-box { max-width: 380px; font-size: 11px; color: #64748b; line-height: 1.5; }
            .totals-table { width: 280px; font-size: 12px; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
            .grand-payable { border-top: 2px dashed #dc2626; border-bottom: 2px solid #dc2626; padding: 10px 0; font-size: 18px; font-weight: 900; color: #dc2626; margin-top: 6px; }
            
            .footer-notes { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="brand-bar">
              <div class="brand-logo-title">
                <img src="https://res.cloudinary.com/yez0xdym/image/upload/v1790708530/1000240064.png" class="brand-logo" alt="Classic Legend Crackers Logo" />
                <div>
                  <div class="brand-name">Classic Legend Crackers</div>
                  <div class="brand-sub">Sivakasi Direct Factory Wholesale | Ph: +91 70108 49600</div>
                </div>
              </div>
              <div class="invoice-title-block">
                <div class="invoice-tag">TAX INVOICE</div>
                <div class="inv-id">INVOICE #${formatOrderId(ord.order_number || ord.orderNumber || ord.id)}</div>
                <div class="inv-date">Date: ${formatDate(ord.createdAt)}</div>
              </div>
            </div>

            <div class="meta-grid">
              <div class="info-box">
                <div class="box-heading">Billed To (Customer)</div>
                <div class="cust-name">${customerName}</div>
                <div class="cust-detail">
                  ${customerPhone ? `Phone: <strong>+91 ${customerPhone}</strong><br/>` : ''}
                  ${customerAltPhone ? `Alt Phone: <strong>+91 ${customerAltPhone}</strong><br/>` : ''}
                  ${customerEmail ? `Email: ${customerEmail}` : ''}
                </div>
              </div>

              <div class="info-box">
                <div class="box-heading">Delivery Address & Status</div>
                <div class="cust-detail" style="font-weight: 600; color: #0f172a;">
                  ${customerAddress ? `${customerAddress}<br/>` : ''}
                  ${customerCity ? `${customerCity}, ` : ''}${customerState ? `${customerState} ` : ''}${customerPincode ? `- ${customerPincode}` : ''}
                </div>
                <div>
                  <span class="status-badge">Status: ${status}</span>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">S.No</th>
                  <th style="width: 80px;">Code</th>
                  <th>Product Variety</th>
                  <th style="width: 60px; text-align: center;">Qty</th>
                  <th style="width: 100px; text-align: right;">Unit Price</th>
                  <th style="width: 110px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="summary-section">
              <div class="terms-box">
                <strong style="color: #0f172a;">Terms & Guarantee:</strong><br/>
                • All items are direct Sivakasi factory packed.<br/>
                • Safe & legal non-hazardous transport guaranteed.<br/>
                • Helpline: +91 70108 49600 (Mon - Sun)
              </div>

              <div class="totals-table">
                <div class="total-row">
                  <span style="color: #64748b;">Subtotal:</span>
                  <span style="font-weight: 700; color: #0f172a;">₹${subtotal.toLocaleString('en-IN')}</span>
                </div>
                ${extraDiscAmt > 0 ? `
                  <div class="total-row" style="color: #059669;">
                    <span>Extra Discount:</span>
                    <span style="font-weight: 700;">- ₹${extraDiscAmt.toLocaleString('en-IN')}</span>
                  </div>
                ` : ''}
                <div class="total-row grand-payable">
                  <span>Total Payable:</span>
                  <span>₹${finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div class="footer-notes">
              Thank you for choosing <strong>Classic Legend Crackers</strong>! Wish you a bright & happy celebration.
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

  const backendProfit = (activeOrder?.profit !== undefined && activeOrder?.profit !== null)
    ? Number(activeOrder.profit)
    : null;

  const orderProfitBeforeExtra = backendProfit !== null
    ? backendProfit
    : (activeOrder?.items?.reduce((acc, item) => {
        const sellP = Number(item.price || item.unit_price || 0);
        const myP = Number(item.myPrice ?? item.my_price ?? 0);
        return acc + (sellP - myP) * (item.quantity || 1);
      }, 0) || 0);

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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setSoundEnabled((prev) => !prev);
              if (!soundEnabled) {
                playOrderNotificationSound();
              }
            }}
            className={`px-3 py-2 border rounded-xl shadow-xs text-xs font-bold transition-all flex items-center gap-1.5 ${soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            title="Toggle Order Sound Alerts"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>Sound Alerts: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSettingsForm(companySettings);
              setShowSettingsModal(true);
            }}
            className="px-3.5 py-2 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <Settings className="w-4 h-4 text-red-600" />
            <span>Invoice Settings</span>
          </button>

          <button
            type="button"
            onClick={loadOrders}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${selectedStatus === status
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
                        <span className="font-mono font-bold text-slate-900 block">{formatOrderId(ord.order_number || ord.orderNumber || ord.id)}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {formatDate(ord.createdAt)}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{cleanStr(ord.customer?.name)}</span>
                          <span className="text-slate-500 flex items-center gap-1 flex-wrap">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{cleanStr(ord.customer?.phone)}</span>
                            {(ord.customer?.alternatePhone || ord.customer?.alternate_phone || ord.customer_alternate_phone) && (
                              <span className="text-[10px] text-slate-400 font-normal"> (Alt: {cleanStr(ord.customer?.alternatePhone || ord.customer?.alternate_phone || ord.customer_alternate_phone)})</span>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                            {[cleanStr(ord.customer?.city), cleanStr(ord.customer?.state)].filter(Boolean).join(', ')}
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

                      {/* Actions: Inspect + Print Invoice + Delete */}
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
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id)}
                            disabled={deletingOrderId === ord.id}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200/60 disabled:opacity-50"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                  {formatOrderId(activeOrder.order_number || activeOrder.orderNumber || activeOrder.id)}
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
                  type="button"
                  onClick={() => handleDeleteOrder(activeOrder.id)}
                  disabled={deletingOrderId === activeOrder.id}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
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
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Customer Details</span>
                <p className="font-bold text-sm text-slate-900">{cleanStr(activeOrder.customer?.name)}</p>
                <p className="text-slate-600">Phone: +91 {cleanStr(activeOrder.customer?.phone)}</p>
                {(activeOrder.customer?.alternatePhone || activeOrder.customer?.alternate_phone || activeOrder.customer_alternate_phone) && (
                  <p className="text-slate-600">Alt Phone: +91 {cleanStr(activeOrder.customer?.alternatePhone || activeOrder.customer?.alternate_phone || activeOrder.customer_alternate_phone)}</p>
                )}
                {activeOrder.customer?.email && (
                  <p className="text-slate-600">Email: {cleanStr(activeOrder.customer.email)}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Delivery Coordinates</span>
                <p className="text-slate-700">{cleanStr(activeOrder.customer?.address)}</p>
                <p className="font-medium text-slate-900">
                  {[cleanStr(activeOrder.customer?.city), cleanStr(activeOrder.customer?.state)].filter(Boolean).join(', ')}
                  {activeOrder.customer?.pincode ? ` - ${cleanStr(activeOrder.customer?.pincode)}` : ''}
                </p>
                {activeOrder.customer?.deliveryNotes && (
                  <p className="text-slate-500 italic mt-1">Note: {cleanStr(activeOrder.customer.deliveryNotes)}</p>
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase text-[11px]">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    Extra Discount
                  </span>
                  {/* Mode Switcher */}
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-emerald-300">
                    <button
                      type="button"
                      onClick={() => setExtraDiscountType('percent')}
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                        extraDiscountType === 'percent'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      % Percent
                    </button>
                    <button
                      type="button"
                      onClick={() => setExtraDiscountType('amount')}
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                        extraDiscountType === 'amount'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ₹ Flat Amount
                    </button>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">
                  Est. Order Profit: <strong>{formatCurrency(orderProfitBeforeExtra)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    step={extraDiscountType === 'percent' ? '0.5' : '1'}
                    value={extraDiscountInput}
                    onChange={(e) => setExtraDiscountInput(e.target.value)}
                    placeholder={extraDiscountType === 'percent' ? 'Enter discount % e.g. 5' : 'Enter discount amount e.g. 200'}
                    className="w-full pl-3 pr-8 py-2 text-xs font-bold bg-white border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  {extraDiscountType === 'percent' ? (
                    <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  ) : (
                    <span className="font-bold text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs">₹</span>
                  )}
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

              {extraDiscAmt > 0 && (
                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Subtotal</span>
                    <span className="font-bold text-slate-800">{formatCurrency(orderSubtotal)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block">Extra Discount</span>
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
                    (Includes Extra Discount -{formatCurrency(extraDiscAmt)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invoice & Company Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-2xl">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Invoice & Company Settings
                  </h3>
                  <p className="text-xs text-slate-500">Edit company details, tax ID, terms, and signature for invoices.</p>
                </div>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settingsForm.companyName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Factory / Company Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Terms & Conditions (One per line)</label>
                <textarea
                  rows={4}
                  value={settingsForm.terms}
                  onChange={(e) => setSettingsForm({ ...settingsForm, terms: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Signatory Title</label>
                  <input
                    type="text"
                    value={settingsForm.signatoryTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, signatoryTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                    placeholder="For Classic Legend Crackers"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Signatory Label / Name</label>
                  <input
                    type="text"
                    value={settingsForm.signatureName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, signatureName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-red-500"
                    placeholder="Authorized Signatory"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Signature Image URL (Optional)</label>
                  <input
                    type="text"
                    value={settingsForm.signatureImg}
                    onChange={(e) => setSettingsForm({ ...settingsForm, signatureImg: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-red-500"
                    placeholder="https://... image link or leave empty for script signature"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Invoice Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
