import { Dayjs } from 'dayjs';

type DateRange = { start: Dayjs | null; end: Dayjs | null };

export function isInRange(day: Dayjs, range: DateRange, hoverDay: Dayjs | null) {
  if (range.start && range.end) {
    return day.isAfter(range.start, "day") && day.isBefore(range.end, "day");
  }
  if (range.start && !range.end && hoverDay && !hoverDay.isSame(range.start, "day")) {
    if (hoverDay.isAfter(range.start, "day")) {
      return day.isAfter(range.start, "day") && day.isBefore(hoverDay, "day");
    }
    if (hoverDay.isBefore(range.start, "day")) {
      return day.isAfter(hoverDay, "day") && day.isBefore(range.start, "day");
    }
  }
  return false;
}

export function isSelected(day: Dayjs, range: DateRange) {
  const startSelected = !!(range.start && day.isSame(range.start, "day"));
  const endSelected = !!(range.end && day.isSame(range.end, "day"));
  return startSelected || endSelected;
}

export function isHovered(day: Dayjs, hoverDay: Dayjs | null) {
  return !!(hoverDay && day.isSame(hoverDay, "day"));
} 