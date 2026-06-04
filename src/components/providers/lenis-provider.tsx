"use client";

/**
 * LenisProvider — smooth scroll + integración con GSAP ScrollTrigger.
 *
 * - Lenis maneja el smooth scroll (lerp).
 * - El raf de Lenis se mueve al ticker de GSAP (una sola fuente de verdad de tiempo).
 * - `lenis.on('scroll', ScrollTrigger.update)` mantiene los triggers sincronizados
 *   con el scroll suave (sin esto, cualquier ScrollTrigger se desincroniza).
 * - La instancia se publica en un singleton (`setLenisInstance`) para que header,
 *   anchors, etc. usen `lenisScrollTo` en lugar de scroll nativo que pelea con Lenis.
 * - prefers-reduced-motion: no se inicializa Lenis (scroll nativo); ScrollTrigger
 *   sigue funcionando contra el scroll del navegador.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenisInstance } from "@/lib/lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Sin smooth scroll, pero refrescamos triggers por si hay layout async.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    setLenisInstance(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      // GSAP ticker entrega segundos; Lenis espera milisegundos.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Tras el primer layout, recalcular posiciones de triggers.
    ScrollTrigger.refresh();

    // Las fuentes con display:swap cambian la altura del layout DESPUÉS del
    // primer render → recalcular triggers cuando terminan de cargar evita que
    // el parallax/scrub calcule start/end con medidas viejas.
    let fontsRefresh: Promise<unknown> | undefined;
    if (typeof document !== "undefined" && "fonts" in document) {
      fontsRefresh = document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenisInstance(null);
      void fontsRefresh;
    };
  }, []);

  return <>{children}</>;
}
