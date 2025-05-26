import { Dayjs } from 'dayjs';
import { getNumberSpanClass, getTextClass } from '../../../utils/date-picker/dayCellUtils';

type DateRange = { start: Dayjs | null; end: Dayjs | null };

interface DayCellProps {
  day: Dayjs;
  month: Dayjs;
  range: DateRange;
  hoverDay: Dayjs | null;
  today: Dayjs;
  onDayClick: (day: Dayjs) => void;
  onMouseEnter: (day: Dayjs) => void;
  onMouseLeave: () => void;
  isInRange: (day: Dayjs) => boolean;
  isSelected: (day: Dayjs) => boolean;
  isHovered: (day: Dayjs) => boolean;
}

export function DayCell(props: DayCellProps) {
  const { day, month, range, hoverDay, today, onDayClick, onMouseEnter, onMouseLeave, isInRange, isSelected, isHovered } = props;
  const isDisabled = day.isBefore(today, "day") || day.month() !== month.month();
  const isToday = day.isSame(today, "day");
  const inRange = isInRange(day);
  const selected = isSelected(day);
  const hovered = isHovered(day);
  const isStart = range.start && day.isSame(range.start, "day");
  const isEnd = range.end && day.isSame(range.end, "day");
  const isBoth = isStart && isEnd;
  let todayClass = "";
  let transitionClass = "transition-colors duration-150";

  // Si el día no es del mes actual, renderiza celda vacía
  if (day.month() !== month.month()) {
    return <div key={day.format("YYYY-MM-DD")} className="w-14 h-14" />;
  }

  // Fade out sobresaliente en el último día del mes anterior
  if (
    day.isSame(day.endOf('month'), 'day') &&
    (
      (range.start && range.end && (range.end.isSame(day.add(1, 'day'), 'day') || range.end.isAfter(day)) && (range.start.isSame(day, 'day') || range.start.isBefore(day))) ||
      (range.start && !range.end && hoverDay && range.start.month() !== hoverDay.month() && (
        (day.isAfter(hoverDay, 'day') && day.isBefore(range.start, 'day')) ||
        (day.isAfter(range.start, 'day') && day.isBefore(hoverDay, 'day')) ||
        day.isSame(hoverDay, 'day') ||
        day.isSame(range.start, 'day')
      ))
    )
  ) {
    let rounded = "";
    if (range.start && !range.end && hoverDay) {
      const minDay = range.start.isBefore(hoverDay, 'day') ? range.start : hoverDay;
      const maxDay = range.start.isAfter(hoverDay, 'day') ? range.start : hoverDay;
      if (day.isSame(minDay, 'day')) rounded = 'rounded-l-full border-l-2 ';
      if (day.isSame(maxDay, 'day')) rounded = 'rounded-r-full border-r-2 ';
    } else {
      const isStart = range.start && day.isSame(range.start, 'day');
      if (isStart) rounded = 'rounded-l-full border-l-2 ';
    }
    const numberSpanClass = `bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 w-full h-10 flex items-center justify-center text-green-800 font-bold relative rounded-r-full ${rounded} z-0`;
    const textClass = "text-green-800 font-bold";
    return (
      <button
        key={day.format("YYYY-MM-DD")}
        disabled={isDisabled}
        onClick={() => onDayClick(day)}
        onMouseEnter={() => onMouseEnter(day)}
        onMouseLeave={onMouseLeave}
        className={[
          "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
          textClass,
          todayClass,
          transitionClass,
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span className={numberSpanClass}>
          <span className="absolute right-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2 border-green-800" style={{background: 'linear-gradient(to right, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)'}}></span>
          <span className="relative z-10 h-10 flex items-center">{day.date()}</span>
        </span>
      </button>
    );
  }

  // Fade in sobresaliente en el primer día del mes siguiente
  if (
    day.isSame(day.startOf('month'), 'day') &&
    (
      (range.start && range.end && (range.start.isSame(day.subtract(1, 'day'), 'day') || range.start.isBefore(day)) && (range.end.isSame(day, 'day') || range.end.isAfter(day))) ||
      (range.start && !range.end && hoverDay && range.start.month() !== hoverDay.month() && (
        (day.isAfter(hoverDay, 'day') && day.isBefore(range.start, 'day')) ||
        (day.isAfter(range.start, 'day') && day.isBefore(hoverDay, 'day')) ||
        day.isSame(hoverDay, 'day') ||
        day.isSame(range.start, 'day')
      ))
    )
  ) {
    let rounded = "";
    if (range.start && !range.end && hoverDay) {
      const minDay = range.start.isBefore(hoverDay, 'day') ? range.start : hoverDay;
      const maxDay = range.start.isAfter(hoverDay, 'day') ? range.start : hoverDay;
      if (day.isSame(minDay, 'day')) rounded = 'rounded-l-full border-l-2 ';
      if (day.isSame(maxDay, 'day')) rounded = 'rounded-r-full border-r-2 ';
    } else {
      const isEnd = range.end && day.isSame(range.end, 'day');
      if (isEnd) rounded = 'rounded-r-full border-r-2 ';
    }
    const numberSpanClass = `bg-[#b6f2d5] border-t-2 border-b-2 border-green-800 w-full h-10 flex items-center justify-center text-green-800 font-bold relative overflow-visible rounded-l-full ${rounded} z-0`;
    const textClass = "text-green-800 font-bold";
    return (
      <button
        key={day.format("YYYY-MM-DD")}
        disabled={isDisabled}
        onClick={() => onDayClick(day)}
        onMouseEnter={() => onMouseEnter(day)}
        onMouseLeave={onMouseLeave}
        className={[
          "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
          textClass,
          todayClass,
          transitionClass,
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span className={numberSpanClass}>
          <span className="absolute left-[-16px] top-1/2 -translate-y-1/2 h-10 w-12 z-[-1] border-t-2 border-b-2 border-green-800" style={{background: 'linear-gradient(to left, #b6f2d5 0%, #b6f2d5 60%, transparent 100%)'}}></span>
          <span className="relative z-10 h-10 flex items-center">{day.date()}</span>
        </span>
      </button>
    );
  }

  // Hover aro verde cuando no hay selección o cuando hay rango completo y hover fuera del rango
  if (
    !isDisabled &&
    hovered &&
    (
      (!range.start && !range.end) ||
      (range.start && range.end && !day.isSame(range.start, 'day') && !day.isSame(range.end, 'day') && !isInRange(day))
    )
  ) {
    const numberSpanClass = "ring-2 ring-green-800 rounded-full w-10 h-10 flex items-center justify-center bg-white";
    const textClass = "text-green-800 font-bold";
    return (
      <button
        key={day.format("YYYY-MM-DD")}
        disabled={isDisabled}
        onClick={() => onDayClick(day)}
        onMouseEnter={() => onMouseEnter(day)}
        onMouseLeave={onMouseLeave}
        className={[
          "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
          textClass,
          todayClass,
          transitionClass,
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <span className={numberSpanClass}>{day.date()}</span>
      </button>
    );
  }

  // Render general
  const numberSpanClass = getNumberSpanClass({ ...props, isDisabled });
  const textClass = getTextClass({ ...props, isDisabled });

  return (
    <button
      key={day.format("YYYY-MM-DD")}
      disabled={isDisabled}
      onClick={() => onDayClick(day)}
      onMouseEnter={() => onMouseEnter(day)}
      onMouseLeave={onMouseLeave}
      className={[
        "w-14 h-14 flex items-center justify-center text-sm p-0 bg-transparent focus:outline-none",
        textClass,
        todayClass,
        transitionClass,
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span className={numberSpanClass}>{day.date()}</span>
    </button>
  );
}

export type { DayCellProps }; 