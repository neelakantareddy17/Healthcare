export const getLocalDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseTimeSlotStart = (timeSlot) => {
  const match = String(timeSlot).trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem) {
    if (hours < 1 || hours > 12 || minutes > 59) return null;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
  } else if (hours > 23 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
};

export const isTimeSlotPast = (timeSlot, dateInput, now = new Date()) => {
  const start = parseTimeSlotStart(timeSlot);
  if (!start || dateInput !== getLocalDateInputValue(now)) return false;

  const slotStart = new Date(now);
  slotStart.setHours(start.hours, start.minutes, 0, 0);
  return slotStart <= now;
};
