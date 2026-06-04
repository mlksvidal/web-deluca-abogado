"use client";

/**
 * CursorGlow — anillo dorado que sigue al cursor con lerp (trailing).
 *
 * Mantiene el cursor nativo (accesibilidad) y agrega un anillo de acento que
 * se expande al pasar sobre elementos interactivos. Solo en punteros finos
 * (desktop) y si el usuario no pidió movimiento reducido.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

export function CursorGlow() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.to(ring, { opacity: 1, duration: 0.35 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) {
        ring.classList.add("cursor-ring--active");
      }
    };
    const out = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) {
        ring.classList.remove("cursor-ring--active");
      }
    };
    const leave = () => {
      gsap.to(ring, { opacity: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerout", out);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}
