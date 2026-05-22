"use client";

/**
 * Reveal — IntersectionObserver wrapper para animaciones scroll-triggered.
 *
 * Replica el patrón `.reveal` / `.reveal.is-visible` del mock.
 * CSS puro — sin GSAP ni framer-motion (motion_intensity 3).
 *
 * @example
 * <Reveal>
 *   <p>Aparece al entrar al viewport</p>
 * </Reveal>
 * <Reveal delay={160}>...</Reveal>   // delay en ms
 */

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Delay extra en ms (apilado sobre la transición CSS base de 0.95s) */
  delay?: number;
  /** Clase extra que se añade al wrapper div */
  className?: string;
  /** Umbral de visibilidad (0–1). Default 0.12 */
  threshold?: number;
};

export function Reveal({ children, delay = 0, className = "", threshold = 0.12 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Prefers-reduced-motion: mostrar inmediatamente
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
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

  return (
    <div
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity .95s cubic-bezier(.22,1,.36,1),
                      transform .95s cubic-bezier(.22,1,.36,1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal.is-visible {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
