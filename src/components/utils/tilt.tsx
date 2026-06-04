"use client";

/**
 * Tilt — inclina el elemento en 3D hacia el cursor (rotateX/Y) y vuelve suave
 * al salir. Da sensación de profundidad/vida a las cards.
 * Desktop (pointer fino) + respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function Tilt({
  children,
  max = 7,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotateY: px * max,
        rotateX: -py * max,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 900,
        transformOrigin: "center",
      });
    };
    const leave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);

  // Sin transformStyle:preserve-3d estático: el rotateX/Y va sobre este mismo
  // div (con transformPerspective en la tween), no sobre hijos 3D. Dejarlo fijo
  // promueve una capa permanente y desenfoca el texto por subpíxel en reposo.
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
