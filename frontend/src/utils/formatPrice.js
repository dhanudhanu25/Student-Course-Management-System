export const formatPrice = (price) => {
  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    return '₹0';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

export const CURRENCY_SYMBOL = '₹';
