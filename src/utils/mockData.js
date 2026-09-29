// Rich baseline product catalog (used when backend is offline or localStorage is empty)
const BASE_PRODUCTS = [
  { id: 101, code: 'SPK-101', product_code: 'SPK-101', name: '15cm Electric Sparklers', category: 'sparklers-flower-pots', category_id: 1, categoryName: 'Sparklers & Flower Pots', original_price: 1000, selling_price: 200, originalPrice: 1000, sellingPrice: 200, discount_percentage: 80, stock_quantity: 450, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&auto=format&fit=crop&q=80' },
  { id: 102, code: 'SPK-102', product_code: 'SPK-102', name: '30cm Crackling Sparklers', category: 'sparklers-flower-pots', category_id: 1, categoryName: 'Sparklers & Flower Pots', original_price: 1200, selling_price: 350, originalPrice: 1200, sellingPrice: 350, discount_percentage: 70, stock_quantity: 320, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&auto=format&fit=crop&q=80' },
  { id: 103, code: 'SPK-103', product_code: 'SPK-103', name: '50cm Giant Golden Sparklers', category: 'sparklers-flower-pots', category_id: 1, categoryName: 'Sparklers & Flower Pots', original_price: 1400, selling_price: 490, originalPrice: 1400, sellingPrice: 490, discount_percentage: 65, stock_quantity: 210, unit: 'Box (5 Pcs)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&auto=format&fit=crop&q=80' },
  { id: 201, code: 'CHK-201', product_code: 'CHK-201', name: 'Standard Ground Chakkar Special', category: 'ground-chakkars', category_id: 2, categoryName: 'Ground Chakkars & Spinners', original_price: 600, selling_price: 180, originalPrice: 600, sellingPrice: 180, discount_percentage: 70, stock_quantity: 500, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80' },
  { id: 202, code: 'CHK-202', product_code: 'CHK-202', name: 'Deluxe Zamin Chakkar', category: 'ground-chakkars', category_id: 2, categoryName: 'Ground Chakkars & Spinners', original_price: 850, selling_price: 290, originalPrice: 850, sellingPrice: 290, discount_percentage: 66, stock_quantity: 280, unit: 'Box (10 Pcs)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80' },
  { id: 203, code: 'CHK-203', product_code: 'CHK-203', name: 'Speed Wheel Spinner', category: 'ground-chakkars', category_id: 2, categoryName: 'Ground Chakkars & Spinners', original_price: 900, selling_price: 320, originalPrice: 900, sellingPrice: 320, discount_percentage: 64, stock_quantity: 190, unit: 'Box (10 Pcs)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80' },
  { id: 301, code: 'POT-301', product_code: 'POT-301', name: 'Flower Pot Special', category: 'sparklers-flower-pots', category_id: 1, categoryName: 'Sparklers & Flower Pots', original_price: 800, selling_price: 250, originalPrice: 800, sellingPrice: 250, discount_percentage: 68, stock_quantity: 400, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&auto=format&fit=crop&q=80' },
  { id: 302, code: 'POT-302', product_code: 'POT-302', name: 'Flower Pot Deluxe Ashoka', category: 'sparklers-flower-pots', category_id: 1, categoryName: 'Sparklers & Flower Pots', original_price: 1100, selling_price: 380, originalPrice: 1100, sellingPrice: 380, discount_percentage: 65, stock_quantity: 310, unit: 'Box (10 Pcs)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&auto=format&fit=crop&q=80' },
  { id: 303, code: 'POT-303', product_code: 'POT-303', name: 'Colour Koti Fountain', category: 'sparklers-flower-pots', category_id: 1, categoryName: 'Sparklers & Flower Pots', original_price: 1300, selling_price: 450, originalPrice: 1300, sellingPrice: 450, discount_percentage: 65, stock_quantity: 150, unit: 'Box (5 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&auto=format&fit=crop&q=80' },
  { id: 401, code: 'BMB-401', product_code: 'BMB-401', name: 'Atom Bomb Classic (10 Pcs)', category: 'sound-crackers', category_id: 3, categoryName: 'Sound Crackers & Bombs', original_price: 650, selling_price: 210, originalPrice: 650, sellingPrice: 210, discount_percentage: 67, stock_quantity: 600, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1576400883215-7083980b6197?w=600&auto=format&fit=crop&q=80' },
  { id: 402, code: 'BMB-402', product_code: 'BMB-402', name: 'Hydro Bomb Sounder', category: 'sound-crackers', category_id: 3, categoryName: 'Sound Crackers & Bombs', original_price: 950, selling_price: 340, originalPrice: 950, sellingPrice: 340, discount_percentage: 64, stock_quantity: 420, unit: 'Box (10 Pcs)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1576400883215-7083980b6197?w=600&auto=format&fit=crop&q=80' },
  { id: 403, code: 'BMB-403', product_code: 'BMB-403', name: '2-Sound Thunder King', category: 'sound-crackers', category_id: 3, categoryName: 'Sound Crackers & Bombs', original_price: 1200, selling_price: 420, originalPrice: 1200, sellingPrice: 420, discount_percentage: 65, stock_quantity: 260, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1576400883215-7083980b6197?w=600&auto=format&fit=crop&q=80' },
  { id: 501, code: 'GAR-501', product_code: 'GAR-501', name: '100 Wala Red Garland', category: 'garlands-wala', category_id: 4, categoryName: 'Garlands & Wala', original_price: 450, selling_price: 150, originalPrice: 450, sellingPrice: 150, discount_percentage: 66, stock_quantity: 550, unit: 'Pack (1 Roll)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80' },
  { id: 502, code: 'GAR-502', product_code: 'GAR-502', name: '1000 Wala Deluxe Garland', category: 'garlands-wala', category_id: 4, categoryName: 'Garlands & Wala', original_price: 2500, selling_price: 850, originalPrice: 2500, sellingPrice: 850, discount_percentage: 66, stock_quantity: 180, unit: 'Pack (1 Roll)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80' },
  { id: 503, code: 'GAR-503', product_code: 'GAR-503', name: '5000 Wala Royal Gala Lari', category: 'garlands-wala', category_id: 4, categoryName: 'Garlands & Wala', original_price: 7500, selling_price: 2900, originalPrice: 7500, sellingPrice: 2900, discount_percentage: 61, stock_quantity: 80, unit: 'Pack (1 Roll)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80' },
  { id: 601, code: 'ARS-601', product_code: 'ARS-601', name: 'Single Sky Shot Shell', category: 'aerial-shots', category_id: 5, categoryName: 'Aerial & Fancy Sky Shots', original_price: 800, selling_price: 280, originalPrice: 800, sellingPrice: 280, discount_percentage: 65, stock_quantity: 340, unit: 'Box (1 Piece)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=600&auto=format&fit=crop&q=80' },
  { id: 602, code: 'ARS-602', product_code: 'ARS-602', name: '7-Colour Comet Sky Shell', category: 'aerial-shots', category_id: 5, categoryName: 'Aerial & Fancy Sky Shots', original_price: 1800, selling_price: 650, originalPrice: 1800, sellingPrice: 650, discount_percentage: 63, stock_quantity: 220, unit: 'Box (1 Piece)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=600&auto=format&fit=crop&q=80' },
  { id: 701, code: 'MLS-701', product_code: 'MLS-701', name: '12 Shots Sky Bloom Cake', category: 'multi-shots', category_id: 6, categoryName: 'Multi-Shot Sky Symphony Cakes', original_price: 2800, selling_price: 950, originalPrice: 2800, sellingPrice: 950, discount_percentage: 66, stock_quantity: 140, unit: 'Deluxe Cake Box', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80' },
  { id: 702, code: 'MLS-702', product_code: 'MLS-702', name: '30 Shots Royal Symphony Cake', category: 'multi-shots', category_id: 6, categoryName: 'Multi-Shot Sky Symphony Cakes', original_price: 4900, selling_price: 1850, originalPrice: 4900, sellingPrice: 1850, discount_percentage: 62, stock_quantity: 90, unit: 'Deluxe Cake Box', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80' },
  { id: 703, code: 'MLS-703', product_code: 'MLS-703', name: '60 Shots Night Wonder Cake', category: 'multi-shots', category_id: 6, categoryName: 'Multi-Shot Sky Symphony Cakes', original_price: 8500, selling_price: 3400, originalPrice: 8500, sellingPrice: 3400, discount_percentage: 60, stock_quantity: 55, unit: 'Deluxe Cake Box', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80' },
  { id: 801, code: 'RCK-801', product_code: 'RCK-801', name: 'Whistling Sky Rocket (10 Pcs)', category: 'rockets', category_id: 7, categoryName: 'Rockets & Missiles', original_price: 1100, selling_price: 390, originalPrice: 1100, sellingPrice: 390, discount_percentage: 64, stock_quantity: 380, unit: 'Box (10 Pcs)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80' },
  { id: 802, code: 'RCK-802', product_code: 'RCK-802', name: 'Parachute Flare Rocket', category: 'rockets', category_id: 7, categoryName: 'Rockets & Missiles', original_price: 1500, selling_price: 580, originalPrice: 1500, sellingPrice: 580, discount_percentage: 61, stock_quantity: 200, unit: 'Box (10 Pcs)', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80' },
  { id: 901, code: 'KID-901', product_code: 'KID-901', name: 'Magic Whip & Cartoon Roll Caps', category: 'kids-specials', category_id: 8, categoryName: 'Kids Special & Novelties', original_price: 350, selling_price: 120, originalPrice: 350, sellingPrice: 120, discount_percentage: 65, stock_quantity: 700, unit: 'Box (1 Pack)', is_featured: false, is_active: true, image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80' },
  { id: 999, code: 'GFT-999', product_code: 'GFT-999', name: 'Family Festive Treasure Gift Box', category: 'gift-boxes', category_id: 9, categoryName: 'Gift Boxes & Family Combos', original_price: 6500, selling_price: 2450, originalPrice: 6500, sellingPrice: 2450, discount_percentage: 62, stock_quantity: 110, unit: 'Gift Hamper Case', is_featured: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' }
];

// In-memory or localStorage-backed products repository
const LOCAL_STORAGE_KEY = 'sivakasi_crackers_products_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'sivakasi_crackers_orders_v1';

// Clear legacy mock seeds from local storage if present
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const legacyStored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (legacyStored && (legacyStored.includes('SPK-101') || legacyStored.includes('15cm Electric Sparklers') || JSON.parse(legacyStored).length < 5)) {
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
  try {
    const customProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    if (customProducts && customProducts.length >= 6) {
      return customProducts;
    }
  } catch (e) {
    // Fallback to baseline
  }
  return BASE_PRODUCTS;
};

export const TOTAL_CATALOG_SIZE = BASE_PRODUCTS.length;

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
