import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Card — contenedor institucional con variantes visuales.
 *
 * Variantes:
 *   default  → blanco roto con borde y sombra sm — uso general
 *   ghost    → sin borde explícito, bg-secondary — info panels, sidebars
 *   dark     → sobre fondo marino — stats, about, secciones oscuras
 *   accent   → blanco roto con acento dorado izquierdo (::before)
 *
 * Border-radius max: 8px (--radius-lg) — tono institucional, no rounded-2xl.
 */
const cardVariants = cva(
  ["relative flex flex-col gap-0 overflow-hidden", "transition-all duration-250 ease-primary"].join(
    " "
  ),
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--color-bg)] text-[var(--color-carbon)]",
          "border border-[var(--color-border-default)]",
          "rounded-[6px]",
          "shadow-[var(--shadow-sm)]",
        ].join(" "),

        ghost: [
          "bg-[var(--color-bg-secondary)] text-[var(--color-carbon)]",
          "border border-[var(--color-border-default)]",
          "rounded-[6px]",
        ].join(" "),

        dark: [
          "bg-transparent text-[var(--color-bg)]",
          "border border-[rgba(201,169,97,0.30)]",
          "rounded-[6px]",
        ].join(" "),

        /** Card con franja dorada izquierda — para info destacada */
        accent: [
          "bg-[var(--color-bg)] text-[var(--color-carbon)]",
          "border border-[var(--color-border-default)]",
          "border-l-[3px] border-l-[var(--color-dorado)]",
          "rounded-[6px]",
          "shadow-[var(--shadow-sm)]",
        ].join(" "),

        /** Card oscura completa — para CTA card en booking */
        "dark-solid": [
          "bg-[var(--color-marino)] text-[var(--color-bg)]",
          "border-t-4 border-t-[var(--color-dorado)] border-x-0 border-b-0",
          "rounded-[8px]",
          "shadow-[var(--shadow-xl)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-serif text-2xl font-medium leading-snug tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        "font-body text-sm text-[var(--color-text-secondary)] leading-normal",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6 pb-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 py-4 border-t border-[var(--color-border-default)]",
        className
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
