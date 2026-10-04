import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Award,
  ShieldCheck,
  Truck,
  ArrowRight,
  Gift,
  Clock,
  CheckCircle2,
  ChevronRight,
  Zap,
  Volume2,
  PackageCheck,
  Star,
  MessageCircle
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { CATEGORIES, SAFETY_TIPS, getCategoryImage } from '../utils/constants';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { formatCurrency } from '../utils/formatters';
import { CrackerBannerCanvas } from '../components/common/CrackerBannerCanvas';

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.597A9.876 9.876 0 0012.004 3c-5.462 0-9.907 4.445-9.907 9.907 0 1.747.456 3.453 1.321 4.954L2 22l4.272-1.382a9.89 9.89 0 004.73 1.21h.004c5.461 0 9.906-4.445 9.906-9.907 0-2.643-1.029-5.127-2.895-6.993zm-6.399 14.803h-.003a8.23 8.23 0 01-4.2-1.157l-.301-.179-3.125 1.011 1.027-3.046-.196-.312a8.225 8.225 0 01-1.261-4.31c0-4.542 3.696-8.238 8.241-8.238 2.2 0 4.269.858 5.824 2.414A8.18 8.18 0 0118.59 12.8c0 4.543-3.696 8.239-8.24 8.239zm4.516-6.173c-.247-.124-1.464-.723-1.691-.806-.227-.082-.392-.124-.557.124-.165.247-.64.806-.784.97-.144.165-.289.186-.536.062-.247-.124-1.045-.385-1.99-1.228-.737-.658-1.234-1.47-1.379-1.718-.144-.247-.015-.38.109-.503.111-.11.247-.288.371-.432.124-.144.165-.289.247-.412.082-.165.042-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.2-.482-.403-.416-.557-.424l-.474-.008c-.165 0-.433.062-.66.309-.227.247-.866.846-.866 2.063 0 1.217.887 2.393 1.011 2.558.124.165 1.745 2.665 4.229 3.737.591.255 1.053.407 1.413.521.593.189 1.133.162 1.56.098.476-.071 1.464-.598 1.67-.175.206-.577.206-1.072.144-1.155-.062-.082-.227-.124-.474-.247z" />
  </svg>
);

