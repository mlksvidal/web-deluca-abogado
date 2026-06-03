"use client";

/**
 * Reveal — IntersectionObserver wrapper para animaciones scroll-triggered.
 *
 * Las reglas `.reveal` / `.reveal.is-visible` y las variantes direccionales
 * (`.reveal--left/right/clip`) viven en globals.css — acá NO se inyecta CSS
 * (se eliminó la duplicación que había antes).
 *
 * @example
 * <Reveal>...</Reveal>                     // fade-up (default)
 * <Reveal variant="left" delay={120}>...   // entra desde la izquierda
 * <Reveal variant="clip">...               // wipe con clip-path
 */

import { useEffect, useRef } from "react";

type RevealVariant = "up" | "left" | "right" | "clip";

type RevealProps = {
  children: React.ReactNode;
  /** Delay extra en ms (apilado sobre la transición CSS base) */
  delay?: number;
  /** Clase extra que se añade al wrapper div */
  className?: string;
  /** Umbral de visibilidad (0–1). Default 0.12 */
  threshold?: number;
  /** Dirección de entrada. Default "up" */
  variant?: RevealVariant;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.12,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Prefers-reduced-motion: mostrar inmediatamente
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const variantClass = variant !== "up" ? `reveal--${variant}` : "";

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass} ${className}`.replace(/\s+/g, " ").trim()}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
