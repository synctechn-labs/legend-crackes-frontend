import apiClient, { executeApi } from './api';
import { CATEGORIES, getCategoryImage } from '../utils/constants';

const STORAGE_KEY = 'sivakasi_categories_v1';

const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read stored categories', e);
  }
  return [...CATEGORIES];
};

const saveStoredCategories = (cats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save categories to storage', e);
  }
};

export const categoryService = {
  // Fetch dynamic categories list
  getCategories: async () => {
    return executeApi(
      async () => {
        const res = await apiClient.get('/categories');
        const list = Array.isArray(res.data) ? res.data : [];
        const normalized = list.map(c => ({
          ...c,
          id: c.id,
          slug: c.slug || String(c.id),
          name: c.name,
          count: c.product_count ?? c.count ?? 0,
          desc: c.description || c.desc || '',
          image: c.image || c.logo || c.icon_url || getCategoryImage(c)
        }));
        const hasAll = normalized.some(c => String(c.id) === 'all' || c.slug === 'all');
        const totalItems = normalized.reduce((acc, curr) => acc + (curr.count || 0), 0);
        const result = hasAll
          ? normalized
          : [{ id: 'all', slug: 'all', name: 'All Crackers', count: totalItems }, ...normalized];
        saveStoredCategories(result);
        return result;
      },
      () => getStoredCategories()
    );
  },

  // Fetch category details / metadata
  getCategoryById: async (id) => {
    return executeApi(
      async () => {
        const res = await apiClient.get(`/categories/${id}`);
        const cat = res.data;
        return {
          ...cat,
          count: cat.product_count ?? cat.count ?? 0,
          desc: cat.description || cat.desc || ''
        };
      },
      () => {
        const cats = getStoredCategories();
        const cat = cats.find(c => String(c.id) === String(id) || c.slug === id);
        if (!cat) throw new Error('Category not found');
        return cat;
      }
    );
  },

  // Create new category
  createCategory: async (categoryData) => {
    return executeApi(
      async () => {
        const res = await apiClient.post('/categories', categoryData);
        const newCat = res.data;
        const normalized = {
          ...newCat,
          count: newCat.product_count ?? newCat.count ?? 0,
          desc: newCat.description || newCat.desc || ''
        };
        const current = getStoredCategories();
        if (!current.some(c => c.id === normalized.id)) {
          saveStoredCategories([...current, normalized]);
        }
        return normalized;
      },
      () => {
        const cats = getStoredCategories();
        const slug = categoryData.slug || categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        const newCat = {
          id: slug,
          name: categoryData.name.trim(),
          slug,
          count: 0,
          desc: categoryData.description || categoryData.desc || '',
          icon: categoryData.icon || 'Sparkles',
          isNew: true
        };
        const updated = [...cats, newCat];
        saveStoredCategories(updated);
        return newCat;
      }
    );
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    return executeApi(
      async () => {
        const res = await apiClient.put(`/categories/${id}`, categoryData);
        const updatedCat = res.data;
        const normalized = {
          ...updatedCat,
          count: updatedCat.product_count ?? updatedCat.count ?? 0,
          desc: updatedCat.description || updatedCat.desc || ''
        };
        const current = getStoredCategories();
        const idx = current.findIndex(c => String(c.id) === String(id) || c.slug === id);
        if (idx !== -1) {
          current[idx] = normalized;
          saveStoredCategories(current);
        }
        return normalized;
      },
      () => {
        const cats = getStoredCategories();
        const idx = cats.findIndex(c => String(c.id) === String(id) || c.slug === id);
        if (idx === -1) throw new Error('Category not found');
        const updatedCat = { ...cats[idx], ...categoryData };
        cats[idx] = updatedCat;
        saveStoredCategories(cats);
        return updatedCat;
      }
    );
  },

  // Delete category
  deleteCategory: async (id) => {
    return executeApi(
      async () => {
        const res = await apiClient.delete(`/categories/${id}`);
        const current = getStoredCategories();
        const filtered = current.filter(c => String(c.id) !== String(id) && c.slug !== id);
        saveStoredCategories(filtered);
        return res.data;
      },
      () => {
        const cats = getStoredCategories();
        const catToDelete = cats.find(c => String(c.id) === String(id) || c.slug === id);
        if (!catToDelete) throw new Error('Category not found');
        if (catToDelete.id === 'all') throw new Error('Cannot delete default "All Crackers" category');

        const filtered = cats.filter(c => String(c.id) !== String(id) && c.slug !== id);
        saveStoredCategories(filtered);
        return { success: true, message: `Category "${catToDelete.name}" deleted successfully.` };
      }
    );
  }
};
