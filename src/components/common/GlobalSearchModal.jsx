import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedSearch || debouncedSearch.trim().length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await productService.searchProducts(debouncedSearch);
        setResults(data || []);
      } catch (err) {
        console.error('Search error', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [debouncedSearch]);

  const handleSelectProduct = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center p-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-red-600 shrink-0 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 500+ crackers by name, category, or code (e.g. SPK-101)..."
            className="w-full px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none text-base font-medium"
          />
          {loading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin shrink-0 mr-2" />}
          {searchTerm && !loading && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Quick Suggestions / Results */}
        <div className="overflow-y-auto p-4 flex-1 space-y-3">
          {searchTerm.trim().length < 2 ? (
            <div className="py-8 text-center text-slate-500">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium text-slate-700">Quick Search across Sivakasi Fireworks Catalog</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Sparklers', 'Hydro Green Bomb', '30-Shots Sky Spectacle', 'Gift Box', 'SPK-101', 'Flower Pots'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchTerm(tag)}
                    className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Products Found</p>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50/70 border border-transparent hover:border-red-100 cursor-pointer transition-all group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {product.code}
                      </span>
                      <span className="text-xs font-medium text-red-600 truncate">{product.categoryName}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                      {product.name}
                    </h4>
                    {(product.tamilName || product.tamil_name) && (
                      <span className="text-xs font-semibold text-red-600 block truncate leading-tight">
                        {product.tamilName || product.tamil_name}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900">{formatCurrency(product.sellingPrice)}</div>
                    {product.discount > 0 && (
                      <div className="text-[11px] text-emerald-600 font-semibold">{product.discount}% OFF</div>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full mt-2 py-2.5 text-center text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                View all results for "{searchTerm}" in Shop
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !loading ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No crackers matching "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by category, fireworks name, or code</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
