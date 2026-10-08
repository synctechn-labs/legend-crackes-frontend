import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  TrendingUp,
  Users,
  Tag,
  LogOut,
  ExternalLink,
  Sparkles,
  Menu,
  X,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { BRAND_LOGO_URL } from '../utils/constants';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAuth();
  const { addToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    addToast({
      title: 'Logged Out',
      message: 'You have been safely signed out of the Admin panel.',
      type: 'info',
    });
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/inventory', icon: Boxes, label: 'Inventory' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Order Management' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { to: '/admin/revenue', icon: TrendingUp, label: 'Revenue & Sales' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-full border-2 border-red-500/40 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            <img
              src={BRAND_LOGO_URL}
              alt="Classic Legend Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <span className="font-heading font-black text-sm tracking-tight text-white block leading-none">CLASSIC LEGEND ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
            title="View Live Store"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Store</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            aria-label="Toggle Admin Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 border-r border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full border-2 border-red-500/40 bg-white p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <img
                src={BRAND_LOGO_URL}
                alt="Classic Legend Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h2 className="font-heading font-black text-base tracking-tight leading-none text-white">
                Classic<span className="text-red-500">Legend</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Admin Central Ops
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              View Live Store
            </span>
            <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Public</span>
          </Link>

          {/* Admin User info */}
          <div className="px-3 py-2 rounded-xl bg-slate-800/50 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Sivakasi Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@sivakasicrackers.com'}</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-950/40 border border-rose-900/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Topbar */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Sivakasi Crackers Central Ops</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Store Administration</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              FastAPI Endpoint Connected
            </div>
            <div className="text-xs text-slate-500 font-mono">
              API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
    </div>
  );
};
