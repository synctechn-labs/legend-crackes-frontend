import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  AlertCircle,
  Loader2,
  X,
  Upload,
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { categoryService } from '../services/categoryService';
import { Pagination } from '../components/common/Pagination';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { CategoryManagementModal } from './CategoryManagementModal';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, calculateDiscount } from '../utils/formatters';

export const AdminInventory = () => {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [inventoryData, setInventoryData] = useState({
    products: [],
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, object = Edit
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, product: null });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const reloadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats || []);
      if (selectedCategory !== 'all' && cats && !cats.some(c => String(c.id) === String(selectedCategory) || c.slug === selectedCategory)) {
        setSelectedCategory('all');
      }
      loadInventory();
    } catch (err) {
      console.error('Failed to reload categories', err);
    }
  };

  // Form State
  const initialForm = {
    name: '',
    code: '',
    category: 'sparklers',
    categoryName: 'Sparklers',
    originalPrice: '',
    sellingPrice: '',
    myPrice: '',
    piecesPerBox: '10 Pieces per Pack',
    soundLevel: 'Zero Sound / Light',
    duration: '45 Seconds',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    description: '',
    isFeatured: false,
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  const debouncedSearch = useDebounce(searchQuery, 350);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Inventory items
  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getInventory({
        page,
        limit: 12,
        search: debouncedSearch,
        category: selectedCategory
      });
      setInventoryData(res);
    } catch (err) {
      console.error('Failed to load inventory', err);
      addToast({
        title: 'Inventory Load Error',
        message: 'Could not fetch catalog items from backend.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [page, debouncedSearch, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    const origP = product.originalPrice ?? product.original_price ?? '';
    const sellP = product.sellingPrice ?? product.selling_price ?? '';
    const myP = product.myPrice ?? product.my_price ?? origP;

    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      code: product.code || '',
      category: product.category || 'sparklers',
      categoryName: product.categoryName || 'Sparklers',
      originalPrice: origP,
      sellingPrice: sellP,
      myPrice: myP,
      piecesPerBox: product.piecesPerBox || '',
      soundLevel: product.soundLevel || '',
      duration: product.duration || '',
      image: product.image || '',
      description: product.description || '',
      isFeatured: !!product.isFeatured,
      isActive: product.isActive !== false
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.originalPrice || !formData.sellingPrice || formData.myPrice === '') {
      addToast({
        title: 'Validation Error',
        message: 'Name, Original Price (MRP), Factory Selling Price, and My Price (Cost Price) are required.',
        type: 'error'
      });
      return;
    }

    setSaving(true);
    const origP = parseFloat(formData.originalPrice);
    const sellP = parseFloat(formData.sellingPrice);
    const myP = parseFloat(formData.myPrice);
    const discount = calculateDiscount(origP, sellP);
    const catObj = categories.find(c => c.id === formData.category || String(c.id) === String(formData.category) || c.slug === formData.category);

    const payload = {
      ...formData,
      originalPrice: origP,
      sellingPrice: sellP,
      myPrice: myP,
      discount,
      category_id: catObj ? catObj.id : (typeof formData.category === 'number' ? formData.category : undefined),
      category: catObj ? catObj.slug : formData.category,
      categoryName: catObj ? catObj.name : formData.category
    };

    try {
      if (editingProduct) {
        await inventoryService.updateProduct(editingProduct.id, payload);
        addToast({
          title: 'Product Updated',
          message: `"${payload.name}" updated successfully.`,
          type: 'success'
        });
      } else {
        await inventoryService.createProduct(payload);
        addToast({
          title: 'Product Added',
          message: `"${payload.name}" added to Sivakasi catalog.`,
          type: 'success'
        });
      }
      setIsFormModalOpen(false);
      loadInventory();
    } catch (err) {
      addToast({
        title: 'Operation Failed',
        message: err.message || 'Could not save product.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle active/inactive
  const handleToggleStatus = async (product) => {
    const newStatus = !product.isActive;
    try {
      await inventoryService.toggleStatus(product.id, newStatus);
      addToast({
        title: newStatus ? 'Product Activated' : 'Product Deactivated',
        message: `${product.name} is now ${newStatus ? 'active' : 'inactive'}.`,
        type: 'info'
      });
      loadInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (product) => {
    const newFeatured = !product.isFeatured;
    try {
      await inventoryService.toggleFeatured(product.id, newFeatured);
      addToast({
        title: newFeatured ? 'Marked as Bestseller' : 'Removed from Bestsellers',
        message: `${product.name} featured status updated.`,
        type: 'info'
      });
      loadInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDeleteConfirm = async () => {
    if (!deleteModalState.product) return;
    try {
      await inventoryService.deleteProduct(deleteModalState.product.id);
      addToast({
        title: 'Product Removed',
        message: `"${deleteModalState.product.name}" deleted from catalog.`,
        type: 'success'
      });
      setDeleteModalState({ isOpen: false, product: null });
      loadInventory();
    } catch (err) {
      addToast({
        title: 'Delete Failed',
        message: err.message || 'Could not delete product.',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading text-slate-900">
            Sivakasi Inventory (3,000+ Products)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Server-side paginated inventory controller with instant stock & pricing overrides.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadInventory}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs"
            title="Refresh Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
            title="Manage and Delete Categories"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Cracker</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, category, or code (e.g. SPK-101)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              if (e.target.value === '__manage__') {
                setIsCategoryModalOpen(true);
                return;
              }
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="all">All Categories ({inventoryData.total.toLocaleString()})</option>
            {categories.filter(c => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="__manage__">⚙️ Manage & Delete Categories...</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3.5 px-4">Cracker</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing & Profit</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={6} />)
              ) : inventoryData.products.length > 0 ? (
                inventoryData.products.map((product) => {
                  const myP = product.myPrice ?? product.my_price ?? product.originalPrice ?? 0;
                  const sellP = product.sellingPrice ?? product.selling_price ?? 0;
                  const profitVal = sellP - myP;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {product.code || `SKF-${product.id}`}
                            </span>
                            <h4 className="font-bold text-slate-900 truncate mt-0.5">{product.name}</h4>
                            <span className="text-[11px] text-slate-400 block">{product.piecesPerBox}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {product.categoryName || product.category}
                      </td>

                      {/* Pricing & Profit */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400">MRP:</span>
                            <span className="text-[11px] text-slate-400 line-through">
                              {formatCurrency(product.originalPrice ?? product.original_price ?? 0)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-[10px] font-bold text-emerald-600">
                                ({product.discount}% OFF)
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Selling:</span>
                            <span className="font-extrabold text-red-600 font-heading">
                              {formatCurrency(sellP)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400">My Price:</span>
                            <span className="text-[11px] font-semibold text-slate-600">
                              {formatCurrency(myP)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1.5 pt-0.5 border-t border-slate-100">
                            <span className="text-[10px] uppercase font-extrabold text-emerald-700">Profit:</span>
                            <span className={`text-[11px] font-black ${profitVal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {formatCurrency(profitVal)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Toggle Bestseller status"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              product.isFeatured
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Active Status Switch */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                            product.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {product.isActive !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Edit Cracker"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModalState({ isOpen: true, product })}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Cracker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No crackers found matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={inventoryData.page}
            totalPages={inventoryData.totalPages}
            totalItems={inventoryData.total}
            itemsPerPage={inventoryData.limit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-xl text-slate-900">
                  {editingProduct ? 'Edit Cracker Product' : 'Add New Cracker to Inventory'}
                </h3>
                <p className="text-xs text-slate-500">
                  Sivakasi production catalog details & pricing configuration
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 15cm Electric Sparklers"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. SPK-101"
                    className="w-full px-3.5 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original Price (MRP ₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="100"
                    required
                    min="1"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Shown to public customers crossed out (MRP).</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Factory Selling Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="50"
                    required
                    min="1"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Actual price customer pays.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    My Price (Cost Price ₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.myPrice}
                    onChange={(e) => setFormData({ ...formData, myPrice: e.target.value })}
                    placeholder="30"
                    required
                    min="0"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Internal cost. Used for profit calculation. Hidden from users.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pieces Per Box / Packing
                  </label>
                  <input
                    type="text"
                    value={formData.piecesPerBox}
                    onChange={(e) => setFormData({ ...formData, piecesPerBox: e.target.value })}
                    placeholder="10 Pieces per Box"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                    />
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Safety Advice
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description of the cracker display, sound, and safety advice..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                    />
                    <span>Mark as Featured / Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                    />
                    <span>Visible in Public Storefront (Active)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        title="Delete Cracker Product?"
        message={`Are you sure you want to remove "${deleteModalState.product?.name}" (${deleteModalState.product?.code}) from the Sivakasi catalog?`}
        confirmText="Yes, Delete Product"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalState({ isOpen: false, product: null })}
      />

      {/* Category Management Modal (View, Add, Delete Categories) */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCategoriesUpdated={reloadCategories}
      />
    </div>
  );
};
