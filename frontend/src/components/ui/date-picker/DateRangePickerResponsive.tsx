"use client";
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en';
import { ChevronLeft, ChevronRight } from 'lucide-react';

dayjs.extend(localeData);
dayjs.locale('en');

type DateRange = { start: Dayjs | null; end: Dayjs | null };

interface DateRangePickerResponsiveProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
  disabledDate?: (date: Dayjs) => boolean;
  isRangeBlocked?: (start: Dayjs, end: Dayjs) => boolean;
  isPartiallyBooked?: (date: Dayjs) => boolean;
}

export default function DateRangePickerResponsive({ value, onChange, className, disabledDate, isRangeBlocked, isPartiallyBooked }: DateRangePickerResponsiveProps) {
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

  function isInRange(day: Dayjs) {
    if (range.start && range.end) {
      if (isRangeBlocked && isRangeBlocked(range.start, range.end)) return false;
      return day.isAfter(range.start, "day") && day.isBefore(range.end, "day");
    }
    if (range.start && !range.end && hoverDay && !hoverDay.isSame(range.start, "day")) {
      if (hoverDay.isAfter(range.start, "day")) {
        if (isRangeBlocked && isRangeBlocked(range.start, hoverDay)) return false;
        return day.isAfter(range.start, "day") && day.isBefore(hoverDay, "day");
      }
      if (hoverDay.isBefore(range.start, "day")) {
        if (isRangeBlocked && isRangeBlocked(hoverDay, range.start)) return false;
        return day.isAfter(hoverDay, "day") && day.isBefore(range.start, "day");
      }
    }
    return false;
  }

  function isSelected(day: Dayjs) {
    const startSelected = range.start && day.isSame(range.start, "day");
    const endSelected = range.end && day.isSame(range.end, "day");
    return startSelected || endSelected;
  }

  function isHovered(day: Dayjs) {
    return hoverDay && day.isSame(hoverDay, "day");
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
        <div className="flex flex-row items-center justify-between text-center font-semibold text-gray-900 select-none text-sm mb-2 mt-3">
          {/* Flecha izquierda o placeholder invisible */}
          {monthOffset === 0 ? (
            <span className="w-8 h-8 inline-block" />
          ) : (
            <button
              onClick={() => setMonthOffset((prev) => prev - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-600 bg-white hover:bg-green-50 hover:cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <span className="flex-1 text-center">{`${month.format("MMMM").toLowerCase()} ${month.format("YYYY")}`}</span>
          {/* Flecha derecha */}
          <button
            onClick={() => setMonthOffset((prev) => prev + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-green-500 text-green-600 bg-white hover:bg-green-50 hover:cursor-pointer transition"
            aria-label="Next month"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-7 text-sm text-gray-400 mb-1 w-full">
          {weekdays.map((d: string) => (
            <div key={d} className="w-14 h-14 flex items-center justify-center text-center select-none px-0.5">{d.toLowerCase()}</div>
          ))}
        </div>
        <div className="flex flex-col">
          {weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 w-full">
              {week.map((d: Dayjs) => {
                const isDisabled = d.isBefore(today, "day") || d.month() !== month.month() || (disabledDate && disabledDate(d));
                const isPartial = isPartiallyBooked && isPartiallyBooked(d);
                const isToday = d.isSame(today, "day");
                const inRange = isInRange(d);
                const selected = isSelected(d);
                const hovered = isHovered(d);
                // --- Estados visuales exclusivos y prioridad ---
                let numberSpanClass = "";
                let textClass = "text-gray-700";
                let todayClass = "";
                let transitionClass = "transition-colors duration-150";
                const isStart = range.start && d.isSame(range.start, "day");
                const isEnd = range.end && d.isSame(range.end, "day");
                const isBoth = isStart && isEnd;

                // Detectar si el rango provisional o definitivo es inválido
                let isInvalidRange = false;
                let isDayInInvalidRange = false;
                if (isRangeBlocked) {
                  if (range.start && range.end) {
                    // SIEMPRE marcar como inválido si isRangeBlocked es true
                    isInvalidRange = isRangeBlocked(range.start, range.end);
                    if (isInvalidRange && (d.isAfter(range.start, 'day') || d.isSame(range.start, 'day')) && (d.isBefore(range.end, 'day') || d.isSame(range.end, 'day'))) {
                      isDayInInvalidRange = true;
                    }
                  } else if (range.start && hoverDay && !hoverDay.isSame(range.start, 'day')) {
                    // Comprobar rango provisional (hover) en ambas direcciones
                    const min = range.start.isBefore(hoverDay, 'day') ? range.start : hoverDay;
                    const max = range.start.isAfter(hoverDay, 'day') ? range.start : hoverDay;
                    isInvalidRange = isRangeBlocked(min, max);
                    if (isInvalidRange && (d.isAfter(min, 'day') || d.isSame(min, 'day')) && (d.isBefore(max, 'day') || d.isSame(max, 'day'))) {
                      isDayInInvalidRange = true;
                    }
                  }
                }

                // Si el día no es del mes actual, renderiza celda vacía
                if (d.month() !== month.month()) {
                  return <div key={d.format("YYYY-MM-DD")} className="w-14 h-14 flex items-center justify-center px-0.5" />;
                }
                // 1. Día es ambos (inicio y fin): círculo completo con ring completo
                if (isBoth) {
                  const isSingleDay = range.start && range.end && range.start.isSame(range.end, 'day');
                  if (isPartial && isSingleDay) {
                    numberSpanClass = "ring-2 ring-yellow-400 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center font-bold relative group";
                    textClass = "text-yellow-800 font-bold";
                  } else {
                    numberSpanClass = `${isInvalidRange ? 'bg-red-200 ring-2 ring-red-800 text-red-800' : 'bg-[#b6f2d5] ring-2 ring-green-800 text-green-800'} rounded-full w-10 h-10 flex items-center justify-center font-bold`;
                    textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  }
                }
                // 2. Día es solo inicio: semicírculo dinámico según dirección del hover
                else if (isStart && !isEnd) {
                  const isSingleDay = range.start && range.end && range.start.isSame(range.end, 'day');
                  if (isPartial && isSingleDay) {
                    numberSpanClass = "ring-2 ring-yellow-400 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center font-bold relative group";
                    textClass = "text-yellow-800 font-bold";
                  } else if (range.start && !range.end && hoverDay && !hoverDay.isSame(range.start, 'day')) {
                    if (hoverDay.isAfter(range.start, 'day')) {
                      numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-l-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 text-green-800'} rounded-l-full w-full h-10 flex items-center justify-center font-bold`;
                      textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                    } else {
                      numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-r-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 text-green-800'} rounded-r-full w-full h-10 flex items-center justify-center font-bold`;
                      textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                    }
                  } else {
                    numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-l-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 text-green-800'} rounded-l-full w-full h-10 flex items-center justify-center font-bold`;
                    textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  }
                }
                // 3. Día es solo fin: semicírculo derecho, borde derecho, superior e inferior
                else if (isEnd && !isStart) {
                  const isSingleDay = range.start && range.end && range.start.isSame(range.end, 'day');
                  if (isPartial && isSingleDay) {
                    numberSpanClass = "ring-2 ring-yellow-400 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center font-bold relative group";
                    textClass = "text-yellow-800 font-bold";
                  } else {
                    numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-r-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 text-green-800'} rounded-r-full w-full h-10 flex items-center justify-center font-bold relative`;
                    textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  }
                }
                // 4. Hover semicirculo plano (cuando solo hay inicio seleccionado y hover activo)
                else if (range.start && !range.end && hoverDay && d.isSame(hoverDay, 'day') && !isStart && !isEnd) {
                  if (hoverDay.isAfter(range.start, 'day')) {
                    numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-r-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-r-2 border-green-800 text-green-800'} rounded-r-full w-full h-10 flex items-center justify-center font-bold`;
                    textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  } else {
                    numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-l-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-l-2 border-green-800 text-green-800'} rounded-l-full w-full h-10 flex items-center justify-center font-bold`;
                    textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  }
                }
                // 5. Día en rango (ni inicio ni fin): rectángulo color plano, borde solo arriba y abajo
                else if ((inRange || isDayInInvalidRange)) {
                  let gradientSpan = null;
                  // Gradiente a la derecha si es el último día del mes
                  if (d.isSame(d.endOf('month'), 'day')) {
                    gradientSpan = (
                      <span className="absolute right-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2" style={{background: isInvalidRange ? 'linear-gradient(to right, #fecaca 0%, #fecaca 60%, transparent 100%)' : 'linear-gradient(to right, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)', borderColor: isInvalidRange ? '#991b1b' : '#059669'}}></span>
                    );
                  }
                  // Gradiente a la izquierda si es el primer día del mes
                  if (d.isSame(d.startOf('month'), 'day')) {
                    gradientSpan = (
                      <span className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2" style={{background: isInvalidRange ? 'linear-gradient(to left, #fecaca 0%, #fecaca 60%, transparent 100%)' : 'linear-gradient(to left, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)', borderColor: isInvalidRange ? '#991b1b' : '#059669'}}></span>
                    );
                  }
                  if (isDayInInvalidRange && isDisabled) {
                    numberSpanClass = 'bg-red-200 border-t-2 border-b-2 border-red-800 w-full h-10 flex items-center justify-center font-bold relative';
                    textClass = 'text-gray-500 font-normal';
                  } else {
                    numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 text-green-800'} w-full h-10 flex items-center justify-center font-bold relative`;
                    textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  }
                  return (
                    <button
                      key={d.format("YYYY-MM-DD")}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => setHoverDay(d)}
                      onMouseLeave={() => setHoverDay(null)}
                      className={[
                        "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none px-0.5 group relative",
                        textClass,
                        todayClass,
                        transitionClass,
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <span className={numberSpanClass}>
                        {gradientSpan}
                        <span className="relative z-10 h-10 flex items-center">
                          {d.date()}
                          {(!isStart && !isEnd && !inRange && isPartial && !isToday && !isDisabled) && (
                            <span className="ml-1 text-[10px] text-yellow-800">*</span>
                          )}
                        </span>
                      </span>
                      {(isStart && !isEnd && !inRange && isPartial && !isToday && !isDisabled) && (
                        <span className="absolute left-1/2 -translate-x-1/2 top-13 z-50 px-2 py-1 bg-yellow-200 text-yellow-900 text-xs rounded shadow whitespace-nowrap group-hover:block hidden pointer-events-none">
                          Only available by hours
                        </span>
                      )}
                    </button>
                  );
                }
                // 6. Hoy: fondo gris redondo si no está en otro estado
                else if (isToday) {
                  numberSpanClass = "bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center";
                }
                // 7. Día parcialmente ocupado (amarillo) tiene máxima prioridad visual si no está seleccionado, en rango, ni es inicio/fin, ni hover
                else if (!isStart && !isEnd && !inRange && isPartial && !isToday && !isDisabled) {
                  // Si está seleccionado, o hovered, usa amarillo intenso, si no, amarillo claro
                  const isSelectedPartial = selected;
                  const isHoveredPartial = hovered;
                  if (isSelectedPartial || isHoveredPartial) {
                    numberSpanClass = "ring-2 ring-yellow-400 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center font-bold relative group";
                    textClass = "text-yellow-800 font-bold";
                  } else {
                    numberSpanClass = "ring-2 ring-yellow-200 bg-yellow-50 rounded-full w-10 h-10 flex items-center justify-center font-bold relative group";
                    textClass = "text-yellow-700 font-bold";
                  }
                }
                // 8. Deshabilitado: gris claro (pero si está en rango inválido, debe verse el número en rojo)
                else if (isDisabled && !isDayInInvalidRange) {
                  numberSpanClass = "w-full h-10 flex items-center justify-center font-bold";
                  textClass = "text-gray-300";
                }
                // 9. Fade out sobresaliente en el último día del mes anterior (gradiente a la derecha, rango definitivo o hover provisional)
                else if (
                  d.isSame(d.endOf('month'), 'day') &&
                  (
                    (range.start && range.end && (range.end.isSame(d.add(1, 'day'), 'day') || range.end.isAfter(d)) && (range.start.isSame(d, 'day') || range.start.isBefore(d))) ||
                    (range.start && !range.end && hoverDay && range.start.month() !== hoverDay.month() && (
                      (d.isAfter(hoverDay, 'day') && d.isBefore(range.start, 'day')) ||
                      (d.isAfter(range.start, 'day') && d.isBefore(hoverDay, 'day')) ||
                      d.isSame(hoverDay, 'day') ||
                      d.isSame(range.start, 'day')
                    ))
                  )
                ) {
                  // Semicírculo izquierdo al menor, derecho al mayor
                  let rounded = "";
                  if (range.start && !range.end && hoverDay) {
                    const minDay = range.start.isBefore(hoverDay, 'day') ? range.start : hoverDay;
                    const maxDay = range.start.isAfter(hoverDay, 'day') ? range.start : hoverDay;
                    if (d.isSame(minDay, 'day')) rounded = 'rounded-l-full border-l-2 ';
                    if (d.isSame(maxDay, 'day')) rounded = 'rounded-r-full border-r-2 ';
                  } else {
                    const isStart = range.start && d.isSame(range.start, 'day');
                    if (isStart) rounded = 'rounded-l-full border-l-2 ';
                  }
                  numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 text-green-800'} w-full h-10 flex items-center justify-center font-bold relative rounded-r-full ${rounded} z-0`;
                  textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  return (
                    <button
                      key={d.format("YYYY-MM-DD")}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => setHoverDay(d)}
                      onMouseLeave={() => setHoverDay(null)}
                      className={[
                        "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none px-0.5 group relative",
                        textClass,
                        todayClass,
                        transitionClass,
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <span className={numberSpanClass}>
                        <span className={textClass}>{d.date()}</span>
                      </span>
                    </button>
                  );
                }
                // 10. Fade in sobresaliente en el primer día del mes siguiente (gradiente a la izquierda, rango definitivo o hover provisional)
                else if (
                  d.isSame(d.startOf('month'), 'day') &&
                  (
                    (range.start && range.end && (range.start.isSame(d.subtract(1, 'day'), 'day') || range.start.isBefore(d)) && (range.end.isSame(d, 'day') || range.end.isAfter(d))) ||
                    (range.start && !range.end && hoverDay && range.start.month() !== hoverDay.month() && (
                      (d.isAfter(hoverDay, 'day') && d.isBefore(range.start, 'day')) ||
                      (d.isAfter(range.start, 'day') && d.isBefore(hoverDay, 'day')) ||
                      d.isSame(hoverDay, 'day') ||
                      d.isSame(range.start, 'day')
                    ))
                  )
                ) {
                  // Semicírculo izquierdo al menor, derecho al mayor
                  let rounded = "";
                  if (range.start && !range.end && hoverDay) {
                    const minDay = range.start.isBefore(hoverDay, 'day') ? range.start : hoverDay;
                    const maxDay = range.start.isAfter(hoverDay, 'day') ? range.start : hoverDay;
                    if (d.isSame(minDay, 'day')) rounded = 'rounded-l-full border-l-2 ';
                    if (d.isSame(maxDay, 'day')) rounded = 'rounded-r-full border-r-2 ';
                  } else {
                    const isEnd = range.end && d.isSame(range.end, 'day');
                    if (isEnd) rounded = 'rounded-r-full border-r-2 ';
                  }
                  numberSpanClass = `${isInvalidRange ? 'bg-red-200 border-t-2 border-b-2 border-red-800 text-red-800' : 'bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 text-green-800'} w-full h-10 flex items-center justify-center font-bold relative overflow-visible rounded-l-full ${rounded} z-0`;
                  textClass = isInvalidRange ? 'text-red-800 font-bold' : 'text-green-800 font-bold';
                  return (
                    <button
                      key={d.format("YYYY-MM-DD")}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(d)}
                      onMouseEnter={() => setHoverDay(d)}
                      onMouseLeave={() => setHoverDay(null)}
                      className={[
                        "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none px-0.5 group relative",
                        textClass,
                        todayClass,
                        transitionClass,
                        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                      ].join(" ")}
                    >
                      <span className={numberSpanClass}>
                        <span className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2" style={{background: isInvalidRange ? 'linear-gradient(to left, #fecaca 0%, #fecaca 60%, transparent 100%)' : 'linear-gradient(to left, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)', borderColor: isInvalidRange ? '#991b1b' : '#059669'}}></span>
                        <span className="relative z-10 h-10 flex items-center">
                          {d.date()}
                          {(!isStart && !isEnd && !inRange && isPartial && !isToday && !isDisabled) && (
                            <span className="ml-1 text-[10px] text-yellow-800">*</span>
                          )}
                        </span>
                      </span>
                    </button>
                  );
                }
                // 11. Hover aro verde cuando no hay selección o cuando hay rango completo y hover fuera del rango
                else if (
                  !isDisabled &&
                  hovered &&
                  !isDayInInvalidRange &&
                  !isPartial && // No hover verde si es parcialmente ocupado
                  (
                    (!range.start && !range.end) ||
                    (range.start && range.end && !d.isSame(range.start, 'day') && !d.isSame(range.end, 'day') && !isInRange(d))
                  )
                ) {
                  numberSpanClass = "ring-2 ring-green-800 rounded-full w-10 h-10 flex items-center justify-center bg-white";
                  textClass = "text-green-800 font-bold";
                }
                // 12. Día parcialmente ocupado (amarillo) tiene máxima prioridad visual si no está seleccionado, en rango, ni es inicio/fin, ni hover
                else if (!isStart && !isEnd && !inRange && isPartial && !isToday && !isDisabled) {
                  numberSpanClass = "ring-2 ring-yellow-400 bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center font-bold relative group";
                  textClass = "text-yellow-800 font-bold";
                } else {
                  numberSpanClass = "w-full h-10 flex items-center justify-center font-bold";
                  textClass = isDisabled ? "text-gray-300" : "text-gray-700";
                }
                return (
                  <button
                    key={d.format("YYYY-MM-DD")}
                    disabled={isDisabled}
                    onClick={() => handleDayClick(d)}
                    onMouseEnter={() => setHoverDay(d)}
                    onMouseLeave={() => setHoverDay(null)}
                    className={[
                      "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none px-0.5 group relative",
                      textClass,
                      todayClass,
                      transitionClass,
                      isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                    ].join(" ")}
                  >
                    <span className={numberSpanClass}>
                      <span className={textClass}>{d.date()}</span>
                    </span>
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
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-center w-full">
        <div className="flex w-full justify-center">
          {renderMonth(startMonth)}
        </div>
      </div>
    </div>
  );
} 