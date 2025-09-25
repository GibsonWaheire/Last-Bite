// Currency utility functions for Kenyan Shillings (KES)

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyWithDecimals = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to parse currency input
export const parseCurrencyInput = (value: string): number => {
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper function to validate currency range
export const isValidCurrencyRange = (min: number, max: number): boolean => {
  return min > 0 && max > 0 && min < max;
};
