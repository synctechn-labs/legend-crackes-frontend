export const MIN_ORDER_AMOUNT = 3000;
export const BRAND_LOGO_URL = 'https://res.cloudinary.com/yez0xdym/image/upload/v1790708530/1000240064.png';

export const CATEGORIES = [
  { id: 'all', name: 'All Crackers', icon: 'Sparkles', count: 3250 },
  { id: 'sparklers', name: 'Sparklers', icon: 'Wand2', count: 280, desc: 'Golden, electric, color sparklers for all ages' },
  { id: 'flower-pots', name: 'Flower Pots', icon: 'Flame', count: 310, desc: 'Ashoka, Colour Koti, Giant festive fountains' },
  { id: 'ground-chakkars', name: 'Ground Chakkars', icon: 'Disc', count: 240, desc: 'Whistling, Deluxe & Special spinning wheels' },
  { id: 'bijili-crackers', name: 'Bijili Crackers', icon: 'Zap', count: 180, desc: 'Red & striped traditional crackling sound' },
  { id: 'atom-bombs', name: 'Atom Bombs', icon: 'Bomb', count: 190, desc: 'Hydro, Classic Bullet & Green Thunder bombs' },
  { id: 'rockets', name: 'Rockets', icon: 'Rocket', count: 220, desc: 'Sky whistle, Tri-colour & Parachute rockets' },
  { id: 'fancy-crackers', name: 'Fancy Crackers', icon: 'Star', count: 290, desc: 'Novelty sound & visual wonder crackers' },
  { id: 'aerial-shots', name: 'Aerial Shots', icon: 'SunMedium', count: 340, desc: 'Single & double sky bloom aerial fireworks' },
  { id: 'multi-shots', name: 'Multi Shots', icon: 'Sparkle', count: 260, desc: '12, 30, 60, 120 & 240 Shots sky spectacles' },
  { id: 'garlands', name: 'Garlands (Wala)', icon: 'Repeat', count: 150, desc: '100 to 10,000 Wala traditional garlands' },
  { id: 'sound-crackers', name: 'Sound Crackers', icon: 'Volume2', count: 210, desc: 'Classic double sound, 28 chorsa & loud bursts' },
  { id: 'kids-crackers', name: 'Kids Crackers', icon: 'Smile', count: 175, desc: 'Safe roll caps, serpents, magic pops & sparklers' },
  { id: 'gift-boxes', name: 'Gift Boxes', icon: 'Gift', count: 95, desc: 'Curated VIP family celebration gift hampers' },
  { id: 'combo-packs', name: 'Combo Packs', icon: 'Package', count: 120, desc: 'Money-saver bundles for grand celebrations' },
  { id: 'festival-special', name: 'Festival Special', icon: 'PartyPopper', count: 140, desc: 'Exclusive Diwali limited edition releases' },
  { id: 'new-arrivals', name: 'New Arrivals', icon: 'BadgePercent', count: 110, desc: 'Latest 2026 eco-friendly fireworks creations' },
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
