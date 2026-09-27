import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle,
  FolderOpen,
  Search,
  Tag
} from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { useToast } from '../hooks/useToast';

export const CategoryManagementModal = ({
  isOpen,
  onClose,
  categories = [],
  onCategoriesUpdated
}) => {
  const { addToast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category to delete state
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      addToast({
        title: 'Validation Error',
        message: 'Category name is required.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await categoryService.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        desc: newCatDesc.trim(),
      });
      addToast({
        title: 'Category Created',
        message: `Category "${newCatName.trim()}" added successfully.`,
        type: 'success'
      });
      setNewCatName('');
      setNewCatDesc('');
      setIsAdding(false);
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err) {
      addToast({
        title: 'Failed to Add Category',
        message: err.message || 'Could not create category.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      addToast({
        title: 'Category Deleted',
        message: `Category "${categoryToDelete.name}" was successfully removed.`,
        type: 'success'
      });
      setCategoryToDelete(null);
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (err) {
      addToast({
        title: 'Delete Failed',
        message: err.message || 'Could not delete category.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const validCategories = categories.filter(c => c.id !== 'all');
  const filteredCategories = validCategories.filter(cat =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (cat.desc && cat.desc.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-red-50/20 to-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight font-heading">
                  Manage Cracker Categories
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  View, create, or delete product departments across the store catalog
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Add Category Trigger / Form */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
            {!isAdding ? (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 shadow-2xs"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="w-full sm:w-auto py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-red-200 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddCategory} className="space-y-3 bg-white p-4 rounded-2xl border border-red-200 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" /> Create New Department
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category Name *</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Electric Sparklers"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description / Tagline</label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="e.g. Dazzling color sparklers for all ages"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1.5 shadow-sm shadow-red-200 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between items-center px-1">
              <span>Categories ({filteredCategories.length})</span>
              <span>Action</span>
            </div>

            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-red-50/30 rounded-2xl transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{cat.name}</p>
                        {cat.isNew && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                            New
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {cat.count ?? cat.product_count ?? 0} items
                        </span>
                      </div>
                      {(cat.desc || cat.description) && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{cat.desc || cat.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Delete Category Action */}
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100/70 rounded-xl transition-colors shrink-0"
                    title={`Delete category ${cat.name}`}
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No categories match "{filterQuery}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Deleting a category dissociates products without removing them.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deleting Category */}
      <ConfirmationModal
        isOpen={!!categoryToDelete}
        title={`Delete Category "${categoryToDelete?.name}"?`}
        message={`Are you sure you want to delete the "${categoryToDelete?.name}" category? Products currently assigned to this category will stay intact but become unassigned.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDeleteCategory}
        onClose={() => setCategoryToDelete(null)}
      />
    </>
  );
};

