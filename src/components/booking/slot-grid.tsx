"use client";

/**
 * SlotGrid — grilla de slots horarios para un día dado.
 *
 * Props:
 *   slots: Slot[] — slots disponibles para el día
 *   selectedSlot: string | null — startUtc del slot seleccionado
 *   onSelectSlot: (startUtc: string) => void
 *   isLoading: boolean
 *   dateLocal: string | null — fecha seleccionada YYYY-MM-DD
 *
 * Grilla: 4 cols desktop, 2 mobile.
 * Cada slot muestra la hora local (startLocal) en formato "HH:mm".
 * Click → preselecciona y hace scroll suave al form.
 * Empty state si no hay slots: mensaje + link a WhatsApp.
 */

import * as React from "react";
import type { Slot } from "@/lib/slots";
import { SlotGridSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarX, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface SlotGridProps {
  slots: Slot[];
  selectedSlot: string | null;
  onSelectSlot: (startUtc: string) => void;
  isLoading: boolean;
  dateLocal: string | null;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
  dateLocal,
}: SlotGridProps) {
  const handleSlotClick = (slot: Slot) => {
    onSelectSlot(slot.startUtc);
    // Scroll suave al form — esperar frame para que React actualice el estado primero
    requestAnimationFrame(() => {
      const formEl = document.getElementById("booking-form");
      if (formEl) {
        const headerOffset = 96;
        const top = formEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  };

  // Estado: sin fecha seleccionada
  if (!dateLocal) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <p className="font-ui text-sm text-text-tertiary">
          Seleccioná un día en el calendario para ver los horarios disponibles.
        </p>
      </div>
    );
  }

  // Estado: cargando
  if (isLoading) {
    return <SlotGridSkeleton rows={3} />;
  }

  // Estado: sin slots en el día
  if (slots.length === 0) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
        <CalendarX className="size-10 text-text-tertiary" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-ui text-sm font-medium text-carbon">
            Sin disponibilidad para ese día.
          </p>
          <p className="font-ui text-sm text-text-tertiary">
            Probá otro día o contactanos por WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=Hola%2C%20quería%20consultar%20disponibilidad%20de%20turnos`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2",
            "font-ui text-sm font-medium text-marino",
            "border border-marino rounded-[4px] px-4 py-2",
            "hover:bg-marino hover:text-bg",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
          )}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Consultar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div role="group" aria-label="Horarios disponibles">
      <p className="sr-only">{slots.length} horarios disponibles. Seleccioná uno para continuar.</p>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4"
        role="listbox"
        aria-label="Horarios disponibles"
      >
        {slots.map((slot) => {
          const isSelected = slot.startUtc === selectedSlot;
          return (
            <button
              key={slot.startUtc}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSlotClick(slot)}
              className={cn(
                "relative flex items-center justify-center",
                "h-12 rounded-[4px] px-2",
                "font-ui text-sm font-medium tabular-nums",
                "border",
                "transition-all duration-150 cursor-pointer select-none",
                "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2",
                // Estado base
                !isSelected && [
                  "border-border-default",
                  "bg-bg text-carbon",
                  "hover:border-marino hover:text-marino hover:bg-marino-subtle",
                ],
                // Estado seleccionado — dorado sobre marino AA 7.33:1
                isSelected && [
                  "border-dorado bg-dorado",
                  "text-marino font-semibold",
                  "shadow-[var(--shadow-accent)]",
                ]
              )}
              aria-label={`Turno a las ${slot.startLocal} hs`}
            >
              {slot.startLocal}
            </button>
          );
        })}
      </div>
      {selectedSlot && (
        <p
          className="mt-3 font-ui text-xs text-disponible font-medium"
          role="status"
          aria-live="polite"
        >
          Horario seleccionado: {slots.find((s) => s.startUtc === selectedSlot)?.startLocal} hs —
          Completá tus datos abajo.
        </p>
      )}
    </div>
  );
}
