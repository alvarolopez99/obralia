import React from 'react';
import { Dayjs } from 'dayjs';
import type { DayCellProps } from './DayCell';

export function getNumberSpanClass({ day, month, range, hoverDay, today, isInRange, isSelected, isHovered, isDisabled }: Omit<DayCellProps, 'onDayClick' | 'onMouseEnter' | 'onMouseLeave'> & { isDisabled: boolean }) {
  const isToday = day.isSame(today, "day");
  const inRange = isInRange(day);
  const isStart = range.start && day.isSame(range.start, "day");
  const isEnd = range.end && day.isSame(range.end, "day");
  const isBoth = isStart && isEnd;
  let numberSpanClass = "";
  if (isBoth) {
    numberSpanClass = "bg-[#b6f2d5] ring-2 ring-green-800 rounded-full w-10 h-10 flex items-center justify-center text-green-800 font-bold";
  } else if (isStart && !isEnd) {
    if (range.start && !range.end && hoverDay && !hoverDay.isSame(range.start, 'day')) {
      if (hoverDay.isAfter(range.start, 'day')) {
        numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 rounded-l-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
      } else {
        numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 rounded-r-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
      }
    } else {
      numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 rounded-l-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
    }
  } else if (isEnd && !isStart) {
    numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 rounded-r-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
  } else if (range.start && !range.end && hoverDay && day.isSame(hoverDay, 'day') && !isDisabled && !isStart && !isEnd) {
    if (hoverDay.isAfter(range.start, 'day')) {
      numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 rounded-r-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
    } else {
      numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 rounded-l-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
    }
  } else if (inRange) {
    numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 w-full h-10 flex items-center justify-center text-green-800 font-bold";
  } else if (isToday) {
    numberSpanClass = "bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center";
  }
  return numberSpanClass;
}

export function getTextClass({ day, month, range, hoverDay, today, isInRange, isSelected, isHovered, isDisabled }: Omit<DayCellProps, 'onDayClick' | 'onMouseEnter' | 'onMouseLeave'> & { isDisabled: boolean }) {
  const inRange = isInRange(day);
  const isStart = range.start && day.isSame(range.start, "day");
  const isEnd = range.end && day.isSame(range.end, "day");
  const isBoth = isStart && isEnd;
  let textClass = "text-gray-700";
  if (isBoth || isStart || isEnd || inRange) {
    textClass = "text-green-800 font-bold";
  }
  if (isDisabled) {
    textClass = "text-gray-300";
  }
  return textClass;
} 