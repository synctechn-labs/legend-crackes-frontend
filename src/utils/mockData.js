// Empty baseline product data for manual data entry
const BASE_PRODUCTS = [];

// In-memory or localStorage-backed products repository
const LOCAL_STORAGE_KEY = 'sivakasi_crackers_products_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'sivakasi_crackers_orders_v1';

// Clear legacy mock seeds from local storage if present
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const legacyStored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (legacyStored && (legacyStored.includes('SPK-101') || legacyStored.includes('15cm Electric Sparklers'))) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    const legacyOrders = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (legacyOrders && legacyOrders.includes('Ramesh Sundaram')) {
      localStorage.removeItem(LOCAL_STORAGE_ORDERS_KEY);
    }
  } catch (e) {
    // Ignore storage quota or SSR errors
  }
}

export const getOrInitCatalog = () => {
  const customProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  return customProducts;
};

export const TOTAL_CATALOG_SIZE = 0;

export const generateVirtualProduct = (index) => {
  return null;
};

// Query local products
export const queryMockProducts = ({
  page = 1,
  limit = 12,
  category = 'all',
  search = '',
  sortBy = 'new',
  priceMin = 0,
  priceMax = 100000
}) => {
  const customProducts = getOrInitCatalog();
  const searchLower = search.trim().toLowerCase();

  let filtered = customProducts.filter(p => {
    if (category && category !== 'all' && p.category !== category && String(p.category_id) !== String(category)) {
      return false;
    }
    if (searchLower) {
      const matchName = (p.name || '').toLowerCase().includes(searchLower);
      const matchCat = (p.categoryName || p.category || '').toLowerCase().includes(searchLower);
      const matchCode = (p.code || p.product_code || '').toLowerCase().includes(searchLower);
      if (!matchName && !matchCat && !matchCode) return false;
    }
    const sellP = p.sellingPrice ?? p.selling_price ?? 0;
    if (sellP < priceMin || sellP > priceMax) return false;
    return true;
  });

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.sellingPrice ?? 0) - (b.sellingPrice ?? 0));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.sellingPrice ?? 0) - (a.sellingPrice ?? 0));
  } else if (sortBy === 'new') {
    filtered.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    page: safePage,
    limit,
    total,
    totalPages
  };
};

export const getMockProductById = (id) => {
  const numId = parseInt(id, 10);
  return getOrInitCatalog().find(p => p.id === numId) || null;
};

export const SEED_ORDERS = [];

export const getStoredOrders = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored);
};

export const saveNewOrder = (orderData) => {
  const orders = getStoredOrders();
  const updated = [orderData, ...orders];
  localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  return orderData;
};

export const updateOrderStatusInMock = (orderId, newStatus) => {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = newStatus;
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    return orders[index];
  }
  return null;
};
