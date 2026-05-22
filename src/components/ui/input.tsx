import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

/**
 * Input — campo de texto institucional De Luca.
 *
 * Focus: borde marino 2px + ring marino suave.
 * Error:  aria-invalid="true" → borde rojo + ring rojo.
 * Valid:  data-valid="true"   → borde verde.
 *
 * Siempre full-width dentro de su contenedor (w-full).
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Base — box-border + width 100% para evitar overflow
        "block w-full min-w-0 max-w-full box-border",
        "bg-[var(--color-bg)] text-[var(--color-carbon)]",
        "font-ui text-base placeholder:text-[var(--color-text-tertiary)]",
        "px-3.5 py-2.5 min-h-11",
        "border border-[var(--color-border-default)]",
        "rounded-[6px]",
        "outline-none",
        // Hover
        "hover:border-[var(--color-border-strong)]",
        "transition-[border-color,box-shadow] duration-150",
        // Focus — solo color + ring exterior, sin cambiar border-width
        "focus:border-[var(--color-marino)]",
        "focus:bg-white",
        "focus:shadow-[0_0_0_2px_rgba(15,30,61,0.18)]",
        // Disabled
        "disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]",
        "disabled:cursor-not-allowed disabled:border-[#CBD5E1]",
        // Error via aria-invalid — solo color + ring rojo
        "aria-invalid:border-[var(--color-error)]",
        "aria-invalid:shadow-[0_0_0_2px_rgba(185,28,28,0.18)]",
        // Valid via data attribute — solo color
        "data-[valid=true]:border-[var(--color-success)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
