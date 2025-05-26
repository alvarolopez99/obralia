import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DayCell } from './DayCell';

type DateRange = { start: Dayjs | null; end: Dayjs | null };

interface MonthCalendarProps {
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

export function MonthCalendar({ month, range, hoverDay, today, onDayClick, onMouseEnter, onMouseLeave, isInRange, isSelected, isHovered }: MonthCalendarProps) {
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
      <div className="text-center font-semibold text-gray-900 select-none text-sm mb-2">
        {`${month.format("MMMM").toLowerCase()} ${month.format("YYYY")}`}
      </div>
      <div className="grid grid-cols-7 text-sm text-gray-400 mb-1 gap-x-3">
        {weekdays.map((d: string) => (
          <div key={d} className="text-center select-none">{d.toLowerCase()}</div>
        ))}
      </div>
      <div className="flex flex-col gap-y-2">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-x-3">
            {week.map((d: Dayjs) => (
              <DayCell
                key={d.format("YYYY-MM-DD")}
                day={d}
                month={month}
                range={range}
                hoverDay={hoverDay}
                today={today}
                onDayClick={onDayClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                isInRange={isInRange}
                isSelected={isSelected}
                isHovered={isHovered}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 