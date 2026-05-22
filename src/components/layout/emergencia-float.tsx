"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/**
 * EmergenciaFab — botón flotante de emergencia 24h.
 *
 * - Pill rojo #A91D1D, apilado encima del WhatsApp FAB
 * - Ícono shake cada ~3s (sutil — aprobado por el usuario)
 * - Hover: lift -1px + scale 1.02
 * - Link a WhatsApp con mensaje URGENTE
 * - Siempre visible (no espera scroll)
 */

const EMERGENCY_MESSAGE = encodeURIComponent(
  "URGENTE: Necesito asesoramiento legal de emergencia. Por favor contácteme a la brevedad."
);

function EmergenciaFab() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}?text=${EMERGENCY_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacto de emergencia legal 24 horas — WhatsApp urgente"
      className={cn(
        // Posición: encima del WhatsApp FAB
        "fixed bottom-24 right-6 z-[var(--z-toast)]",
        // Pill
        "flex items-center gap-2",
        "px-4 py-2.5 rounded-full",
        // Color emergencia
        "bg-[var(--color-emergencia)] text-white",
        // Sombra roja
        "shadow-[0_4px_16px_rgba(169,29,29,0.40)]",
        // Tipografía
        "font-ui text-xs font-semibold tracking-[0.06em] uppercase",
        // Transición
        "transition-all duration-250 ease-primary",
        // Hover: lift + scale
        "hover:bg-[#C72525] hover:-translate-y-px hover:scale-[1.02]",
        "hover:shadow-[0_6px_20px_rgba(169,29,29,0.55)]",
        // Active
        "active:translate-y-0 active:scale-100",
        // Focus
        "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-4",
        // Reduced motion
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
      )}
    >
      <TriangleAlert
        size={14}
        strokeWidth={2}
        aria-hidden="true"
        className="emergency-icon-shake shrink-0"
      />
      <span>Emergencia 24h</span>
    </a>
  );
}

export { EmergenciaFab };
