import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge — etiqueta compacta institucional.
 *
 * Variantes semánticas:
 *   area-legal   → fondo bg-secondary + texto secondary  (áreas de práctica en cards)
 *   credencial   → marino bg + texto blanco roto         (matrícula, años, stats)
 *   confirmed    → verde suave                           (turno confirmado)
 *   pending      → ámbar suave                           (turno pendiente)
 *   cancelled    → rojo suave                            (turno cancelado)
 *   completed    → marino suave                          (turno completado)
 *   info         → marino suave genérico
 *   warning      → ámbar suave genérico
 *   danger       → rojo suave genérico
 *   success      → verde suave genérico
 */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "font-ui font-semibold tracking-wide uppercase",
    "border border-transparent",
    "transition-colors duration-fast",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Default — área legal en cards */
        "area-legal": [
          "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]",
          "border-[var(--color-border-default)]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Credencial institucional — marino sólido */
        credencial: [
          "bg-[var(--color-marino)] text-[var(--color-bg)]",
          "text-xs px-2.5 py-1 rounded-[2px]",
        ].join(" "),

        /** Estado turno — confirmado */
        confirmed: [
          "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Estado turno — pendiente */
        pending: [
          "bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Estado turno — cancelado */
        cancelled: [
          "bg-[#FEE2E2] text-[var(--color-error)] border-[#FCA5A5]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Estado turno — completado */
        completed: [
          "bg-[var(--color-marino-subtle)] text-[var(--color-marino)] border-[#C5CFDF]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Info genérico */
        info: [
          "bg-[var(--color-marino-subtle)] text-[var(--color-marino)]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Warning genérico */
        warning: ["bg-[#FEF3C7] text-[#B45309]", "text-xs px-2 py-0.5 rounded-[2px]"].join(" "),

        /** Danger genérico */
        danger: [
          "bg-[#FEE2E2] text-[var(--color-error)]",
          "text-xs px-2 py-0.5 rounded-[2px]",
        ].join(" "),

        /** Success genérico */
        success: ["bg-[#DCFCE7] text-[#15803D]", "text-xs px-2 py-0.5 rounded-[2px]"].join(" "),
      },
    },
    defaultVariants: {
      variant: "area-legal",
    },
  }
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
