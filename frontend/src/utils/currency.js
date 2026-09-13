export const formatINR = (amount) => {
  if (amount === undefined || amount === null || amount === '') return 'Amount unavailable';

  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return 'Amount unavailable';

  return `₹${numericAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};