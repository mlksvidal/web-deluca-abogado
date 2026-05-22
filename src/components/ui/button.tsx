"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button — componente institucional De Luca Abogado.
 *
 * Variantes: primary | secondary | ghost | link | gold | danger
 * Tamaños: sm | md (default) | lg | icon
 *
 * Shimmer sweep dorado (::before) activado vía clase `btn-shimmer` definida
 * en globals.css. Solo aplica en primary, gold y danger — no en ghost/link.
 *
 * Regla de contraste:
 *   primary  → bg marino  + texto blanco roto  (15.43:1 AAA)
 *   gold     → bg dorado  + texto marino       (7.33:1 AA) — solo sobre fondos oscuros
 *   danger   → bg rojo    + texto blanco       (6.33:1 AA)
 */
const buttonVariants = cva(
  // Base compartida — todos los botones
  [
    "group/button",
    "relative inline-flex items-center justify-center gap-2.5",
    "font-ui text-sm font-medium tracking-wide uppercase",
    "border border-transparent",
    "transition-all duration-250 ease-primary",
    "select-none cursor-pointer whitespace-nowrap",
    "outline-none",
    "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Contenedor de isolate para shimmer
    "isolate overflow-hidden",
    // Shimmer sweep — pseudo-elemento definido en globals.css (.btn-shimmer::before)
    "btn-shimmer",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Marino bg + blanco roto texto — CTA principal */
        primary: [
          "bg-[var(--color-marino)] text-[var(--color-bg)]",
          "shadow-[var(--shadow-sm)]",
          "rounded-sm",
          "hover:bg-[var(--color-marino-hover)] hover:-translate-y-0.5",
          "hover:shadow-[var(--shadow-accent)]",
          "active:translate-y-0 active:shadow-[var(--shadow-xs)] active:bg-[#0A1630]",
          "duration-250",
        ].join(" "),

        /** Outline marino + inversión en hover — CTA secundario sobre fondos claros */
        secondary: [
          "bg-transparent text-[var(--color-marino)]",
          "border-2 border-[var(--color-marino)]",
          "rounded-sm",
          "hover:bg-[var(--color-marino)] hover:text-[var(--color-bg)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
          "active:translate-y-0 active:bg-[#0A1630] active:text-[var(--color-bg)]",
        ].join(" "),

        /** Transparente — acciones secundarias en contexto claro */
        ghost: [
          "bg-transparent text-[var(--color-marino)]",
          "rounded-sm",
          "hover:bg-[var(--color-marino-subtle)]",
          "active:bg-[var(--color-marino-subtle)]",
          // sin shimmer — sobreescribir antes pseudo-elemento
          "[&::before]:hidden",
        ].join(" "),

        /** Solo texto con underline animado */
        link: [
          "bg-transparent text-[var(--color-marino)]",
          "p-0 h-auto tracking-normal normal-case font-normal",
          "underline underline-offset-4 decoration-[var(--color-dorado)]",
          "hover:decoration-2",
          "[&::before]:hidden",
        ].join(" "),

        /** Dorado bg + marino texto — SOLO sobre fondos oscuros (hero, booking card) */
        gold: [
          "bg-[var(--color-dorado)] text-[var(--color-marino)]",
          "rounded-sm",
          "shadow-[var(--shadow-sm)]",
          "hover:bg-[var(--color-dorado-hover)] hover:-translate-y-0.5",
          "hover:shadow-[var(--shadow-accent)]",
          "active:translate-y-0 active:bg-[var(--color-dorado-deep)]",
        ].join(" "),

        /** Rojo — solo en modales de cancelación/destrucción */
        danger: [
          "bg-[var(--color-emergencia)] text-white",
          "rounded-sm",
          "shadow-[var(--shadow-sm)]",
          "hover:bg-[#991B1B] hover:-translate-y-px",
          "hover:shadow-[var(--shadow-md)]",
          "active:translate-y-0 active:bg-[#7F1D1D]",
        ].join(" "),

        /** Outline hero — sobre overlay marino en hero section */
        "ghost-inverse": [
          "bg-transparent text-[var(--color-bg)]",
          "border border-[rgba(250,247,242,0.5)]",
          "rounded-sm",
          "hover:border-[rgba(250,247,242,0.8)] hover:bg-[rgba(250,247,242,0.10)]",
          "[&::before]:hidden",
        ].join(" "),
      },
      size: {
        sm: "h-10 px-5 py-2.5 text-xs",
        md: "h-11 px-7 py-3",
        lg: "h-12 px-8 py-3.5 text-base",
        icon: "size-11 p-0 tracking-normal normal-case",
      },
      isLoading: {
        true: "pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      isLoading: false,
    },
  }
);

/** Flecha inline que se mueve en hover — opcional por slot */
function ButtonArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block transition-transform duration-250 ease-primary group-hover/button:translate-x-1",
        className
      )}
    >
      →
    </span>
  );
}

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Muestra spinner y deshabilita interacción */
    isLoading?: boolean;
    /** Texto del spinner para lectores de pantalla */
    loadingText?: string;
    /** Mostrar flecha animada al final */
    withArrow?: boolean;
  };

function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText = "Cargando…",
  withArrow = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, isLoading }), className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText}</span>
          {/* Children ocultos visualmente — mantiene ancho del botón */}
          <span aria-hidden="true" className="invisible absolute">
            {children}
          </span>
        </>
      ) : (
        <>
          {children}
          {withArrow && <ButtonArrow />}
        </>
      )}
    </ButtonPrimitive>
  );
}

export { Button, ButtonArrow, buttonVariants };
export type { ButtonProps };
