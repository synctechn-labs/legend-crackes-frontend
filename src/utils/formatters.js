export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const calculateDiscount = (original, selling) => {
  if (!original || !selling || original <= selling) return 0;
  return Math.round(((original - selling) / original) * 100);
};

export const formatOrderId = (id) => {
  if (!id && id !== 0) return 'CLC001';
  const str = String(id).trim();
  if (/^CLC\d+/i.test(str)) return str.toUpperCase();
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return `CLC${String(num).padStart(3, '0')}`;
  }
  const match = str.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return `CLC${String(num).padStart(3, '0')}`;
  }
  return `CLC-${str}`;
};

export const generateOrderId = (num = 1) => {
  return `CLC${String(num).padStart(3, '0')}`;
};