const BRAND_LOGOS = [
  { id: 1, name: 'Sivakasi Brand 1', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790710146/images_1.jpg' },
  { id: 2, name: 'Sivakasi Brand 2', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711110/images_3.jpg' },
  { id: 3, name: 'Sivakasi Brand 3', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711147/unnamed.jpg' },
  { id: 4, name: 'Sivakasi Brand 4', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711507/1716571710pjsCL.png' },
  { id: 5, name: 'Sivakasi Brand 5', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711548/logo_2.png' },
  { id: 6, name: 'Sivakasi Brand 6', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711595/images_5.jpg' },
  { id: 7, name: 'Sivakasi Brand 7', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711632/images_4.jpg' },
  { id: 8, name: 'Sivakasi Brand 8', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711678/images_2.jpg' },
  { id: 9, name: 'RR Crackers', url: 'https://res.cloudinary.com/yez0xdym/image/upload/v1790711719/newrrcrackerslogo.png' }
];

export const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-Time Festive Countdown Timer to Diwali (Nov 8th)
  const calculateDiwaliTimeLeft = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let diwaliTarget = new Date(currentYear, 10, 8, 0, 0, 0); // November 8th (Month 10 is Nov)

    if (now.getTime() > diwaliTarget.getTime()) {
      diwaliTarget = new Date(currentYear + 1, 10, 8, 0, 0, 0);
    }

    const diff = diwaliTarget.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateDiwaliTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateDiwaliTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [featured, offers, cats] = await Promise.all([
          productService.getFeaturedProducts(8),
          productService.getSpecialOffers(4),
          categoryService.getCategories()
        ]);
        setFeaturedProducts(featured || []);
        setSpecialOffers(offers || []);
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load home products', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner with Live Cracker Animations */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950/85 to-slate-900 text-white cursor-pointer select-none">
        {/* Authentic Sivakasi Cracker & Fireworks Live Animation Canvas */}
        <CrackerBannerCanvas />

        {/* Decorative Festive Background Gradients & Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Neat Ambient CSS Cracker Starbursts */}
        <div className="absolute top-12 left-10 text-amber-300/40 cracker-star-1 pointer-events-none hidden sm:block text-2xl select-none" aria-hidden="true">✨</div>
        <div className="absolute top-20 right-16 text-yellow-200/50 cracker-star-2 pointer-events-none text-3xl select-none" aria-hidden="true">🎆</div>
        <div className="absolute bottom-14 left-1/3 text-orange-300/40 cracker-star-3 pointer-events-none hidden md:block text-xl select-none" aria-hidden="true">🎇</div>
        <div className="absolute top-1/3 right-1/4 text-amber-200/30 cracker-star-1 pointer-events-none hidden lg:block text-2xl select-none" aria-hidden="true">✨</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 pointer-events-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-amber-300 text-xs sm:text-sm font-medium shadow-xs">
                  <span>Diwali 2026 Factory Wholesale Bookings Open!</span>
                </div>

              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-[1.15] text-white drop-shadow-sm">
                Light Up Your Skies With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                  Classic Legend Crackers
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 max-w-2xl leading-relaxed font-normal">
                Experience authentic Sivakasi fireworks directly from certified manufacturers. Save up to <span className="font-semibold text-amber-300">50% direct factory discount</span> on over 500+ green crackers, aerial multi-shots, and curated family gift hampers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-rose-500 via-rose-600 to-red-500 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-sm sm:text-base rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Explore 500+ Catalog</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                </Link>

                <Link
                  to="/shop?category=gift-boxes"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-white font-medium text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span>Family Gift Boxes</span>
                </Link>


              </div>

              {/* Trust Badges */}
              <div className="pt-5 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 text-left">
                <div className="bg-white/5 sm:bg-transparent rounded-xl p-2.5 sm:p-0">
                  <p className="text-lg sm:text-2xl font-bold text-amber-400 font-heading">1000+</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-normal">Families Celebrated</p>
                </div>
                <div className="bg-white/5 sm:bg-transparent rounded-xl p-2.5 sm:p-0">
                  <p className="text-lg sm:text-2xl font-bold text-amber-400 font-heading">100% PESO</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-normal">Certified Green</p>
                </div>
                <div className="bg-white/5 sm:bg-transparent rounded-xl p-2.5 sm:p-0">
                  <p className="text-lg sm:text-2xl font-bold text-amber-400 font-heading">Direct</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-normal">Sivakasi Pricing</p>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Promotion Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl text-white space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider py-1 px-3 sm:px-4 rounded-bl-2xl">
                  Limited Early Bird
                </div>

                <div className="space-y-1.5">
                  <span className="text-amber-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Grand Festive Countdown
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading">
                    Diwali Wholesale Rush
                  </h3>
                  <p className="text-xs text-slate-300 font-normal">
                    Book early to secure factory wholesale pricing before seasonal price surges.
                  </p>
                </div>

                {/* Countdown Box */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-black/35 rounded-xl p-2 sm:p-2.5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="block text-[10px] text-slate-300 uppercase font-medium">Days</span>
                  </div>
                  <div className="bg-black/35 rounded-xl p-2 sm:p-2.5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="block text-[10px] text-slate-300 uppercase font-medium">Hours</span>
                  </div>
                  <div className="bg-black/35 rounded-xl p-2 sm:p-2.5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="block text-[10px] text-slate-300 uppercase font-medium">Mins</span>
                  </div>
                  <div className="bg-black/35 rounded-xl p-2 sm:p-2.5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="block text-[10px] text-slate-300 uppercase font-medium">Secs</span>
                  </div>
                </div>

                {/* Promo Code Highlight */}
                {/* <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-400/40 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Extra 10% Coupon</span>
                    <p className="text-sm sm:text-base font-bold font-mono text-white tracking-widest">DIWALI2026</p>
                  </div>
                  <button
                    onClick={() => navigate('/shop')}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Apply Now
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Authorized Brand Partners Logo Scroll Bar (Mobile Friendly Infinite Carousel) */}
      <section className="bg-white border-y border-slate-200/80 py-6 relative overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">

          <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-1">
            Top Sivakasi Cracker Brands
          </h2>
        </div>

        {/* Continuous Auto-Marquee with Manual Touch Scroll Fallback */}
        <div className="relative w-full overflow-x-auto no-scrollbar py-1">
          <div className="animate-infinite-scroll flex items-center gap-4 sm:gap-6 px-4">
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, idx) => (
              <div
                key={`${logo.id}-${idx}`}
                className="shrink-0 bg-white border border-slate-200/80 hover:border-red-300 rounded-2xl p-2.5 sm:p-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[120px] sm:min-w-[150px] h-18 sm:h-22 group select-none cursor-pointer"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  loading="lazy"
                  className="max-h-12 sm:max-h-16 w-auto max-w-[100px] sm:max-w-[130px] object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories Grid (Top 8 Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sivakasi Assortment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              Popular Cracker Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select from our 8 popular fireworks departments.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {(categories.length > 0 ? categories.filter(c => c.id !== 'all' && c.slug !== 'all') : CATEGORIES.slice(1)).slice(0, 8).map((category) => {
            const catImage = category.image || getCategoryImage(category);
            return (
              <Link
                key={category.id || category.slug}
                to={`/shop?category=${category.slug || category.id}`}
                className="group p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
              >
                {category.isNew && (
                  <span className="absolute top-2 right-2 text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500 text-white shadow-2xs">
                    NEW
                  </span>
                )}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-rose-50/60 p-3 flex items-center justify-center mb-3.5 overflow-hidden border border-rose-100/80 shrink-0 shadow-2xs group-hover:bg-rose-100/80 group-hover:scale-105 transition-all duration-300">
                  {catImage ? (
                    <img
                      src={catImage}
                      alt={category.name}
                      className="w-full h-full object-contain filter drop-shadow-xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Flame className="w-10 h-10 text-red-600 group-hover:scale-110 transition-all" />
                  )}
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base group-hover:text-red-600 transition-colors leading-tight truncate w-full">
                  {category.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  {category.count ?? category.product_count ?? 0} Varieties
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best-Selling Crackers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              Best-Selling Crackers
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated sparklers, aerial shots, and flower pots chosen by 50,000+ families.
            </p>
          </div>
          <Link
            to="/shop?sortBy=popular"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <span>See All Best Sellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>



      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
            The Classic Legend Advantage
          </span>
          <h2 className="text-3xl font-black font-heading text-slate-900 mt-1">
            Why Buy Directly From Sivakasi?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Eliminate retail middlemen, distributor markups, and stale storage crackers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">100% Genuine & Fresh Stock</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every cracker is freshly manufactured in Sivakasi within the current season. Guaranteed 0% duds and full explosive potency with crisp colors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Wholesale Factory Rates</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              City cracker stalls mark up prices by 300% to 400%. We ship directly to your door at original factory pricing, saving you thousands of rupees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Safe Certified Transport</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Packed in heavy-duty fire-resistant corrugated packaging with legal transport waybills. Delivered safely to pick-up points and doorsteps across India.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Diwali Safety Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
              Guidelines For a Safe & Joyous Celebration
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Please strictly adhere to these safety recommendations approved by PESO and the Tamil Nadu Fire and Rescue Services.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {SAFETY_TIPS.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-slate-950 to-red-950 text-white rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              Ready to Sparkle this Festive Season?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Browse our complete catalog of 500+ Classic legend crackers and place your order in under{" "} 2 minutes without needing an account.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Shop All Crackers</span>
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-colors"
              >
                Contact Factory Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
