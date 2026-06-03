"use client";

/**
 * ScrollProgress — barra dorada fija arriba que refleja el avance de lectura.
 *
 * Atada a ScrollTrigger (que a su vez está sincronizado con Lenis vía el
 * LenisProvider). Bajo prefers-reduced-motion sigue funcionando contra el
 * scroll nativo — un indicador de progreso no genera molestia vestibular.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { scaleX: 0, transformOrigin: "0 50%" });

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress });
      },
    });

    return () => st.kill();
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
