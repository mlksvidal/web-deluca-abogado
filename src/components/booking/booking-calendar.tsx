"use client";

/**
 * BookingCalendar — componente cliente para selección de fecha.
 *
 * Props:
 *   availableDates: string[] — fechas YYYY-MM-DD con disponibilidad (del server)
 *   selectedDate: string | null — fecha seleccionada actualmente
 *   onSelectDate: (date: string) => void — callback al seleccionar
 *
 * Comportamiento:
 *   - Solo habilita días que están en availableDates
 *   - Día seleccionado con bg dorado (override CalendarDayButton)
 *   - Mobile: DayPicker con layout compacto
 *   - Navega mes a mes con botones prev/next
 *   - Muestra próximos 30 días máx
 *   - Locale es_AR (date-fns/locale)
 */

import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { es } from "date-fns/locale";
import { addDays, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SCHEDULE_CONFIG, TIMEZONE } from "@/lib/schedule-config";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface BookingCalendarProps {
  availableDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  className?: string;
}

// ─── Helper: string YYYY-MM-DD → Date local midnight ─────────────────────────

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ─── Helper: Date → string YYYY-MM-DD ────────────────────────────────────────

function formatDateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function BookingCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
  className,
}: BookingCalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  // Rango de navegación: hoy → hoy + maxWindowDays
  const nowMendoza = toZonedTime(new Date(), TIMEZONE);
  const todayMendoza = startOfDay(nowMendoza);
  const maxDate = addDays(todayMendoza, SCHEDULE_CONFIG.maxWindowDays);

  // Set de fechas disponibles para lookup rápido
  const availableSet = React.useMemo(() => new Set(availableDates), [availableDates]);

  // Mes mostrado actualmente
  const [month, setMonth] = React.useState<Date>(todayMendoza);

  // Convertir selectedDate a objeto Date para react-day-picker
  const selectedDay = React.useMemo(
    () => (selectedDate ? parseDateLocal(selectedDate) : undefined),
    [selectedDate]
  );

  // Función de disability: deshabilitar días sin disponibilidad o fuera del rango
  const isDisabled = React.useCallback(
    (date: Date): boolean => {
      const str = formatDateLocal(date);
      const isBeforeToday = date < todayMendoza;
      const isAfterMax = date > maxDate;
      const hasNoSlots = !availableSet.has(str);
      return isBeforeToday || isAfterMax || hasNoSlots;
    },
    [availableSet, todayMendoza, maxDate]
  );

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    const str = formatDateLocal(day);
    if (availableSet.has(str)) {
      onSelectDate(str);
    }
  };

  return (
    <div
      className={cn("booking-calendar", className)}
      role="group"
      aria-label="Calendario de turnos disponibles"
    >
      <DayPicker
        mode="single"
        selected={selectedDay}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        startMonth={todayMendoza}
        endMonth={maxDate}
        disabled={isDisabled}
        locale={es}
        showOutsideDays={false}
        classNames={{
          root: cn(
            "w-full",
            "[--cell-size:--spacing(10)] md:[--cell-size:--spacing(11)]",
            "[--cell-radius:4px]",
            defaultClassNames.root
          ),
          months: cn("flex flex-col gap-4", defaultClassNames.months),
          month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
          nav: cn(
            "absolute inset-x-0 top-0 flex items-center justify-between px-1",
            defaultClassNames.nav
          ),
          button_previous: cn(
            "flex size-(--cell-size) items-center justify-center",
            "rounded-[4px] border border-border-default",
            "text-marino hover:bg-marino-subtle",
            "transition-colors duration-150 cursor-pointer",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            "flex size-(--cell-size) items-center justify-center",
            "rounded-[4px] border border-border-default",
            "text-marino hover:bg-marino-subtle",
            "transition-colors duration-150 cursor-pointer",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            "flex h-(--cell-size) items-center justify-center",
            "font-ui text-sm font-medium text-marino uppercase tracking-wide",
            defaultClassNames.month_caption
          ),
          caption_label: cn(
            "font-ui text-sm font-semibold text-marino select-none uppercase tracking-wide",
            defaultClassNames.caption_label
          ),
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "flex-1 text-center text-[0.7rem] font-ui font-medium",
            "text-text-tertiary uppercase tracking-wide select-none py-1",
            defaultClassNames.weekday
          ),
          week: cn("mt-1 flex w-full", defaultClassNames.week),
          day: cn(
            "group/calday relative flex-1 aspect-square p-0 text-center",
            defaultClassNames.day
          ),
          day_button: cn(
            "relative w-full h-full flex items-center justify-center",
            "rounded-[4px]",
            "font-ui text-sm",
            "transition-all duration-150 cursor-pointer",
            // Estado base disponible
            "text-carbon hover:bg-marino-subtle hover:text-marino",
            // Estado seleccionado — bg dorado con texto marino (AA ratio 7.33:1)
            "aria-pressed:bg-dorado aria-pressed:text-marino aria-pressed:font-semibold",
            "data-[selected=true]:bg-dorado data-[selected=true]:text-marino data-[selected=true]:font-semibold",
            // Estado deshabilitado
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-carbon",
            // Focus
            "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2",
            defaultClassNames.day_button
          ),
          today: cn("font-semibold", defaultClassNames.today),
          selected: cn(defaultClassNames.selected),
          disabled: cn("opacity-30", defaultClassNames.disabled),
          outside: cn("opacity-0 pointer-events-none", defaultClassNames.outside),
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeftIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            ),
        }}
      />
    </div>
  );
}
