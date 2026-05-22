import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea — campo de texto multilínea institucional.
 *
 * Hereda todas las specs visuales de Input.
 * Resize: solo eje Y (no rompre layout horizontal).
 * Counter de caracteres: ver CharCounter export.
 */
type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Muestra el contador de caracteres (requiere maxLength) */
  showCounter?: boolean;
  /** Valor actual para el counter (debe pasarse cuando showCounter=true) */
  currentLength?: number;
};

function Textarea({
  className,
  showCounter = false,
  currentLength = 0,
  maxLength,
  ...props
}: TextareaProps) {
  const isNearLimit = maxLength && currentLength > maxLength * 0.9;
  const isOver = maxLength && currentLength > maxLength;

  return (
    <div className="relative">
      <textarea
        data-slot="textarea"
        maxLength={maxLength ? maxLength + 50 : undefined} // Permitir pasar para mostrar error, no bloquear abruptamente
        className={cn(
          // Base — hereda specs de Input
          "block w-full min-w-0",
          "bg-[var(--color-bg)] text-[var(--color-carbon)]",
          "font-ui text-base placeholder:text-[var(--color-text-tertiary)]",
          "px-3.5 py-2.5",
          "min-h-[120px] max-h-[300px]",
          "border border-[var(--color-border-default)]",
          "rounded-[6px]",
          "shadow-[inset_0_1px_3px_rgba(15,30,61,0.08)]",
          "outline-none",
          "resize-y",
          "leading-[1.6]",
          // Hover
          "hover:border-[var(--color-border-strong)]",
          "transition-[border-color,box-shadow] duration-150",
          // Focus
          "focus:border-2 focus:border-[var(--color-marino)]",
          "focus:bg-white",
          "focus:shadow-[0_0_0_3px_rgba(15,30,61,0.12)]",
          // Disabled
          "disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]",
          "disabled:cursor-not-allowed disabled:border-[#CBD5E1]",
          // Error
          "aria-invalid:border-2 aria-invalid:border-[var(--color-error)]",
          "aria-invalid:shadow-[0_0_0_3px_rgba(185,28,28,0.12)]",
          showCounter && "pb-8", // Espacio para el counter
          className
        )}
        {...props}
      />
      {showCounter && maxLength && (
        <span
          className={cn(
            "absolute bottom-2 right-3",
            "font-ui text-xs tabular-nums",
            "pointer-events-none select-none",
            !isNearLimit && "text-[var(--color-text-tertiary)]",
            isNearLimit && !isOver && "text-[var(--color-warning)]",
            isOver && "text-[var(--color-error)]"
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {currentLength} / {maxLength}
        </span>
      )}
    </div>
  );
}

export { Textarea };
export type { TextareaProps };
