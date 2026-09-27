import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const MainLayout = () => {
  const { totalCount, grandTotal } = useCart();
  const location = useLocation();

  const isCartOrCheckout = location.pathname === '/cart' || location.pathname === '/checkout' || location.pathname === '/order-success';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden w-full">
      <Navbar />

      <main className="flex-1 w-full pb-16 lg:pb-0">
        <Outlet />
      </main>

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
