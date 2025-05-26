"use client";
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en';
import { MonthCalendar } from './MonthCalendar';
import { ClearDatesButton } from './ClearDatesButton';
import { isInRange, isSelected, isHovered } from '../../../utils/date-picker/dateRangeUtils';

dayjs.extend(localeData);
dayjs.locale('en');

type DateRange = { start: Dayjs | null; end: Dayjs | null };

interface DateRangePickerMinimalProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  onClose?: () => void;
  className?: string;
}

export default function DateRangePickerMinimal({ value, onChange, onClose, className }: DateRangePickerMinimalProps) {
  const [range, setRange] = useState<DateRange>(value || { start: null, end: null });
  const [hoverDay, setHoverDay] = useState<Dayjs | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const today = dayjs();
  const startMonth = today.add(monthOffset, 'month');
  const endMonth = today.add(monthOffset + 1, 'month');

  // Sincronizar con value externo
  useEffect(() => {
    if (value) setRange(value);
  }, [value]);

  function handleDayClick(day: Dayjs) {
    if (!range.start || (range.start && range.end)) {
      const newRange = { start: day, end: null };
      setRange(newRange);
      if (onChange) onChange(newRange);
    } else if (range.start && !range.end) {
      if (day.isBefore(range.start, "day")) {
        const newRange = { start: day, end: range.start };
        setRange(newRange);
        if (onChange) onChange(newRange);
      } else {
        const newRange = { start: range.start, end: day };
        setRange(newRange);
        if (onChange) onChange(newRange);
      }
    }
  }

  return (
    <div className={className || "flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl border border-gray-100 p-6"}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full border border-green-500 text-green-600 bg-white hover:bg-green-50 hover:cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setMonthOffset((prev) => prev - 1)}
          aria-label="Mes anterior"
          disabled={monthOffset === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <MonthCalendar
          month={startMonth}
          range={range}
          hoverDay={hoverDay}
          today={today}
          onDayClick={handleDayClick}
          onMouseEnter={(day) => setHoverDay(day)}
          onMouseLeave={() => setHoverDay(null)}
          isInRange={(day) => isInRange(day, range, hoverDay)}
          isSelected={(day) => isSelected(day, range)}
          isHovered={(day) => isHovered(day, hoverDay)}
        />
        <MonthCalendar
          month={endMonth}
          range={range}
          hoverDay={hoverDay}
          today={today}
          onDayClick={handleDayClick}
          onMouseEnter={(day) => setHoverDay(day)}
          onMouseLeave={() => setHoverDay(null)}
          isInRange={(day) => isInRange(day, range, hoverDay)}
          isSelected={(day) => isSelected(day, range)}
          isHovered={(day) => isHovered(day, hoverDay)}
        />
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full border border-green-500 text-green-600 bg-white hover:bg-green-50 hover:cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => setMonthOffset((prev) => prev + 1)}
          aria-label="Mes siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      {(range.start || range.end) && (
        <ClearDatesButton
          onClick={() => {
            setRange({ start: null, end: null });
            if (onChange) onChange({ start: null, end: null });
          }}
        />
      )}
    </div>
  );
} 