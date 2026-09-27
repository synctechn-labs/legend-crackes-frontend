import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderSuccess } from '../pages/OrderSuccess';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';

// Admin Pages
import { AdminLogin } from '../admin/AdminLogin';
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminInventory } from '../admin/AdminInventory';
import { AdminOrders } from '../admin/AdminOrders';
import { AdminRevenue } from '../admin/AdminRevenue';

// 404 Page
const NotFound = () => (
  <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
    <div className="text-6xl font-black font-heading text-red-600">404</div>
    <h2 className="text-2xl font-bold font-heading text-slate-800">Page Not Found</h2>
    <p className="text-sm text-slate-500">
      The fireworks page you are looking for does not exist or has been moved.
    </p>
    <div className="pt-2">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors shadow-md"
      >
        Return to Home Page
      </Link>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin Login Route (Public within admin domain) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="revenue" element={<AdminRevenue />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
