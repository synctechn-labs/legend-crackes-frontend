import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Sparkles,
  ChevronDown,
  Gift,
  Flame,
  Home,
  Store,
  Info,
  PhoneCall
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { CATEGORIES, BRAND_LOGO_URL } from '../../utils/constants';
import { categoryService } from '../../services/categoryService';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar = () => {
  const navigate = useNavigate();
  const { totalCount, grandTotal } = useCart();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const cats = await categoryService.getCategories();
        setDynamicCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories in navbar', err);
      }
    };
    loadCats();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0">
              <img
                src={BRAND_LOGO_URL}
                alt="Classic Legend Crackers Logo"
                className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-xs"
              />
            </Link>

            {/* Global Search Bar (Desktop Trigger) */}
            <div className="hidden xl:flex flex-1 max-w-sm mx-4">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-slate-400 text-xs transition-all shadow-inner group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Search className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-slate-500 truncate">Search 3,000+ crackers, sparklers...</span>
                </div>
                <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white rounded-md border border-slate-200 shrink-0">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-red-600 transition-colors ${isActive ? 'text-red-600 font-bold' : ''}`
                }
              >
                Home
              </NavLink>

              {/* Categories Hover Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors py-2"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 grid grid-cols-2 gap-1 animate-fade-in z-50">
                    {(dynamicCategories.length > 0 ? dynamicCategories.filter(c => c.id !== 'all') : CATEGORIES.slice(1, 11)).slice(0, 10).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{cat.count ?? cat.product_count ?? 0}</span>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-slate-100 mt-1">
                      <Link
                        to="/shop"
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className="block text-center text-xs font-bold text-red-600 hover:underline"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `hover:text-red-600 transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-red-600 font-bold' : ''
                  }`
                }
              >
                <Flame className="w-4 h-4 text-red-500" />
                Shop Crackers
              </NavLink>

              <NavLink
                to="/shop?category=gift-boxes"
                className={({ isActive }) =>
                  `hover:text-red-600 transition-colors flex items-center gap-1 ${
                    isActive ? 'text-red-600 font-bold' : ''
                  }`
                }
              >
                <Gift className="w-4 h-4 text-amber-500" />
                Gift Boxes
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `hover:text-red-600 transition-colors ${isActive ? 'text-red-600 font-bold' : ''}`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `hover:text-red-600 transition-colors ${isActive ? 'text-red-600 font-bold' : ''}`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Right Action Icons: Cart & Search */}
            <div className="flex items-center gap-3">
              {/* Search Icon Trigger for mobile & tablet screens */}
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="xl:hidden p-2 text-slate-600 hover:text-red-600 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-2xl shadow-md shadow-red-500/20 transition-all group"
                aria-label="View Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  {totalCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {totalCount > 99 ? '99+' : totalCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase font-semibold text-red-100">Festive Bag</span>
                  <span className="text-xs font-bold text-white">
                    {totalCount > 0 ? `₹${grandTotal.toLocaleString()}` : '0 Items'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-1.5">
        <div className="grid grid-cols-4 items-center justify-around text-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-1 text-[11px] font-semibold transition-all ${
                isActive ? 'text-red-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-1 text-[11px] font-semibold transition-all ${
                isActive ? 'text-red-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span>Shop</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-1 text-[11px] font-semibold transition-all ${
                isActive ? 'text-red-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <Info className="w-5 h-5 mb-0.5" />
            <span>About Us</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-1 text-[11px] font-semibold transition-all ${
                isActive ? 'text-red-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-900'
              }`
            }
          >
            <PhoneCall className="w-5 h-5 mb-0.5" />
            <span>Contact Us</span>
          </NavLink>
        </div>
      </nav>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};
