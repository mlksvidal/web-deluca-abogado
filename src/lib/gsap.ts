"use client";

/**
 * Registro centralizado de GSAP + ScrollTrigger.
 *
 * Importar gsap/ScrollTrigger desde acá garantiza que el plugin se registre
 * una sola vez en el cliente. GSAP 3.15 incluye ScrollTrigger en el paquete
 * base (free desde 3.12).
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
