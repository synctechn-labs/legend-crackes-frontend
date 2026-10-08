import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  Share2,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Festive Confetti blast on mount
  useEffect(() => {
    // Left fireworks blast
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6, x: 0.2 },
      colors: ['#DC2626', '#F59E0B', '#10B981', '#6366F1', '#EC4899']
    });

    // Right fireworks blast
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.8 },
        colors: ['#DC2626', '#F59E0B', '#10B981', '#6366F1', '#EC4899']
      });
    }, 300);
  }, []);

  // Fallback demo order if directly opened in browser
  const displayOrder = order || {
    id: 'SKF-89421-4190',
    createdAt: new Date().toISOString(),
    customer: {
      name: 'Ramesh Sundaram',
      phone: '9840123456',
      email: 'ramesh.s@example.com',
      address: 'Plot 42, 3rd Cross, Anna Nagar West',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040'
    },
    items: [
      { id: 1, name: '15cm Electric Sparklers (Silver & Gold)', quantity: 3, price: 85, total: 255 },
      { id: 10, name: '30-Shots Royal Sky Spectacle (Multi Colour)', quantity: 1, price: 890, total: 890 },
      { id: 3, name: 'Colour Koti Flower Pots (Super Deluxe)', quantity: 2, price: 210, total: 420 }
    ],
    subtotal: 1565,
    discount: 100,
    shippingFee: 0,
    total: 1465,
    paymentMethod: 'UPI / Direct QR Pay',
    status: 'Pending'
  };

  const handlePrint = () => {
    window.print();
  };

  const shareText = `🎆 My Sivakasi Diwali Crackers Order #${displayOrder.id} is confirmed! Total: ${formatCurrency(displayOrder.total)}. Direct from Sivakasi factory.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Sivakasi Factory Booking Confirmed!</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
          Thank You For Celebrating With Us!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your order has been routed to our packing team in Sivakasi. You will receive an SMS and WhatsApp tracking notification shortly.
        </p>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-red-200">Order Reference</span>
            <h2 className="text-2xl font-black font-mono text-white tracking-wider mt-0.5">
              {displayOrder.order_number || displayOrder.orderNumber || displayOrder.code || displayOrder.id}
            </h2>
            <p className="text-xs text-red-100 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Booked on {formatDate(displayOrder.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </a>
          </div>
        </div>

        {/* Customer & Delivery Coordinates */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 bg-slate-50/50 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Customer Details
            </h4>
            <p className="font-semibold text-sm text-slate-800">{displayOrder.customer.name}</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              +91 {displayOrder.customer.phone}
            </p>
            {displayOrder.customer.email && (
              <p className="text-slate-600">{displayOrder.customer.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Delivery Destination (India)
            </h4>
            <div className="text-slate-700 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p>{displayOrder.customer.address}</p>
                <p>
                  {displayOrder.customer.city}, {displayOrder.customer.state} - {displayOrder.customer.pincode}
                </p>
              </div>
            </div>
            <div className="pt-1 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium text-slate-800">Booking Status: Direct Factory Booking Confirmed</span>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="p-6 sm:p-8 space-y-4">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            Ordered Fireworks
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Item Name</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayOrder.items.map((item, idx) => {
                  const itemName = item.name || item.product_name_snapshot || item.productName || item.product?.name || `Cracker Item #${idx + 1}`;
                  const itemCode = item.code || item.product_code;
                  const itemPrice = item.price || item.unit_price || 0;
                  const itemTotal = item.total || item.total_price || (itemPrice * item.quantity);
                  return (
                    <tr key={idx} className="text-slate-700">
                      <td className="py-3 font-semibold text-slate-900">
                        {itemName}
                        {itemCode && <span className="ml-2 font-mono text-[10px] text-slate-400">({itemCode})</span>}
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(itemPrice)}</td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        {formatCurrency(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          {(() => {
            const subtotalVal = Number(displayOrder.subtotal || 0);
            const discountVal = Number(displayOrder.discount || displayOrder.extra_discount_amount || 0);
            const totalVal = Number(displayOrder.total_amount || displayOrder.totalAmount || displayOrder.total || displayOrder.finalTotal || 0);
            const deliveryVal = Number(
              displayOrder.delivery_charge ??
              displayOrder.deliveryCharge ??
              displayOrder.shippingFee ??
              displayOrder.shipping_fee ??
              (totalVal > 0 && subtotalVal > 0 ? Math.max(0, totalVal - subtotalVal + discountVal) : 500)
            );

            return (
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs max-w-xs ml-auto">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotalVal)}</span>
                </div>
                {(discountVal > 0 || displayOrder.couponCode || displayOrder.coupon_code) && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/70 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1">
                      <span>Coupon Discount</span>
                      {(displayOrder.couponCode || displayOrder.coupon_code) && (
                        <span className="font-mono text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded text-emerald-900 uppercase">
                          {displayOrder.couponCode || displayOrder.coupon_code}
                        </span>
                      )}
                    </span>
                    <span>- {formatCurrency(discountVal > 0 ? discountVal : Math.round(subtotalVal * 0.05))}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Safe Transport Delivery</span>
                  <span>
                    {deliveryVal === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      formatCurrency(deliveryVal)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-red-600 font-heading">
                    {formatCurrency(totalVal || (subtotalVal - discountVal + deliveryVal))}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Shopping Crackers</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/contact"
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-2xl transition-colors text-center"
        >
          Need Help With Your Order?
        </Link>
      </div>
    </div>
  );
};
