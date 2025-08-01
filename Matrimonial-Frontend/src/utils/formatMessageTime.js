// src/utils/formatMessageTime.js
import { format, isToday, isYesterday } from 'date-fns';

export const formatMessageTime = (dateStr) => {
  const date = new Date(dateStr);
  return format(date, 'hh:mm a'); // like 04:32 PM
};

export const formatDateGroup = (dateStr) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, 'd MMM yyyy'); // like 14 Jul 2025
};
