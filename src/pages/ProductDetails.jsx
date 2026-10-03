import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Flame,
  Package,
  AlertTriangle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);

        // Fetch related crackers in same category
        if (prod?.category) {
          const related = await productService.getProducts({
            page: 1,
            limit: 4,
            category: prod.category,
          });
          setRelatedProducts(related.products?.filter((p) => p.id !== prod.id) || []);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-4 bg-slate-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 h-96 bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-slate-800">Cracker Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for is no longer available in our inventory.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cracker Catalog</span>
        </Link>
      </div>
    );
  }

  const origP = Number(product.originalPrice ?? product.original_price ?? 0);
  const sellP = Number(product.sellingPrice ?? product.selling_price ?? 0);
  const calculatedDiscount = origP > sellP && origP > 0 ? Math.round(((origP - sellP) / origP) * 100) : 0;
  const discountVal = calculatedDiscount > 0 ? calculatedDiscount : Number(product.discount || product.discount_percentage || 0);
  const packingVal = product.piecesPerBox || product.pieces_per_box || product.unit || 'Sivakasi Pack';

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, qty);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = () => {
    addToCart(product, qty, true);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-red-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-red-600">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-red-600">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg aspect-4/3 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discountVal > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-semiblod text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {discountVal}% FACTORY DISCOUNT
              </span>
            )}
            <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
              {product.code}
            </span>
          </div>

          {/* Guarantee Badges Row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">100% Sivakasi Origin</span>
              <span className="text-[10px] text-slate-400">PESO Approved</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center">
              <Truck className="w-5 h-5 text-amber-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Safe Packaging</span>
              <span className="text-[10px] text-slate-400">Non-Hazardous Box</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center">
              <RotateCcw className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Tested Zero Duds</span>
              <span className="text-[10px] text-slate-400">100% Burst Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-bold text-red-600 uppercase tracking-wider hover:underline"
              >
                {product.categoryName}
              </Link>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Code: {product.code}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-slate-900 leading-tight">
              {product.name}
            </h1>
            {(product.tamilName || product.tamil_name) && (
              <h2 className="text-lg sm:text-xl font-bold text-red-600 font-sans mt-1">
                {product.tamilName || product.tamil_name}
              </h2>
            )}


          </div>

          {/* Pricing Box (Public customer view) */}
          <div className="p-5 rounded-2xl bg-red-50/70 border border-red-100 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-red-600 font-heading">
                {formatCurrency(sellP)}
              </span>
              {origP > 0 && origP > sellP && (
                <span className="ml-3 text-base text-slate-400 line-through">
                  MRP {formatCurrency(origP)}
                </span>
              )}
              {origP > 0 && origP <= sellP && (
                <span className="ml-3 text-base text-slate-400">
                  MRP {formatCurrency(origP)}
                </span>
              )}
              {origP === 0 && (
                <span className="ml-3 text-base text-slate-400">
                  MRP {formatCurrency(sellP)}
                </span>
              )}
            </div>
            <div className="text-right">
              {discountVal > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                  {discountVal}% OFF
                </span>
              )}
              {origP > sellP && (
                <span className="block text-xs font-bold text-emerald-700 mt-1">
                  You save {formatCurrency(origP - sellP)}
                </span>
              )}
            </div>
          </div>

          {/* Specifications Pills */}
          <div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block min-w-[200px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Packing</span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Package className="w-3.5 h-3.5 text-red-500" />
                {packingVal}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Product Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Row: Quantity + Add to Cart + Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-slate-300 rounded-2xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 text-lg rounded-xl hover:bg-white transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:text-slate-900 text-lg rounded-xl hover:bg-white transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 py-3.5 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdding ? 'Adding to Bag...' : 'Add to Festive Bag'}</span>
              </button>
            </div>

            {/* Direct Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Buy Now (Direct Checkout)</span>
            </button>
          </div>

          {/* Safety Advice Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-800 uppercase tracking-wider text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Safety Instructions
            </span>
            <p className="leading-relaxed text-slate-700">
              {product.safetyTips || 'Light with agarbatti from safe distance outdoors. Do not bend over the fireworks.'}
            </p>
          </div>
        </div>
      </div>

      {/* Related Crackers Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-2xl text-slate-900">
              Related {product.categoryName}
            </h3>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View All {product.categoryName} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
