import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const MainLayout = () => {
  const { totalCount, grandTotal } = useCart();
  const location = useLocation();

  const isCartOrCheckout = location.pathname === '/cart' || location.pathname === '/checkout' || location.pathname === '/order-success';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden w-full relative">
      <Navbar />

      <main className="flex-1 w-full pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Global Floating WhatsApp Quick Contact Button */}
      <a
        href="https://wa.me/917010849600?text=Hi%20Classic%20Legend%20Crackers!%20I%20have%20an%20inquiry%20about%20fireworks."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 right-6 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-emerald-400/50"
        title="Chat on WhatsApp (+91 70108 49600)"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold px-1 hidden sm:inline-block">
          WhatsApp Us
        </span>
      </a>

      {/* Floating Sticky Mobile Cart Bar */}
      {!isCartOrCheckout && totalCount > 0 && (
        <div className="sm:hidden fixed bottom-16 inset-x-4 z-40 animate-slide-up">
          <Link
            to="/cart"
            className="flex items-center justify-between p-3.5 bg-red-600 text-white rounded-2xl shadow-2xl border border-red-500 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium leading-tight">{totalCount} Crackers in Bag</p>
                <p className="text-sm font-bold">{formatCurrency(grandTotal)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold bg-white text-red-600 px-3 py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
};
