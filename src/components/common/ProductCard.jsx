import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const origP = Number(product.originalPrice ?? product.original_price ?? 0);
  const sellP = Number(product.sellingPrice ?? product.selling_price ?? 0);
  const calculatedDiscount = origP > sellP && origP > 0 ? Math.round(((origP - sellP) / origP) * 100) : 0;
  const discountVal = calculatedDiscount > 0 ? calculatedDiscount : Number(product.discount || product.discount_percentage || 0);
  const packingVal = product.piecesPerBox || product.pieces_per_box || product.unit || 'Sivakasi Pack';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, qty);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, qty, true);
    navigate('/checkout');
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      {/* Top Badges */}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            Bestseller
          </span>
        </div>
      )}

      <div className="absolute top-3 right-3 z-10">
        <span className="bg-white/90 backdrop-blur-xs text-slate-700 text-xs font-mono font-medium px-2 py-0.5 rounded-md border border-slate-200">
          {product.code || `SKF-${product.id}`}
        </span>
      </div>

      {/* Product Image with Lazy Loading */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-slate-100 aspect-4/3">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Product Details Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Discount Percentage */}
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
          <Link
            to={`/shop?category=${product.category}`}
            className="text-red-700 font-semibold uppercase tracking-wider hover:underline truncate"
          >
            {product.categoryName || product.category}
          </Link>
          {discountVal > 0 && (
            <span className="bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider shrink-0">
              {discountVal}% OFF
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="group-hover:text-red-600 transition-colors">
          <h3 className="font-heading font-bold text-slate-900 text-base leading-snug line-clamp-2 min-h-11">
            {product.name}
          </h3>
        </Link>

        {/* Secondary Specs: Pieces & Sound */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">
            {packingVal}
          </span>
          {product.soundLevel && (
            <span className="truncate text-slate-400 text-[11px]">• {product.soundLevel}</span>
          )}
        </div>

        {/* Price Row (Public user sees Factory Selling Price & Original Price MRP) */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-baseline justify-between flex-wrap gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl font-extrabold text-red-600 font-heading">
              {formatCurrency(sellP)}
            </span>
            {origP > 0 && origP > sellP && (
              <span className="text-xs text-slate-400 line-through">
                MRP {formatCurrency(origP)}
              </span>
            )}
            {origP > 0 && origP <= sellP && (
              <span className="text-xs text-slate-400">
                MRP {formatCurrency(origP)}
              </span>
            )}
            {origP === 0 && (
              <span className="text-xs text-slate-400">
                MRP {formatCurrency(sellP)}
              </span>
            )}
          </div>
          {origP > sellP && (
            <span className="text-[11px] text-emerald-600 font-semibold">
              Save {formatCurrency(origP - sellP)}
            </span>
          )}
        </div>

        {/* Action Controls: Quantity + Add to Cart & Buy Now */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
              >
                -
              </button>
              <span className="w-7 text-center text-xs font-semibold text-slate-800">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {isAdding ? 'Added!' : 'Add to Bag'}
            </button>
          </div>

          {/* Direct Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Buy Now Direct
          </button>
        </div>
      </div>
    </div>
  );
};
