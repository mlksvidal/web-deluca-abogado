"use client";

/**
 * CountUp — número que cuenta desde 0 hasta `end` al entrar al viewport.
 *
 * Usa GSAP + ScrollTrigger (one-shot). Respeta prefers-reduced-motion:
 * muestra el valor final directo, sin animar.
 *
 * @example
 * <CountUp end={15} suffix="+" />          // 0 → 15+
 * <CountUp end={140} duration={1.8} />
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type CountUpProps = {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Formateador opcional (ej. separador de miles). Recibe el entero actual. */
  format?: (value: number) => string;
};

export function CountUp({
  end,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const render = (v: number) => {
      const body = format ? format(v) : String(v);
      el.textContent = `${prefix}${body}${suffix}`;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      render(end);
      return;
    }

    const counter = { val: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: end,
          duration,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => render(Math.round(counter.val)),
        });
      },
    });

    return () => st.kill();
  }, [end, duration, prefix, suffix, format]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
