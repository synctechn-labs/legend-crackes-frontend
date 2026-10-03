import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { BRAND_LOGO_URL } from '../utils/constants';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(username.trim(), password, rememberMe);
      if (result.success) {
        addToast({
          title: 'Welcome Admin!',
          message: 'Authenticated successfully into Sivakasi Central Operations.',
          type: 'success',
        });
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative festive particles in dark background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-full border-2 border-red-500/40 bg-white p-1 flex items-center justify-center shrink-0 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src={BRAND_LOGO_URL}
              alt="Classic Legend Crackers Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black font-heading text-white tracking-tight leading-none">
              CLASSIC<span className="text-red-500 font-semiblod">LEGEND</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1">
              Store Admin Portal
            </span>
          </div>
        </Link>
        <h2 className="text-xl sm:text-2xl font-semiblod text-white font-heading">
          Store Administrator Login
        </h2>
        <p className="text-xs text-slate-400">
          Secure central portal for 3000+ catalog inventory, orders, and revenue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Quick Demo Credentials Info Tag */}
          {/* <div className="p-3 bg-red-950/50 border border-red-800/40 rounded-2xl text-xs text-red-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FastAPI Backend Ready Credentials:</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              Username: <strong className="text-white">admin</strong> | Password: <strong className="text-white">admin123</strong>
            </p>
          </div> */}

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or admin@sivakasicrackers.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-xs focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-xs focus:outline-none focus:border-red-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span className="text-xs text-slate-400">Remember session</span>
              </label>
              <span className="text-[11px] text-slate-500">FastAPI JWT Token</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to Sivakasi Fireworks Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
