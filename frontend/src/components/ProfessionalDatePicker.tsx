import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ProfessionalEvent, WorkingHours } from '@/types/professional';
import { motion, AnimatePresence } from "framer-motion";

interface ProfessionalDatePickerProps {
  agenda?: ProfessionalEvent[];
  workingHours?: WorkingHours;
  value?: { date: Dayjs | null; hour: number | null };
  onSelectionChange: (data: { date: Dayjs | null; hour: number | null }) => void;
}

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export default function ProfessionalDatePicker({ agenda = [], workingHours, value, onSelectionChange }: ProfessionalDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(value?.date ?? null);
  const [selectedHour, setSelectedHour] = useState<number | null>(value?.hour ?? null);
  const [monthOffset, setMonthOffset] = useState(0);

  // Sincronizar con value externo
  useEffect(() => {
    setSelectedDate(value?.date ?? null);
    setSelectedHour(value?.hour ?? null);
    if (value?.date) {
      const today = dayjs();
      const diffMonths = value.date.startOf('month').diff(today.startOf('month'), 'month');
      setMonthOffset(diffMonths);
    }
  }, [value?.date, value?.hour]);

  // Notificar al padre cada vez que cambia la selección
  function notifyParent(date: Dayjs | null, hour: number | null) {
    onSelectionChange({ date, hour });
  }

  // Horas ocupadas en el día seleccionado
  const getBlockedHours = (date: Dayjs) => {
    const blocked = new Set<number>();
    agenda.forEach(event => {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      if (eventStart.isSame(date, 'day')) {
        const startHour = eventStart.hour();
        const endHour = eventEnd.hour();
        for (let h = startHour; h < endHour; h++) {
          blocked.add(h);
        }
      }
    });
    return blocked;
  };

  // Horario del profesional para un día concreto
  const getWorkingHoursForDay = (date: Dayjs) => {
    if (!workingHours) return { start: 8, end: 18 }; // Por defecto
    const dayKey = weekDays[date.day()];
    return workingHours[dayKey] || null;
  };

  // Sistema de ocupación por colores
  const getDayOccupationColor = (date: Dayjs) => {
    const wh = getWorkingHoursForDay(date);
    const isPast = date.isBefore(dayjs().startOf('day'), 'day');
    if (!wh || isPast) return 'bg-gray-200 text-gray-400 cursor-not-allowed'; // No trabaja ese día o pasado
    const blocked = getBlockedHours(date);
    const total = wh.end - wh.start;
    let libres = 0;
    for (let h = wh.start; h < wh.end; h++) {
      if (!blocked.has(h)) libres++;
    }
    if (libres === 0) return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    const ratio = libres / total;
    if (ratio > 0.7) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (ratio > 0.3) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  };

  // Render calendario simple (solo días)
  const renderCalendar = () => {
    const today = dayjs();
    const currentMonth = today.add(monthOffset, 'month');
    const startOfMonth = currentMonth.startOf('month');
    const days = [];
    let day = startOfMonth;
    while (day.day() !== 1) {
      day = day.subtract(1, 'day');
    }
    for (let i = 0; i < 42; i++) {
      days.push(day);
      day = day.add(1, 'day');
    }
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    // Calcular si se puede volver atrás (no antes del mes actual)
    const minMonth = today.startOf('month');
    const isPrevDisabled = currentMonth.isSame(minMonth, 'month') || currentMonth.isBefore(minMonth, 'month');
    return (
      <div className="flex flex-col w-80">
        <div className="flex flex-row items-center justify-between text-center font-semibold text-gray-900 select-none text-sm mb-2 mt-3">
          {!isPrevDisabled ? (
            <button
              onClick={() => setMonthOffset((prev) => prev - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-blue-50 hover:cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Mes anterior"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <span className="w-8 h-8 inline-block" />
          )}
          <span className="flex-1 text-center">{`${currentMonth.format('MMMM').toLowerCase()} ${currentMonth.format('YYYY')}`}</span>
          <button
            onClick={() => setMonthOffset((prev) => prev + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-blue-50 hover:cursor-pointer transition"
            aria-label="Mes siguiente"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 text-sm text-gray-400 mb-1 w-full">
          {["L", "M", "X", "J", "V", "S", "D"].map(d => (
            <div key={d} className="w-10 h-10 flex items-center justify-center text-center select-none px-0.5">{d}</div>
          ))}
        </div>
        <div className="flex flex-col">
          {weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 w-full">
              {week.map((d: Dayjs) => {
                const isSelected = selectedDate && d.isSame(selectedDate, 'day');
                const wh = getWorkingHoursForDay(d);
                const occupationColor = getDayOccupationColor(d);
                const isCurrentMonth = d.month() === currentMonth.month();
                const disabled = occupationColor.includes('gray-200');
                return !isCurrentMonth ? (
                  <div key={d.format('YYYY-MM-DD')} className="w-10 h-10" />
                ) : disabled ? (
                  <div key={d.format('YYYY-MM-DD')} className="w-10 h-10 flex items-center justify-center text-gray-300 text-sm font-semibold select-none">{d.date()}</div>
                ) : (
                  <button
                    key={d.format('YYYY-MM-DD')}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedHour(null);
                      notifyParent(d, null);
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
                      ${isSelected ? 'bg-blue-600 text-white' : occupationColor}
                      ${!isSelected && !disabled ? 'cursor-pointer' : ''}
                      transition`}
                    title={!wh ? 'No trabaja este día' : occupationColor.includes('gray-200') ? 'Día completo ocupado o pasado' : ''}
                  >
                    {d.date()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render selector de horas
  const renderHourSelector = () => {
    if (!selectedDate) return null;
    const wh = getWorkingHoursForDay(selectedDate);
    if (!wh) return <div className="mt-4 text-gray-400">No trabaja este día</div>;
    const blocked = getBlockedHours(selectedDate);
    return (
      <AnimatePresence>
        <motion.div
          key="hour-selector"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
          className="mt-4"
        >
          <div className="block text-sm font-medium text-gray-700 mb-1">Selecciona la hora</div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: wh.end - wh.start }, (_, i) => i + wh.start).map(h => {
              const isBlocked = blocked.has(h);
              return (
                <button
                  key={h}
                  disabled={isBlocked}
                  onClick={() => {
                    setSelectedHour(h);
                    notifyParent(selectedDate, h);
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-semibold border
                    ${selectedHour === h ? 'bg-blue-600 text-white border-blue-600' : isBlocked ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}
                    transition`}
                  title={isBlocked ? 'Hora ocupada' : ''}
                >
                  {`${h.toString().padStart(2, '0')}:00`}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6">
      {renderCalendar()}
      {renderHourSelector()}
    </div>
  );
} 