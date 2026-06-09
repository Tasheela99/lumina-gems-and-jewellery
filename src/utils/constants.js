// src/utils/constants.js
// Shared constant values used across the app

export const CATEGORIES = {
  GEM: 'Gem',
  JEWELRY: 'Jewelry',
};

export const CATEGORY_OPTIONS = [
  { value: 'Gem', label: 'Gems' },
  { value: 'Jewelry', label: 'Jewelry' },
];

export const CURRENCY = {
  symbol: 'Rs.',
  code: 'LKR',
  locale: 'si-LK',
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Gems', path: '/gems' },
  { label: 'Jewelry', path: '/jewelry' },
  { label: 'Collections', path: '/collections' },
  { label: 'Gemstone Guide', path: '/gemstone-guide' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const ADMIN_NAV = { label: 'Admin', path: '/admin' };

// ─────────────────────────────────────────────
// Gemstone learning module constants
// ─────────────────────────────────────────────

export const GEMSTONE_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const GEMSTONE_CATEGORIES = [
  'Precious',
  'Semi-Precious',
  'Healing',
  'Zodiac',
];

export const GEMSTONE_STATUS_OPTIONS = ['Active', 'Inactive'];

// Simple, user-friendly birthstone list (one per month)
export const BIRTHSTONES_BY_MONTH = [
  { month: 'January', stone: 'Garnet' },
  { month: 'February', stone: 'Amethyst' },
  { month: 'March', stone: 'Aquamarine' },
  { month: 'April', stone: 'Diamond' },
  { month: 'May', stone: 'Emerald' },
  { month: 'June', stone: 'Pearl' },
  { month: 'July', stone: 'Ruby' },
  { month: 'August', stone: 'Peridot' },
  { month: 'September', stone: 'Sapphire' },
  { month: 'October', stone: 'Opal' },
  { month: 'November', stone: 'Topaz' },
  { month: 'December', stone: 'Turquoise' },
];

// ─────────────────────────────────────────────
// Collection Management Constants
// ─────────────────────────────────────────────

export const COLLECTION_TYPES = [
  'Bridal',
  'Wedding',
  'Engagement',
  'Luxury',
  'Daily Wear',
  'Men\'s',
  'Women\'s',
  'Kids',
  'Seasonal',
  'Exclusive',
  'Limited Edition'
];

export const COLLECTION_OCCASIONS = [
  'Wedding',
  'Anniversary',
  'Birthday',
  'Valentine\'s Day',
  'Mother\'s Day',
  'Graduation',
  'Corporate Gifts'
];

export const COLLECTION_STYLES = [
  'Classic',
  'Modern',
  'Vintage',
  'Contemporary',
  'Minimalist',
  'Traditional'
];

export const METAL_TYPES = [
  'Yellow Gold (18K)',
  'Yellow Gold (22K)',
  'White Gold (18K)',
  'Rose Gold (18K)',
  'Platinum',
  'Silver',
  'Palladium'
];

export const COLLECTION_STATUS_OPTIONS = [
  'Draft',
  'Active',
  'Inactive',
  'Archived'
];
