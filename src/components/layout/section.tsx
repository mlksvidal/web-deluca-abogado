import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Section — sección de página con espaciado vertical institucional.
 *
 * Espaciado vertical fluido (mobile → desktop):
 *   sm: 64px  (mobile base)
 *   md: 96px  (tablet 768px+)
 *   lg: 128px (desktop 1024px+)
 *
 * Variantes de fondo:
 *   default  → bg-primary  #FAF7F2 (blanco roto)
 *   alt      → bg-warm     #F2EBDE (alternado cálido)
 *   dark     → marino      #0F1E3D (secciones de autoridad)
 *   secondary → bg-secondary #F0ECE4
 */
type SectionProps = React.ComponentProps<"section"> & {
  as?: React.ElementType;
  variant?: "default" | "alt" | "dark" | "secondary";
};

function Section({ as: Tag = "section", variant = "default", className, ...props }: SectionProps) {
  const bgStyles = {
    default: "",
    alt: "bg-bg-warm",
    // surface-deep = gradiente marino (profundidad) · grain = grano film sutil
    dark: "surface-deep grain text-bg relative overflow-hidden",
    secondary: "bg-bg-secondary",
  };

  return (
    <Tag
      data-slot="section"
      className={cn(
        // Espaciado vertical responsive
        "py-16 md:py-24 lg:py-32",
        bgStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Section };
export type { SectionProps };
