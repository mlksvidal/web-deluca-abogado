import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Disclaimer — bloque de aviso legal reutilizable.
 *
 * Uso: advertencias legales, notas de confidencialidad, avisos de limitación de responsabilidad.
 * Fondo: dorado-bg-subtle (#F7F1E4) — cálido, no alarmante. Borde: dorado-border-subtle.
 *
 * @example
 * <Disclaimer>
 *   La información aquí provista es orientativa y no reemplaza el asesoramiento jurídico
 *   personalizado. Consultá con un abogado para tu caso específico.
 * </Disclaimer>
 */
type DisclaimerProps = React.ComponentProps<"aside"> & {
  /** Título opcional del disclaimer */
  title?: string;
  /** Icono personalizado (default: Info de Lucide) */
  icon?: React.ReactNode;
  /** Variante visual */
  variant?: "default" | "warning" | "info";
};

function Disclaimer({
  className,
  title,
  icon,
  variant = "default",
  children,
  ...props
}: DisclaimerProps) {
  const variantStyles = {
    default: {
      container: "bg-[#F7F1E4] border-[var(--color-dorado-muted)] text-[var(--color-carbon-soft)]",
      iconColor: "text-[var(--color-dorado-deep)]",
    },
    warning: {
      container: "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]",
      iconColor: "text-[#B45309]",
    },
    info: {
      container: "bg-[var(--color-marino-subtle)] border-[#C5CFDF] text-[var(--color-marino)]",
      iconColor: "text-[var(--color-marino)]",
    },
  };

  const styles = variantStyles[variant];

  return (
    <aside
      role="note"
      className={cn(
        "flex gap-3 p-4",
        "border border-l-[3px]",
        "rounded-[4px]",
        styles.container,
        className
      )}
      {...props}
    >
      <span className={cn("mt-0.5 shrink-0", styles.iconColor)} aria-hidden="true">
        {icon ?? <Info size={16} strokeWidth={1.5} />}
      </span>
      <div className="min-w-0">
        {title && (
          <p className="font-ui font-semibold text-sm mb-1 tracking-wide uppercase">{title}</p>
        )}
        <div className="font-body text-sm leading-[1.6] [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </aside>
  );
}

export { Disclaimer };
export type { DisclaimerProps };
