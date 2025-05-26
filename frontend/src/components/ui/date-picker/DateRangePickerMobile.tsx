"use client";
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en';

dayjs.extend(localeData);
dayjs.locale('en');

type DateRange = { start: Dayjs | null; end: Dayjs | null };

interface DateRangePickerMobileProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  onClose?: () => void;
  className?: string;
}

export default function DateRangePickerMobile({ value, onChange, onClose, className }: DateRangePickerMobileProps) {
  const [range, setRange] = useState<DateRange>(value || { start: null, end: null });
  const [monthOffset, setMonthOffset] = useState(0);
  const today = dayjs();
  const currentMonth = today.add(monthOffset, 'month');

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

  function isInRange(day: Dayjs) {
    if (range.start && range.end) {
      return day.isAfter(range.start, "day") && day.isBefore(range.end, "day");
    }
    return false;
  }

  function isSelected(day: Dayjs) {
    const startSelected = range.start && day.isSame(range.start, "day");
    const endSelected = range.end && day.isSame(range.end, "day");
    return startSelected || endSelected;
  }

  function renderMonth(month: Dayjs) {
    // Week starts on Monday
    const weekdays = [
      dayjs.weekdaysMin()[1], // L
      dayjs.weekdaysMin()[2], // M
      dayjs.weekdaysMin()[3], // X
      dayjs.weekdaysMin()[4], // J
      dayjs.weekdaysMin()[5], // V
      dayjs.weekdaysMin()[6], // S
      dayjs.weekdaysMin()[0], // D
    ];
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");
    const days = [];
    // Primer día visible: lunes anterior o igual al primer día del mes
    let day = startOfMonth;
    while (day.day() !== 1) {
      day = day.subtract(1, 'day');
    }
    // Generar siempre 6 semanas (6x7=42 días)
    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = day.add(1, "day");
    }
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return (
      <div className="flex flex-col w-80">
        <div className="grid grid-cols-7 text-sm text-gray-400 mb-1 gap-x-3">
          {weekdays.map((d: string) => (
            <div key={d} className="text-center select-none">{d.toLowerCase()}</div>
          ))}
        </div>
        <div className="flex flex-col gap-y-2">
          {weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-x-3">
              {week.map((d: Dayjs) => {
                const isDisabled = d.isBefore(today, "day") || d.month() !== month.month();
                const isToday = d.isSame(today, "day");
                const inRange = isInRange(d);
                const selected = isSelected(d);
                // --- Estados visuales exclusivos y prioridad ---
                let numberSpanClass = "";
                let textClass = "text-gray-700";
                let todayClass = "";
                let transitionClass = "transition-colors duration-150";
                const isStart = range.start && d.isSame(range.start, "day");
                const isEnd = range.end && d.isSame(range.end, "day");
                const isBoth = isStart && isEnd;
                // Si el día no es del mes actual, renderiza celda vacía
                if (d.month() !== month.month()) {
                  return <div key={d.format("YYYY-MM-DD")} className="w-14 h-14" />;
                }
                // 1. Día es ambos (inicio y fin): círculo completo con ring completo
                if (isBoth) {
                  numberSpanClass = "bg-[#b6f2d5] ring-2 ring-green-800 rounded-full w-10 h-10 flex items-center justify-center text-green-800 font-bold";
                  textClass = "text-green-800 font-bold";
                }
                // 2. Día es solo inicio
                else if (isStart && !isEnd) {
                  numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 rounded-l-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
                  textClass = "text-green-800 font-bold";
                }
                // 3. Día es solo fin
                else if (isEnd && !isStart) {
                  numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 rounded-r-full w-full h-10 flex items-center justify-center text-green-800 font-bold";
                  textClass = "text-green-800 font-bold";
                }
                // 4. Día en rango (ni inicio ni fin): rectángulo color plano, borde solo arriba y abajo
                else if (inRange) {
                  numberSpanClass = "bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 w-full h-10 flex items-center justify-center text-green-800 font-bold";
                  textClass = "text-green-800 font-bold";
                }
                // 5. Hoy: fondo gris redondo si no está en otro estado
                else if (isToday) {
                  numberSpanClass = "bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center";
                }
                // 6. Deshabilitado: gris claro
                if (isDisabled) {
                  textClass = "text-gray-300";
                }
                // Gradiente/fade en el primer día del mes si el rango empieza antes y termina en o después de ese día
                if (
                  d.isSame(d.startOf('month'), 'day') &&
                  range.start && range.end &&
                  range.start.isBefore(d, 'day') && (range.end.isAfter(d, 'day') || range.end.isSame(d, 'day'))
                ) {
                  return (
                    <button
                      key={d.format("YYYY-MM-DD")}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(d)}
                      className={[
                        "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
                        textClass,
                        todayClass,
                        transitionClass,
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <span className={numberSpanClass + " relative rounded-l-full z-0"}>
                        <span className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2 border-green-800" style={{background: 'linear-gradient(to left, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)'}}></span>
                        <span className="relative z-10 h-10 flex items-center">{d.date()}</span>
                      </span>
                    </button>
                  );
                }
                // Gradiente/fade en el último día del mes si el rango termina después y empieza en o antes de ese día
                if (
                  d.isSame(d.endOf('month'), 'day') &&
                  range.start && range.end &&
                  (range.end.isAfter(d, 'day')) && (range.start.isBefore(d, 'day') || range.start.isSame(d, 'day'))
                ) {
                  return (
                    <button
                      key={d.format("YYYY-MM-DD")}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(d)}
                      className={[
                        "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
                        textClass,
                        todayClass,
                        transitionClass,
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <span className={numberSpanClass + " relative rounded-r-full z-0"}>
                        <span className="absolute right-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2 border-green-800" style={{background: 'linear-gradient(to right, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)'}}></span>
                        <span className="relative z-10 h-10 flex items-center">{d.date()}</span>
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    key={d.format("YYYY-MM-DD")}
                    disabled={isDisabled}
                    onClick={() => handleDayClick(d)}
                    className={[
                      "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
                      textClass,
                      todayClass,
                      transitionClass,
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                    ].join(" ")}
                  >
                    <span className={numberSpanClass}>{d.date()}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className || "flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl border border-gray-100 p-6"}>
      {/* Flechas y mes arriba */}
      <div className="flex items-center justify-center gap-2 mb-4">
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
        <div className="text-center font-semibold text-gray-900 select-none text-sm mx-2 min-w-[120px]">
          {`${currentMonth.format("MMMM").toLowerCase()} ${currentMonth.format("YYYY")}`}
        </div>
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
      {renderMonth(currentMonth)}
      {(range.start || range.end) && (
        <button
          onClick={() => {
            setRange({ start: null, end: null });
            if (onChange) onChange({ start: null, end: null });
          }}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear dates
        </button>
      )}
    </div>
  );
} 