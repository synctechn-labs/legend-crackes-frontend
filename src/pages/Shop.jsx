import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  LayoutGrid,
  List,
  ChevronDown,
  Check
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductCard } from '../components/common/ProductCard';
import { Pagination } from '../components/common/Pagination';
import { ProductGridSkeleton } from '../components/common/SkeletonLoader';
import { useDebounce } from '../hooks/useDebounce';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sortBy') || 'featured';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [priceRange, setPriceRange] = useState('all'); // all | under150 | 150-500 | 500-1500 | 1500+
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [productsData, setProductsData] = useState({
    products: [],
    page: 1,
    limit: 4,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Close custom category popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search term
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Load Categories list
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Update URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (sortBy && sortBy !== 'featured') params.set('sortBy', sortBy);
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  }, [selectedCategory, debouncedSearch, sortBy, page, setSearchParams]);

  // Fetch paginated products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let priceMin = 0;
        let priceMax = 100000;

        if (priceRange === 'under150') {
          priceMax = 150;
        } else if (priceRange === '150-500') {
          priceMin = 150;
          priceMax = 500;
        } else if (priceRange === '500-1500') {
          priceMin = 500;
          priceMax = 1500;
        } else if (priceRange === '1500+') {
          priceMin = 1500;
        }

        const data = await productService.getProducts({
          page,
          limit: itemsPerPage,
          category: selectedCategory,
          search: debouncedSearch,
          sortBy,
          priceMin,
          priceMax,
          inStockOnly
        });

        setProductsData(data);
      } catch (err) {
        console.error('Failed to load products catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, itemsPerPage, selectedCategory, debouncedSearch, sortBy, priceRange, inStockOnly]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
    setIsMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange('all');
    setInStockOnly(false);
    setPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Direct Sivakasi Wholesaler Notice
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-heading leading-tight">
            Minimum Order Value: ₹3,000
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium">
            <strong>Important:</strong> Wholesale factory discounts are applicable with a minimum order total of <strong>₹3,000</strong>.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-heading font-bold text-slate-900 text-base">
              <Filter className="w-4 h-4 text-red-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h4>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const catIdentifier = cat.slug || String(cat.id);
                const isSelected = selectedCategory === catIdentifier || String(selectedCategory) === String(cat.id) || selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    onClick={() => handleCategorySelect(catIdentifier)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-500 text-white font-bold shadow-xs shadow-rose-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Range</h4>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under150', label: 'Under ₹150 (Economy)' },
                { id: '150-500', label: '₹150 to ₹500 (Popular)' },
                { id: '500-1500', label: '₹500 to ₹1,500 (Deluxe)' },
                { id: '1500+', label: '₹1,500+ (VIP Cakes & Hamper)' },
              ].map((range) => (
                <label
                  key={range.id}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === range.id}
                    onChange={() => {
                      setPriceRange(range.id);
                      setPage(1);
                    }}
                    className="text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                  />
                  <span className={`text-slate-700 ${priceRange === range.id ? 'font-bold text-red-600' : ''}`}>
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Catalog Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Single Unified Controls Bar: Search, Custom React Category Popover & View Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30 backdrop-blur-md bg-white/95">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[180px] sm:min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, code (SPK-101)..."
                className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Custom React Category Filter Popover */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-xs max-w-[190px] sm:max-w-[240px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="truncate">
                      {selectedCategory === 'all' ? 'All Crackers (Catalog)' : (categories.find(c => c.slug === selectedCategory || String(c.id) === String(selectedCategory))?.name || selectedCategory)}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-red-600' : ''}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-3rem)] sm:w-72 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-300 ring-1 ring-black/5 z-50 py-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/90 sticky top-0 backdrop-blur-md">
                      Select Product Category
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleCategorySelect('all');
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-rose-50 text-red-600 font-black'
                          : 'text-slate-800 hover:bg-slate-50 hover:text-red-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedCategory === 'all' && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                        <span>All Crackers (Catalog)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">All</span>
                    </button>

                    {categories.map((cat) => {
                      const catIdentifier = cat.slug || String(cat.id);
                      const isSelected = selectedCategory === catIdentifier || String(selectedCategory) === String(cat.id) || selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat.id || cat.slug}
                          type="button"
                          onClick={() => {
                            handleCategorySelect(catIdentifier);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-rose-50 text-red-600 font-black'
                              : 'text-slate-800 hover:bg-slate-50 hover:text-red-600'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate pr-2">
                            {isSelected && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                            <span className="truncate">{cat.name}</span>
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full shrink-0 ${isSelected ? 'bg-red-100 text-red-700 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* View Mode Switcher (Grid vs List) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-red-600 font-bold' : 'text-slate-500'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-red-600 font-bold' : 'text-slate-500'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.slice(0, 10).map((cat) => {
              const catIdentifier = cat.slug || String(cat.id);
              const isSelected = selectedCategory === catIdentifier || String(selectedCategory) === String(cat.id) || selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => handleCategorySelect(catIdentifier)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Product Catalog Display (Grid or List Mode) */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : productsData.products.length > 0 ? (
            <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"}>
              {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900">No Crackers Found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your active filters. Try searching with different terms or reset your filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Server-Side Pagination */}
          <Pagination
            currentPage={page}
            totalPages={
              productsData.totalPages ||
              productsData.total_pages ||
              Math.ceil((productsData.total || 0) / (productsData.limit || itemsPerPage || 1)) ||
              1
            }
            totalItems={productsData.total || 0}
            itemsPerPage={productsData.limit || itemsPerPage}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
            onItemsPerPageChange={(newLimit) => {
              setItemsPerPage(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 lg:hidden">
          <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Categories</h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      selectedCategory === cat.id ? 'bg-red-600 text-white font-bold' : 'text-slate-700'
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
