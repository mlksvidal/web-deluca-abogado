import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Container — contenedor máximo con padding responsive.
 *
 * Usa `max()` para centrado perfecto sin media queries:
 *   padding: max(24px, calc((100vw - 1200px) / 2))
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
      className={cn("w-full mx-auto", className)}
      style={{
        maxWidth,
        paddingInline: `max(24px, calc((100vw - ${maxWidth}) / 2))`,
      }}
      {...props}
    />
  );
}

export { Container };
export type { ContainerProps };
