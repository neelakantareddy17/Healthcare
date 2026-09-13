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

export const parseTimeSlotStart = (
  timeSlot: string,
): { hours: number; minutes: number } | null => {
  const match = timeSlot.trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (hours < 1 || hours > 12 || minutes > 59) {
      return null;
    }

    if (meridiem === 'AM' && hours === 12) hours = 0;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
  } else if (hours > 23 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
};

export const isTimeSlotInPast = (
  date: Date | string,
  timeSlot: string,
  now = new Date(),
): boolean => {
  const slotStart = parseTimeSlotStart(timeSlot);

  if (!slotStart || !isSameDay(startOfDay(date), now)) {
    return false;
  }

  const appointmentStart = startOfDay(date);
  appointmentStart.setUTCHours(slotStart.hours, slotStart.minutes, 0, 0);
  return appointmentStart.getTime() <= now.getTime();
};
