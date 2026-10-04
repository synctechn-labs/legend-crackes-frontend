import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.597A9.876 9.876 0 0012.004 3c-5.462 0-9.907 4.445-9.907 9.907 0 1.747.456 3.453 1.321 4.954L2 22l4.272-1.382a9.89 9.89 0 004.73 1.21h.004c5.461 0 9.906-4.445 9.906-9.907 0-2.643-1.029-5.127-2.895-6.993zm-6.399 14.803h-.003a8.23 8.23 0 01-4.2-1.157l-.301-.179-3.125 1.011 1.027-3.046-.196-.312a8.225 8.225 0 01-1.261-4.31c0-4.542 3.696-8.238 8.241-8.238 2.2 0 4.269.858 5.824 2.414A8.18 8.18 0 0118.59 12.8c0 4.543-3.696 8.239-8.24 8.239zm4.516-6.173c-.247-.124-1.464-.723-1.691-.806-.227-.082-.392-.124-.557.124-.165.247-.64.806-.784.97-.144.165-.289.186-.536.062-.247-.124-1.045-.385-1.99-1.228-.737-.658-1.234-1.47-1.379-1.718-.144-.247-.015-.38.109-.503.111-.11.247-.288.371-.432.124-.144.165-.247.247-.412.082-.165.042-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.2-.482-.403-.416-.557-.424l-.474-.008c-.165 0-.433.062-.66.309-.227.247-.866.846-.866 2.063 0 1.217.887 2.393 1.011 2.558.124.165 1.745 2.665 4.229 3.737.591.255 1.053.407 1.413.521.593.189 1.133.162 1.56.098.476-.071 1.464-.598 1.67-.175.206-.577.206-1.072.144-1.155-.062-.082-.227-.124-.474-.247z" />
  </svg>
);

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

      {/* Global Floating Official WhatsApp Quick Contact Button */}
      <a
        href="https://wa.me/917010849600?text=Hi%20Classic%20Legend%20Crackers!%20I%20have%20an%20inquiry%20about%20fireworks."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 sm:bottom-8 right-5 sm:right-6 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-emerald-400/50"
        title="Chat on WhatsApp (+91 70108 49600)"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
        <WhatsAppIcon className="w-6 h-6 text-white" />
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
