/**
 * Returns a Date object normalized to midnight (00:00:00.000) UTC for the given date.
 * Useful for day-based comparisons (appointments, leaves, queue tokens).
 */
export const startOfDay = (date: Date | string): Date => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date | string): Date => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

export const isSameDay = (a: Date, b: Date): boolean => {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
};
