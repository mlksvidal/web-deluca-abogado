"use client";

/**
 * BookingFlow — orquestador cliente del flujo completo de reserva.
 *
 * Estado gestionado:
 *   - selectedDate: string | null — fecha YYYY-MM-DD seleccionada
 *   - selectedSlot: string | null — startUtc del slot seleccionado
 *   - slots: Slot[] — slots disponibles para selectedDate
 *   - slotsLoading: boolean
 *   - slotsError: string | null
 *
 * Cuando el usuario selecciona una fecha:
 *   1. Limpia selectedSlot
 *   2. Llama getAvailableSlotsForDay(date) server action
 *   3. Actualiza slots state
 *
 * Layout: 2 cols desktop (calendario izq, slots+form der)
 *          1 col mobile (apilado)
 */

import * as React from "react";
import { toast } from "sonner";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

import type { Slot } from "@/lib/slots";
import { TIMEZONE } from "@/lib/schedule-config";
import { getAvailableSlotsForDay } from "@/app/actions/slots";
import { BookingCalendar } from "./booking-calendar";
import { SlotGrid } from "./slot-grid";
import { BookingForm } from "./booking-form";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface BookingFlowProps {
  availableDates: string[];
}

// ─── Helper: formatear label del slot seleccionado ────────────────────────────

function formatSlotLabel(dateLocal: string, slotTime: string): string {
  // dateLocal: "2026-06-15", slotTime: "09:00"
  try {
    const [year, month, day] = dateLocal.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dateStr = formatInTimeZone(dateObj, TIMEZONE, "EEEE d 'de' MMMM", {
      locale: es,
    });
    // Capitalizar primer char
    const dateCapitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    return `${dateCapitalized} a las ${slotTime} hs`;
  } catch {
    return `${dateLocal} ${slotTime} hs`;
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function BookingFlow({ availableDates }: BookingFlowProps) {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  // ─── Handler: selección de fecha ─────────────────────────────────────────

  const handleSelectDate = React.useCallback(async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    setSlotsLoading(true);

    try {
      const result = await getAvailableSlotsForDay(date);
      if (result.success) {
        setSlots(result.slots);
      } else {
        toast.error("No se pudieron cargar los horarios", {
          description: result.error,
        });
      }
    } catch {
      toast.error("No se pudieron cargar los horarios", {
        description: "Revisá tu conexión e intentá de nuevo.",
      });
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // ─── Handler: slot tomado (error race condition) ──────────────────────────

  const handleSlotTaken = React.useCallback(() => {
    setSelectedSlot(null);
    // Refrescar slots del día actual para mostrar el estado actualizado
    if (selectedDate) {
      handleSelectDate(selectedDate);
    }
  }, [selectedDate, handleSelectDate]);

  // ─── Label del slot seleccionado ─────────────────────────────────────────

  const selectedSlotLabel = React.useMemo(() => {
    if (!selectedSlot || !selectedDate) return "";
    const slot = slots.find((s) => s.startUtc === selectedSlot);
    if (!slot) return "";
    return formatSlotLabel(selectedDate, slot.startLocal);
  }, [selectedSlot, selectedDate, slots]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr] lg:gap-12 xl:grid-cols-[420px_1fr]">
      {/* ─── Columna izquierda: Calendario ──────────────────────────────── */}
      <div className="space-y-6">
        {/* Calendario */}
        <div
          className="rounded-[6px] border border-[var(--color-border-default)] bg-white p-5 shadow-[var(--shadow-sm)]"
          aria-label="Seleccioná una fecha"
        >
          <h2 className="mb-4 font-ui text-sm font-semibold uppercase tracking-wide text-[var(--color-marino)]">
            1. Elegí un día
          </h2>
          {availableDates.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-ui text-sm text-[var(--color-text-tertiary)]">
                No hay disponibilidad en los próximos 30 días.
              </p>
              <p className="mt-1 font-ui text-sm text-[var(--color-text-tertiary)]">
                Consultanos por WhatsApp para coordinar.
              </p>
            </div>
          ) : (
            <BookingCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
        </div>

        {/* Horarios del día seleccionado */}
        <div
          className="rounded-[6px] border border-[var(--color-border-default)] bg-white p-5 shadow-[var(--shadow-sm)]"
          aria-label="Horarios disponibles"
          aria-live="polite"
          aria-atomic="false"
        >
          <h2 className="mb-4 font-ui text-sm font-semibold uppercase tracking-wide text-[var(--color-marino)]">
            2. Elegí un horario
          </h2>
          <SlotGrid
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            isLoading={slotsLoading}
            dateLocal={selectedDate}
          />
        </div>
      </div>

      {/* ─── Columna derecha: Formulario ────────────────────────────────── */}
      <div>
        <div className="rounded-[6px] border border-[var(--color-border-default)] bg-white p-6 shadow-[var(--shadow-sm)] lg:sticky lg:top-28">
          <h2 className="mb-6 font-ui text-sm font-semibold uppercase tracking-wide text-[var(--color-marino)]">
            3. Tus datos
          </h2>
          <BookingForm
            selectedSlotUtc={selectedSlot}
            selectedDateLabel={selectedSlotLabel}
            onSlotTaken={handleSlotTaken}
          />
        </div>
      </div>
    </div>
  );
}
