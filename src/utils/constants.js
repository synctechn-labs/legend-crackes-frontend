export const MIN_ORDER_AMOUNT = 3000;
export const BRAND_LOGO_URL = 'https://res.cloudinary.com/yez0xdym/image/upload/v1790708530/1000240064.png';
export const CONTACT_PHONE = '+91 70108 49600';
export const CONTACT_PHONE_RAW = '7010849600';
export const WHATSAPP_LINK = 'https://wa.me/917010849600';

export const CATEGORY_IMAGE_MAP = {
  'bomb': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143867/1791141485149.png',
  'bombs': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143867/1791141485149.png',
  'atom-bombs': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143867/1791141485149.png',
  'sound-crackers': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143867/1791141485149.png',

  'ayyans-spl-items': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143991/1791141770745.png',
  'ayyans spl items': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143991/1791141770745.png',
  'festival-special': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143991/1791141770745.png',

  'multi-colour-shots': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144070/1791142256932.png',
  'multi colour shots': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144070/1791142256932.png',
  'multi colour shorts': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144070/1791142256932.png',
  'multi-shots': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144070/1791142256932.png',

  'wow-colour-shots': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144135/1791142517296.png',
  'wow colour': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144135/1791142517296.png',
  'wow colour shots': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144135/1791142517296.png',

  'single-color-fancy': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144288/1791142762024.png',
  'single color fancy': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144288/1791142762024.png',
  'fancy-crackers': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144288/1791142762024.png',

  'fancy-combo-pack': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144339/1791143561915.png',
  'fancy combo pack': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144339/1791143561915.png',
  'combo-packs': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144339/1791143561915.png',

  'mega-foundation': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144407/1791143751839.png',
  'mega foundation': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144407/1791143751839.png',
  'flower-pots': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144407/1791143751839.png',

  'new-arrivals': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144850/1791144564596.png',
  'new arrivals': 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144850/1791144564596.png',
};

export const getCategoryImage = (cat) => {
  if (!cat) return null;
  if (typeof cat === 'string') {
    const key = cat.trim().toLowerCase();
    return CATEGORY_IMAGE_MAP[key] || null;
  }
  if (cat.image || cat.logo || cat.icon_url) {
    return cat.image || cat.logo || cat.icon_url;
  }
  const nameKey = (cat.name || '').trim().toLowerCase();
  const slugKey = (cat.slug || '').trim().toLowerCase();
  const idKey = (cat.id || '').toString().trim().toLowerCase();

  return CATEGORY_IMAGE_MAP[nameKey] || CATEGORY_IMAGE_MAP[slugKey] || CATEGORY_IMAGE_MAP[idKey] || null;
};

export const CATEGORIES = [
  { id: 'all', name: 'All Crackers', icon: 'Sparkles', count: 3250 },
  { id: 'new-arrivals', name: 'New Arrivals', icon: 'BadgePercent', count: 110, desc: 'Latest 2026 eco-friendly fireworks creations', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144850/1791144564596.png' },
  { id: 'ayyans-spl-items', name: 'AYYANS SPL ITEMS', icon: 'PartyPopper', count: 140, desc: 'Exclusive Sivakasi special items', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143991/1791141770745.png' },
  { id: 'multi-colour-shots', name: 'MULTI COLOUR SHOTS', icon: 'Sparkle', count: 260, desc: '12, 30, 60 & 120 Shots sky spectacles', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144070/1791142256932.png' },
  { id: 'wow-colour-shots', name: 'WOW COLOUR SHOTS', icon: 'SunMedium', count: 340, desc: 'Vibrant sky bloom fireworks', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144135/1791142517296.png' },
  { id: 'single-color-fancy', name: 'SINGLE COLOR FANCY', icon: 'Star', count: 290, desc: 'Novelty visual wonder crackers', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144288/1791142762024.png' },
  { id: 'fancy-combo-pack', name: 'FANCY COMBO PACK', icon: 'Package', count: 120, desc: 'Money-saver bundles for grand celebrations', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144339/1791143561915.png' },
  { id: 'mega-foundation', name: 'MEGA FOUNDATION', icon: 'Flame', count: 310, desc: 'Giant festive fountains', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791144407/1791143751839.png' },
  { id: 'atom-bombs', name: 'BOMBS', icon: 'Bomb', count: 190, desc: 'Loud burst sound crackers', image: 'https://res.cloudinary.com/yez0xdym/image/upload/v1791143867/1791141485149.png' },
  { id: 'sparklers', name: 'Sparklers', icon: 'Wand2', count: 280, desc: 'Golden, electric, color sparklers for all ages' },
  { id: 'ground-chakkars', name: 'Ground Chakkars', icon: 'Disc', count: 240, desc: 'Whistling, Deluxe & Special spinning wheels' },
  { id: 'bijili-crackers', name: 'Bijili Crackers', icon: 'Zap', count: 180, desc: 'Red & striped traditional crackling sound' },
  { id: 'rockets', name: 'Rockets', icon: 'Rocket', count: 220, desc: 'Sky whistle, Tri-colour & Parachute rockets' },
  { id: 'garlands', name: 'Garlands (Wala)', icon: 'Repeat', count: 150, desc: '100 to 10,000 Wala traditional garlands' },
  { id: 'kids-crackers', name: 'Kids Crackers', icon: 'Smile', count: 175, desc: 'Safe roll caps, serpents, magic pops & sparklers' },
  { id: 'gift-boxes', name: 'Gift Boxes', icon: 'Gift', count: 95, desc: 'Curated VIP family celebration gift hampers' },
  { id: 'best-sellers', name: 'Best Sellers', icon: 'Trophy', count: 160, desc: 'Most loved & highest rated crackers in India' },
];

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
};

export const SAFETY_TIPS = [
  'Always store crackers in a cool, dry place away from heat and open flames.',
  'Maintain at least an arm\'s length distance when lighting with an incense stick (agarbatti).',
  'Always keep a bucket of water and sand nearby for emergency safety.',
  'Supervise children at all times and avoid lighting crackers indoors or on narrow balconies.',
  'Wear 100% cotton clothing and avoid loose-fitting synthetic fabrics when bursting crackers.',
  'Discard used sparklers and flower pots directly into water to avoid accidental foot burns.'
];
