"use client";

/**
 * Singleton de Lenis + helper de scroll.
 *
 * Evita usar React state para publicar la instancia (que dispara el lint
 * `react-hooks/set-state-in-effect`). El LenisProvider setea el singleton al
 * montar; cualquier componente puede pedir scroll suave vía `lenisScrollTo`,
 * con fallback nativo cuando Lenis no está activo (prefers-reduced-motion).
 */

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenisInstance(l: Lenis | null) {
  instance = l;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}

type ScrollTarget = string | HTMLElement | number;

/** Altura aproximada del header sticky — offset para que los anchors no queden tapados. */
const HEADER_OFFSET = -84;

export function lenisScrollTo(
  target: ScrollTarget,
  options?: { offset?: number; duration?: number }
) {
  const offset = options?.offset ?? HEADER_OFFSET;

  if (instance) {
    instance.scrollTo(target, {
      offset,
      duration: options?.duration ?? 1.1,
    });
    return;
  }

  // Fallback nativo (reduced-motion o antes de montar Lenis)
  if (typeof window === "undefined") return;

  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
    return;
  }

  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
