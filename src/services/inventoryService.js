import apiClient, { executeApi } from './api';
import { queryMockProducts, getOrInitCatalog, getMockProductById } from '../utils/mockData';

export const inventoryService = {
  // Get paginated inventory products for admin
  getInventory: async ({ page = 1, limit = 15, search = '', category = 'all', inStockOnly = false, sortBy = 'new' }) => {
    const params = { page, limit, search, category, sort_by: sortBy };
    if (inStockOnly) {
      params.in_stock = true;
    }
    return executeApi(
      () => apiClient.get('/admin/inventory', { params }),
      () => queryMockProducts({ page, limit, search, category, inStockOnly, sortBy })
    );
  },

  // Add new product
  createProduct: async (productData) => {
    const origPriceVal = Number(productData.originalPrice ?? productData.original_price ?? 0);
    const sellPriceVal = Number(productData.sellingPrice ?? productData.selling_price ?? 0);
    const myPriceVal = Number(productData.myPrice ?? productData.my_price ?? origPriceVal);

    const unitVal = productData.piecesPerBox || productData.unit || 'Box';

    const payload = {
      ...productData,
      name: productData.name,
      product_code: productData.code || productData.product_code || undefined,
      original_price: origPriceVal,
      selling_price: sellPriceVal,
      my_price: myPriceVal,
      discount_percentage: Number(productData.discount ?? productData.discount_percentage ?? 0),
      stock_quantity: 99999,
      image_url: productData.image || productData.image_url || undefined,
      unit: unitVal,
      piecesPerBox: unitVal,
      is_featured: !!productData.isFeatured,
      is_active: productData.isActive !== false
    };
    return executeApi(
      () => apiClient.post('/admin/inventory', payload),
      () => {
        const stored = JSON.parse(localStorage.getItem('sivakasi_crackers_products_v1') || '[]');
        const newId = 10000 + stored.length + 1;
        const newProduct = {
          id: newId,
          ...productData,
          originalPrice: origPriceVal,
          sellingPrice: sellPriceVal,
          myPrice: myPriceVal,
          piecesPerBox: unitVal,
          rating: 5.0,
          reviewsCount: 1,
          createdAt: new Date().toISOString()
        };
        const updated = [newProduct, ...stored];
        localStorage.setItem('sivakasi_crackers_products_v1', JSON.stringify(updated));
        return newProduct;
      }
    );
  },

  // Update existing product
  updateProduct: async (id, updates) => {
    const payload = { ...updates };
    if ('originalPrice' in updates) payload.original_price = Number(updates.originalPrice);
    if ('sellingPrice' in updates) payload.selling_price = Number(updates.sellingPrice);
    if ('myPrice' in updates) payload.my_price = Number(updates.myPrice);
    if ('piecesPerBox' in updates) {
      payload.unit = updates.piecesPerBox;
      payload.piecesPerBox = updates.piecesPerBox;
    }
    payload.stock_quantity = 99999;
    if ('image' in updates) payload.image_url = updates.image;
    if ('code' in updates) payload.product_code = updates.code;
    if ('isActive' in updates) payload.is_active = updates.isActive;
    if ('isFeatured' in updates) payload.is_featured = updates.isFeatured;
    if ('discount' in updates) payload.discount_percentage = updates.discount;

    return executeApi(
      () => apiClient.put(`/admin/inventory/${id}`, payload),
      () => {
        const numId = parseInt(id, 10);
        const stored = JSON.parse(localStorage.getItem('sivakasi_crackers_products_v1') || '[]');
        const idx = stored.findIndex(p => p.id === numId);
        
        let target;
        if (idx !== -1) {
          stored[idx] = { ...stored[idx], ...updates };
          localStorage.setItem('sivakasi_crackers_products_v1', JSON.stringify(stored));
          target = stored[idx];
        } else {
          // It was a virtual generated product, now save override in custom products
          const original = getMockProductById(numId);
          target = { ...original, ...updates };
          stored.unshift(target);
          localStorage.setItem('sivakasi_crackers_products_v1', JSON.stringify(stored));
        }
        return target;
      }
    );
  },

  // Quick inline update for stock
  updateStock: async (id, stock) => {
    return inventoryService.updateProduct(id, { stock: parseInt(stock, 10) });
  },

  // Quick inline update for price
  updatePrice: async (id, sellingPrice, originalPrice) => {
    const discount = originalPrice > sellingPrice ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;
    return inventoryService.updateProduct(id, {
      sellingPrice: parseFloat(sellingPrice),
      originalPrice: parseFloat(originalPrice),
      discount
    });
  },

  // Toggle active/inactive
  toggleStatus: async (id, isActive) => {
    return inventoryService.updateProduct(id, { isActive });
  },

  // Toggle featured flag
  toggleFeatured: async (id, isFeatured) => {
    return inventoryService.updateProduct(id, { isFeatured });
  },

  // Delete product
  deleteProduct: async (id) => {
    return executeApi(
      () => apiClient.delete(`/admin/inventory/${id}`),
      () => {
        const numId = parseInt(id, 10);
        let stored = JSON.parse(localStorage.getItem('sivakasi_crackers_products_v1') || '[]');
        stored = stored.filter(p => p.id !== numId);
        localStorage.setItem('sivakasi_crackers_products_v1', JSON.stringify(stored));
        return { success: true, id: numId };
      }
    );
  }
};
