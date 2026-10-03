import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { MIN_ORDER_AMOUNT } from '../utils/constants';

export const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalCount,
    originalSubtotal,
    subtotal,
    productSavings,
    couponDiscount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, targetId: null });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponCode('');
    }
  };

  const handleConfirmAction = () => {
    if (modalState.type === 'clear') {
      clearCart();
    } else if (modalState.type === 'remove' && modalState.targetId) {
      removeFromCart(modalState.targetId);
    }
    setModalState({ isOpen: false, type: null, targetId: null });
  };

  // Minimum Order Amount validation (₹500)
  const remainingForMinOrder = Math.max(0, MIN_ORDER_AMOUNT - subtotal);
  const minOrderProgress = Math.min(100, Math.round((subtotal / MIN_ORDER_AMOUNT) * 100));

  // Free shipping threshold check (₹3000)
  const freeShippingThreshold = 3000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black font-heading text-slate-900">Your Festive Bag is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't added any crackers or gift hampers yet. Explore our 500+ authentic Sivakasi catalog!
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explore Sivakasi Crackers Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Shopping Cart ({totalCount} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct Sivakasi factory order • Minimum order amount: <strong>₹500</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ isOpen: true, type: 'clear' })}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Bag</span>
        </button>
      </div>

      {/* Minimum Order Value Alert Banner */}
      <div className={`rounded-3xl border-2 p-5 sm:p-6 shadow-md transition-all ${subtotal < MIN_ORDER_AMOUNT
        ? 'bg-gradient-to-r from-red-500/10 via-amber-500/10 to-rose-500/10 border-red-500/40 text-slate-900'
        : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-emerald-500/40 text-slate-900'
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] uppercase tracking-wider ${subtotal < MIN_ORDER_AMOUNT
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-emerald-600 text-white shadow-xs'
                }`}>
                {subtotal < MIN_ORDER_AMOUNT ? 'Mandatory Order Minimum: ₹500' : 'Order Minimum Achieved!'}
              </span>
            </div>
            <h3 className="font-heading font-semiblod text-base sm:text-lg text-slate-900">
              {subtotal < MIN_ORDER_AMOUNT ? (
                <>Add <span className="text-red-600 underline decoration-red-300 font-black">{formatCurrency(remainingForMinOrder)}</span> more to unlock direct checkout</>
              ) : (
                <>🎉 Minimum order of ₹500 satisfied! Free shipping unlocked.</>
              )}
            </h3>
          </div>
          <div className="shrink-0 text-right font-mono font-black text-lg text-slate-800 bg-white/80 px-3.5 py-1.5 rounded-2xl border border-slate-200">
            {minOrderProgress}% Completed
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${subtotal < MIN_ORDER_AMOUNT
              ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-red-600 shadow-xs'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs'
              }`}
            style={{ width: `${minOrderProgress}%` }}
          />
        </div>
      </div>

      {/* Main Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.id} className="p-3.5 sm:p-5 flex flex-row items-center gap-3.5 sm:gap-5 relative">
                {/* Thumbnail Image */}
                <Link to={`/product/${item.id}`} className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </Link>

                {/* Info & Controls Body */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5 space-y-1.5">
                  {/* Top Header Row: Category, Code & Delete button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <span className="text-red-600 font-semiblod text-[10px] sm:text-xs uppercase tracking-wider truncate">
                        {item.categoryName}
                      </span>
                      <span className="text-slate-300 text-[10px]">•</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalState({ isOpen: true, type: 'remove', targetId: item.id })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 -mr-1 -mt-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Specs */}
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-red-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {(item.tamilName || item.tamil_name) && (
                      <span className="text-xs font-semibold text-red-600 block mt-0.5 font-sans">
                        {item.tamilName || item.tamil_name}
                      </span>
                    )}
                    {item.piecesPerBox && (
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                        {item.piecesPerBox}
                      </span>
                    )}
                  </div>

                  {/* Pricing Row & Quantity Stepper */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                    {/* Price Breakdown */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-semiblod text-slate-900 text-sm sm:text-base">
                        {formatCurrency(item.sellingPrice)}
                      </span>
                      {item.originalPrice > item.sellingPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                      {item.discount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper & Line Total */}
                    <div className="flex items-center gap-3">
                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors text-xs"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-semiblod text-xs text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 99)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors text-xs disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0">
                        <span className="font-semiblod text-sm sm:text-base text-red-600 font-heading block leading-none">
                          {formatCurrency(item.sellingPrice * item.quantity)}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-medium">Total</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping Crackers</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-heading font-black text-lg text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Have a Festive Coupon?
              </label>
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-mono font-bold text-xs text-emerald-900">{appliedCoupon.code}</span>
                      <span className="block text-[11px] text-emerald-700">{appliedCoupon.label}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter DIWALI2026"
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="font-semibold text-slate-900">{totalCount} units</span>
              </div>
              <div className="flex justify-between">
                <span>Original MRP Total</span>
                <span className="line-through text-slate-400">{formatCurrency(originalSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Factory Wholesale Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Direct Sivakasi Discount</span>
                <span>- {formatCurrency(productSavings)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>- {formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Safe Transport Delivery</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shippingFee)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Grand Total</span>
                <span className="text-2xl font-black text-red-600 font-heading">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Total Saved: {formatCurrency(productSavings + couponDiscount)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              disabled={subtotal < MIN_ORDER_AMOUNT}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-semiblod text-sm rounded-2xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
            >
              {subtotal < MIN_ORDER_AMOUNT ? (
                <span>Add {formatCurrency(remainingForMinOrder)} More to Checkout</span>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                No login required • Safe checkout guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.type === 'clear' ? 'Clear Entire Cart?' : 'Remove Cracker?'}
        message={
          modalState.type === 'clear'
            ? 'Are you sure you want to remove all items from your festive cart?'
            : 'Are you sure you want to remove this item from your cart?'
        }
        confirmText={modalState.type === 'clear' ? 'Yes, Clear All' : 'Remove Item'}
        confirmVariant="danger"
        onConfirm={handleConfirmAction}
        onClose={() => setModalState({ isOpen: false, type: null, targetId: null })}
      />
    </div>
  );
};
