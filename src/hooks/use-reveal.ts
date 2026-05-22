"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useReveal — IntersectionObserver hook para animaciones scroll-triggered.
 *
 * Retorna una ref para attachar al elemento y un boolean `isVisible`
 * que se activa cuando el elemento entra en el viewport.
 *
 * @param threshold — porcentaje del elemento visible para disparar (default 0.15)
 * @param rootMargin — margen del viewport (default "-60px 0px")
 * @param once — si es true, solo dispara una vez (default true)
 */
export function useReveal(threshold = 0.15, rootMargin = "-60px 0px", once = true) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
