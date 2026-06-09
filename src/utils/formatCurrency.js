// src/utils/formatCurrency.js
// Formats a number as LKR currency string

import { CURRENCY } from './constants';

/**
 * Format a number to LKR string.
 * @param {number} amount
 * @returns {string}  e.g. "Rs. 12,500.00"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return `${CURRENCY.symbol} 0.00`;
  return `${CURRENCY.symbol} ${Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default formatCurrency;
