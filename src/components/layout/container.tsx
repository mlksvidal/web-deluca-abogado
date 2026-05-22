import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Container — contenedor máximo centrado con padding responsive.
 *
 * Usa max-width + mx-auto para centrar, y padding clamp para márgenes laterales.
 *
 * Variantes de ancho máximo:
 *   default  → 1200px (editorial principal)
 *   narrow   → 768px  (formularios, texto solo)
 *   wide     → 1440px (full-bleed con control)
 */
type ContainerProps = React.ComponentProps<"div"> & {
  as?: React.ElementType;
  size?: "default" | "narrow" | "wide";
};

function Container({ as: Tag = "div", size = "default", className, ...props }: ContainerProps) {
  const maxWidth = {
    default: "1200px",
    narrow: "768px",
    wide: "1440px",
  }[size];

  return (
    <Tag
      data-slot="container"
      className={cn("w-full", className)}
      style={{
        maxWidth,
        marginInline: "auto",
        paddingInline: "clamp(20px, 4vw, 40px)",
      }}
      {...props}
    />
  );
}

export { Container };
export type { ContainerProps };
