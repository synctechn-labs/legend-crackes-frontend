import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';
import { MIN_ORDER_AMOUNT } from '../utils/constants';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalCount, subtotal, couponDiscount, shippingFee, grandTotal, clearCart, appliedCoupon } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    deliveryNotes: '',
    paymentMethod: 'UPI / Direct QR Pay'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to shop
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-slate-800">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl"
        >
          <span>Explore Crackers</span>
        </Link>
      </div>
    );
  }

  // Minimum Order Value Guard (₹500)
  if (subtotal < MIN_ORDER_AMOUNT) {
    const remaining = MIN_ORDER_AMOUNT - subtotal;
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm border border-amber-200">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-heading text-slate-900">Wholesale Minimum Order Value: ₹500</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your current order subtotal is <strong className="text-slate-900">{formatCurrency(subtotal)}</strong>. Please add <strong className="text-rose-600">{formatCurrency(remaining)}</strong> more crackers to fulfill the ₹500 minimum wholesale order requirement.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <span>View Cart</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add More Crackers to Bag</span>
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    if (!formData.address.trim()) errs.address = 'Street delivery address is required';
    if (!formData.city.trim()) errs.city = 'City / Town is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Pincode must be 6 digits';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast({
        title: 'Incomplete Details',
        message: 'Please fill in all mandatory delivery fields.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          deliveryNotes: formData.deliveryNotes.trim(),
        },
        items: cartItems.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          categoryName: item.categoryName,
          price: item.sellingPrice,
          quantity: item.quantity,
          total: item.sellingPrice * item.quantity,
          image: item.image,
        })),
        subtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code || null,
        shippingFee,
        total: grandTotal,
        paymentMethod: formData.paymentMethod,
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // Clear the user's cart
      clearCart();

      addToast({
        title: 'Order Placed Successfully!',
        message: `Order #${createdOrder.id} has been booked from Sivakasi factory.`,
        type: 'success',
      });

      // Redirect to Order Success page with order details
      navigate('/order-success', { state: { order: createdOrder }, replace: true });
    } catch (err) {
      console.error('Order creation error', err);
      addToast({
        title: 'Order Failed',
        message: err.message || 'Could not place order. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" /> Guest Checkout • No Account or Password Needed
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
          Delivery Coordinates & Order Booking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Please provide accurate delivery coordinates in India for non-hazardous legal fireworks transport.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Information & Delivery Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Sundaram"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:border-red-500 ${errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number e.g. 9840123456"
                  maxLength={10}
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:border-red-500 ${errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Optional for invoice copy)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ramesh.s@example.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Delivery Address (India)</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Door No, Flat, Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Plot No. 42, 3rd Main Road, Anna Nagar West"
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:border-red-500 ${errors.address ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Chennai"
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:border-red-500 ${errors.city ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                      }`}
                  />
                  {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  >
                    {[
                      'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Kerala',
                      'Maharashtra', 'Gujarat', 'Delhi NCR', 'Uttar Pradesh', 'West Bengal',
                      'Rajasthan', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Other States'
                    ].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 Digits e.g. 600040"
                    maxLength={6}
                    className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:border-red-500 ${errors.pincode ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                      }`}
                  />
                  {errors.pincode && <p className="text-[11px] text-red-500 mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Landmark / Special Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                  placeholder="Near Water Tank / Call before delivery"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-28">
            <h3 className="font-heading font-black text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                {totalCount} Crackers
              </span>
            </h3>

            {/* Items Mini List */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} × {formatCurrency(item.sellingPrice)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- {formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Safe Hazardous Transport</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-600">FREE Delivery</strong>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Grand Total</span>
                <span className="text-3xl font-black text-red-600 font-heading">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">GST Included</span>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-semiblod text-sm rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Booking Sivakasi Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>Place Festive Order Now</span>
                </>
              )}
            </button>

            <div className="pt-1 text-center space-y-2">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                256-bit Encrypted Direct Sivakasi Booking
              </p>
              <p className="text-[10px] text-slate-400">
                You will receive immediate order confirmation details and WhatsApp tracking upon order placement.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
