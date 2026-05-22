# CSS Foundation — web-deluca-abogado

**Plataforma**: Web (Next.js 16 App Router + Tailwind CSS 4)
**Tono estético**: Clásico Institucional Moderno
**Design Intelligence**: Legal Services | Estilo: Trust & Authority
**Anti-patterns HIGH**: Outdated design / Hidden credentials / AI purple-pink gradients
**Composición**: Layout convencional de alta legibilidad — consistencia ES la estética. No asimetría.

---

## 1. Paleta — Tokens semánticos + validación de contraste WCAG AA

### Colores base (referencia hexadecimal)

| Token                  | Valor hex | Rol semántico                                |
| ---------------------- | --------- | -------------------------------------------- |
| `--color-marino`       | `#0F1E3D` | Azul marino profundo — autoridad, confianza  |
| `--color-marino-hover` | `#1E3A6E` | Marino iluminado para estados hover          |
| `--color-dorado`       | `#C9A961` | Dorado clásico — distinción, jerarquía       |
| `--color-dorado-hover` | `#DDB96E` | Dorado iluminado para hovers                 |
| `--color-blanco`       | `#FAF7F2` | Blanco roto — calidez, no esterilidad        |
| `--color-carbon`       | `#1A1A1A` | Carbón — texto principal sobre fondos claros |

### Validación de contraste WCAG 2.1 AA

| Combinación                                | Ratio      | Estado                                          |
| ------------------------------------------ | ---------- | ----------------------------------------------- |
| Blanco roto sobre marino                   | 15.43:1    | PASS AA + AAA                                   |
| Carbón sobre blanco roto                   | 16.29:1    | PASS AA + AAA                                   |
| Marino sobre blanco roto                   | 15.43:1    | PASS AA + AAA                                   |
| **Dorado (#C9A961) sobre marino**          | **7.33:1** | **PASS AA body + large**                        |
| Dorado sobre carbón                        | 7.73:1     | PASS AA body + large                            |
| Gris texto (#4A5568) sobre blanco roto     | 7.04:1     | PASS AA                                         |
| Gris subtítulo (#6B7280) sobre blanco roto | 4.52:1     | PASS AA (justo)                                 |
| **Dorado (#C9A961) sobre blanco roto**     | **2.11:1** | **FAIL** — no usar como texto sobre fondo claro |

**Decisión crítica**: El dorado `#C9A961` PASA AA como texto sobre fondo marino (7.33:1) y carbón (7.73:1). NO usar dorado como texto sobre fondos claros (`#FAF7F2`, `#F0ECE4`). En fondos claros, el dorado solo se usa como elemento decorativo/border/icono, nunca como texto. No se necesita dorado alternativo para CTAs — los CTAs primarios son marino sobre fondo dorado, o blanco sobre marino.

---

## 2. Tailwind CSS 4 — Definición `@theme` inline

```css
/* globals.css — colocar en app/globals.css */

@import "tailwindcss";

/* Google Fonts — tipografía institucional legal */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap");

@theme {
  /* ================================
     COLORES — Paleta institucional
     ================================ */

  /* Fondos */
  --color-bg-primary: #faf7f2;
  --color-bg-secondary: #f0ece4;
  --color-bg-tertiary: #e8e0d4;
  --color-bg-inverse: #0f1e3d;
  --color-bg-dark: #1a1a1a;

  /* Textos */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #4a5568;
  --color-text-tertiary: #6b7280;
  --color-text-inverse: #faf7f2;
  --color-text-emphasis: #0f1e3d;

  /* Marca */
  --color-marino: #0f1e3d;
  --color-marino-hover: #1e3a6e;
  --color-marino-subtle: #e8edf5;
  --color-dorado: #c9a961;
  --color-dorado-hover: #ddb96e;
  --color-dorado-muted: #d4c9b8;

  /* Superficie / UI */
  --color-border: #d4c9b8;
  --color-border-strong: #b8aa96;
  --color-ring: #c9a961;
  --color-overlay: rgba(15, 30, 61, 0.6);

  /* Feedback */
  --color-success: #15803d;
  --color-error: #b91c1c;
  --color-warning: #b45309;

  /* ================================
     TIPOGRAFÍA
     ================================ */

  --font-serif: "Playfair Display", "Georgia", "Times New Roman", serif;
  --font-body: "Lora", "Georgia", serif;
  --font-ui: "Inter", "system-ui", sans-serif;

  /* Escala fluida — tono institucional clásico: contrast alto, hero generoso */
  --text-xs: 0.75rem; /* 12px — caption, metadata */
  --text-sm: 0.875rem; /* 14px — label, badge */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16-18px — body */
  --text-lg: clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem); /* 18-20px — lead */
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem); /* 20-24px — h4 */
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem); /* 24-32px — h3 */
  --text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3rem); /* 32-48px — h2 */
  --text-4xl: clamp(2.5rem, 1.75rem + 3.75vw, 4rem); /* 40-64px — h1 */
  --text-hero: clamp(3rem, 2rem + 5vw, 5.5rem); /* 48-88px — hero display */

  /* Leading */
  --leading-tight: 1.15;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;

  /* Tracking — clásico institucional: headings con tracking negativo, body normal */
  --tracking-tight: -0.02em;
  --tracking-snug: -0.01em;
  --tracking-normal: 0em;
  --tracking-wide: 0.03em;
  --tracking-wider: 0.06em;
  --tracking-widest: 0.1em; /* Para labels uppercase tipo "ÁREA DE PRÁCTICA" */

  /* ================================
     ESPACIADO — Base 4px
     ================================ */

  --spacing-1: 0.25rem; /* 4px */
  --spacing-2: 0.5rem; /* 8px */
  --spacing-3: 0.75rem; /* 12px */
  --spacing-4: 1rem; /* 16px */
  --spacing-5: 1.25rem; /* 20px */
  --spacing-6: 1.5rem; /* 24px */
  --spacing-8: 2rem; /* 32px */
  --spacing-10: 2.5rem; /* 40px */
  --spacing-12: 3rem; /* 48px */
  --spacing-16: 4rem; /* 64px */
  --spacing-20: 5rem; /* 80px */
  --spacing-24: 6rem; /* 96px */
  --spacing-32: 8rem; /* 128px */

  /* Espaciado de secciones — tono clásico institucional: generoso pero no inmersivo */
  --spacing-section-sm: 4rem; /* 64px — mobile */
  --spacing-section-md: 6rem; /* 96px — tablet */
  --spacing-section-lg: 8rem; /* 128px — desktop */

  /* ================================
     BORDER RADIUS — Tono clásico: sharp pero no brutal
     ================================ */

  --radius-none: 0px;
  --radius-sm: 2px; /* Casi nada — para badges, tags */
  --radius-base: 4px; /* Default institucional */
  --radius-md: 6px; /* Cards, inputs */
  --radius-lg: 8px; /* Modales, paneles */
  --radius-xl: 12px; /* Solo elementos secundarios */
  --radius-full: 9999px; /* Pills, avatares */

  /* ================================
     SOMBRAS — Cálidas, difusas — tono luxury/clásico
     ================================ */

  --shadow-xs: 0 1px 2px rgba(15, 30, 61, 0.06);
  --shadow-sm: 0 2px 6px rgba(15, 30, 61, 0.08), 0 1px 2px rgba(15, 30, 61, 0.04);
  --shadow-md: 0 4px 16px rgba(15, 30, 61, 0.1), 0 2px 4px rgba(15, 30, 61, 0.06);
  --shadow-lg: 0 8px 32px rgba(15, 30, 61, 0.12), 0 4px 8px rgba(15, 30, 61, 0.06);
  --shadow-xl: 0 16px 48px rgba(15, 30, 61, 0.14), 0 8px 16px rgba(15, 30, 61, 0.08);
  --shadow-accent: 0 4px 20px rgba(201, 169, 97, 0.3); /* Para hover de CTAs dorados */
  --shadow-inset: inset 0 1px 3px rgba(15, 30, 61, 0.08);

  /* ================================
     MOTION — Sutil, deliberado, NO cinematográfico
     ================================ */

  /* Easings — suaves, institucionales */
  --ease-primary: cubic-bezier(0.22, 1, 0.36, 1); /* Salida suave — entradas de elementos */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Out expo — reveals scroll */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* Material standard — transiciones */
  --ease-in: cubic-bezier(0.4, 0, 1, 1); /* Para exits */

  /* Duraciones */
  --duration-instant: 100ms; /* Focus ring, checkboxes */
  --duration-fast: 150ms; /* Hover color, border changes */
  --duration-normal: 250ms; /* Transiciones de estado — botones, links */
  --duration-moderate: 400ms; /* Acordeones, dropdowns */
  --duration-slow: 600ms; /* Fade-in secciones, modales */
  --duration-reveal: 800ms; /* Scroll-triggered entrances */
  --stagger-delay: 80ms; /* Delay entre items en listas/grids */

  /* ================================
     CONTENEDORES
     ================================ */

  --container-xs: 480px;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1200px; /* Max content — editorial, no full-bleed */
  --container-2xl: 1440px; /* Max viewport */

  /* ================================
     Z-INDEX — Escala nombrada centralizada
     ================================ */

  --z-below: -1;
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 1000;
  --z-sticky: 1010;
  --z-overlay: 1020;
  --z-modal: 1030;
  --z-popover: 1040;
  --z-toast: 1050;
  --z-tooltip: 1060;
}

/* ================================
   CSS PROPERTIES — Semantic aliases
   (para uso en componentes — no hardcodear hex)
   ================================ */

:root {
  color-scheme: light;

  /* Aliases semánticos sobre tokens Tailwind */
  --bg-primary: var(--color-bg-primary);
  --bg-secondary: var(--color-bg-secondary);
  --bg-inverse: var(--color-bg-inverse);

  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-tertiary: var(--color-text-tertiary);
  --text-inverse: var(--color-text-inverse);

  --brand-primary: var(--color-marino);
  --brand-accent: var(--color-dorado);

  --border-default: var(--color-border);
  --ring-color: var(--color-ring);
}

/* ================================
   RESET & BASE
   ================================ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Safari focus fix */
:where(button):focus:not(:focus-visible) {
  outline: 0;
}

/* Focus visible accesible */
:focus-visible {
  outline: 2px solid var(--color-dorado);
  outline-offset: 3px;
}

html {
  font-size: 100%;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  font-feature-settings:
    "kern" 1,
    "liga" 1;
}

/* ================================
   JERARQUÍA TIPOGRÁFICA
   ================================ */

/* Display / Hero — Playfair Display, deliberadamente serif */
.type-hero {
  font-family: var(--font-serif);
  font-size: var(--text-hero);
  font-weight: 400; /* Playfair Display regular — el grosor lo da el serif, no el bold */
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-emphasis);
}

.type-hero-italic {
  font-family: var(--font-serif);
  font-size: var(--text-hero);
  font-weight: 400;
  font-style: italic;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-dorado);
}

/* Headings */
h1,
.h1 {
  font-family: var(--font-serif);
  font-size: var(--text-4xl);
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-emphasis);
}

h2,
.h2 {
  font-family: var(--font-serif);
  font-size: var(--text-3xl);
  font-weight: 500;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-emphasis);
}

h3,
.h3 {
  font-family: var(--font-serif);
  font-size: var(--text-2xl);
  font-weight: 500;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-snug);
  color: var(--color-text-primary);
}

h4,
.h4 {
  font-family: var(--font-ui);
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-normal);
  color: var(--color-text-primary);
}

h5,
.h5 {
  font-family: var(--font-ui);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  color: var(--color-text-primary);
}

h6,
.h6 {
  font-family: var(--font-ui);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Body variants */
.body-lead {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
}

.body-base {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
}

.body-small {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
}

/* UI Elements */
.type-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
}

.type-caption {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--color-text-tertiary);
}

.type-nav {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

/* Ornament — separador dorado clásico */
.type-ornament::before {
  content: "";
  display: block;
  width: 3rem;
  height: 2px;
  background-color: var(--color-dorado);
  margin-bottom: 1.5rem;
}

/* ================================
   LAYOUT — Contenedores responsive
   ================================ */

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2.5rem);
}

.container-narrow {
  width: 100%;
  max-width: var(--container-md);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2rem);
}

.container-wide {
  width: 100%;
  max-width: var(--container-2xl);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 3rem);
}

/* Section spacing */
.section {
  padding-block: var(--spacing-section-sm);
}

/* Grid patterns */
.grid-auto-fit-sm {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.grid-auto-fit-md {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: var(--spacing-8);
}

/* ================================
   BREAKPOINTS — Mobile-first
   (usar como referencia para Tailwind clases responsive)
   ================================ */

/*
  xs:  480px  → @media (min-width: 480px)  — teléfonos grandes
  sm:  640px  → @media (min-width: 640px)  — teléfonos landscape / Tailwind default
  md:  768px  → @media (min-width: 768px)  — tablets portrait
  lg:  1024px → @media (min-width: 1024px) — tablets landscape / laptops pequeñas
  xl:  1280px → @media (min-width: 1280px) — desktop estándar
  2xl: 1440px → @media (min-width: 1440px) — desktop grande
*/

@media (min-width: 768px) {
  .section {
    padding-block: var(--spacing-section-md);
  }
}

@media (min-width: 1024px) {
  .section {
    padding-block: var(--spacing-section-lg);
  }
}

/* ================================
   MOTION — Animaciones sutiles
   ================================ */

/* Prefer reduced motion — respetar siempre */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Fade-in scroll-triggered — clase base para IntersectionObserver */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity var(--duration-reveal) var(--ease-out),
    transform var(--duration-reveal) var(--ease-out);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger — aplicar via CSS custom property */
.reveal-stagger > * {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

.reveal-stagger.is-visible > *:nth-child(1) {
  transition-delay: 0ms;
}
.reveal-stagger.is-visible > *:nth-child(2) {
  transition-delay: calc(var(--stagger-delay) * 1);
}
.reveal-stagger.is-visible > *:nth-child(3) {
  transition-delay: calc(var(--stagger-delay) * 2);
}
.reveal-stagger.is-visible > *:nth-child(4) {
  transition-delay: calc(var(--stagger-delay) * 3);
}
.reveal-stagger.is-visible > *:nth-child(5) {
  transition-delay: calc(var(--stagger-delay) * 4);
}
.reveal-stagger.is-visible > *:nth-child(6) {
  transition-delay: calc(var(--stagger-delay) * 5);
}
.reveal-stagger.is-visible > * {
  opacity: 1;
  transform: translateY(0);
}

/* Parallax sutil — solo en desktop, via JS (IntersectionObserver + translateY) */
.parallax-subtle {
  will-change: transform;
  /* JS aplica: style.transform = `translateY(${offset * 0.15}px)` — factor 0.15 = sutil */
}

/* Hover refinado — para cards y elementos interactivos */
.hover-lift {
  transition:
    transform var(--duration-normal) var(--ease-primary),
    box-shadow var(--duration-normal) var(--ease-primary);
}
.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

/* Hover link subrayado animado — estilo clásico */
.hover-underline {
  position: relative;
  text-decoration: none;
}
.hover-underline::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width var(--duration-normal) var(--ease-primary);
}
.hover-underline:hover::after {
  width: 100%;
}

/* ================================
   UTILIDADES SEMÁNTICAS
   ================================ */

/* Divisor dorado ornamental */
.divider-gold {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-dorado), transparent);
  opacity: 0.6;
}

/* Badge / credencial — para áreas de práctica, certificaciones */
.badge-area {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-secondary);
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 3. Decisiones de arquitectura

### Nombres de tokens para ui-designer (NO hardcodear hex en componentes)

**Fondos**: `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-inverse`, `bg-dark`
**Textos**: `text-primary`, `text-secondary`, `text-tertiary`, `text-inverse`, `text-emphasis`
**Marca**: `marino`, `marino-hover`, `dorado`, `dorado-hover`, `dorado-muted`
**Bordes/UI**: `border-default`, `border-strong`, `ring`, `overlay`
**Feedback**: `success`, `error`, `warning`

### Restricciones de uso (ui-designer debe respetar)

1. **Dorado como texto**: SOLO sobre fondos oscuros (`marino`, `carbon`). Nunca sobre `bg-primary` o `bg-secondary`.
2. **Dorado como decoración/border/icono**: libre en fondos claros.
3. **Serif (Playfair Display)**: solo para headings h1-h3 y hero. h4+ usa Inter.
4. **Lora (body serif)**: para párrafos de contenido extenso — biográfico, áreas de práctica, noticias.
5. **Inter**: para UI (navegación, labels, badges, botones, formularios).
6. **Animaciones**: máximo `translateY(24px)` en reveals. NO scale > 1.03 en hovers. NO rotaciones. NO blur filters.

### Composición espacial

Layout convencional de alta legibilidad. Columna central máx 1200px. Márgenes generosos. Sin asimetría intencional — la elegancia viene del spacing, la tipografía y los materiales, no de la ruptura del grid.

---

## 4. Anti-patterns HIGH (Design Intelligence Engine — obligatorios)

1. **Outdated design**: no usar sombras con `box-shadow: 5px 5px 10px rgba(0,0,0,0.5)` estilo 2010. Usar sombras cálidas difusas del sistema.
2. **Hidden credentials**: las áreas de práctica, años de experiencia y reconocimientos deben ser prominentes y fácilmente visibles — no enterradas en footer o texto pequeño.
3. **AI purple/pink gradients**: prohibido. La paleta es exclusivamente marino/dorado/blanco roto/carbón. Ningún elemento con gradientes violeta, rosa, magenta o "tech purple".

---

## 5. Referencia: breakpoints Tailwind 4

En Tailwind CSS 4, los breakpoints se configuran con `@theme` si se necesitan personalizados. Los defaults de Tailwind 4 cubren el brief:

| Prefijo  | Min-width | Uso                           |
| -------- | --------- | ----------------------------- |
| _(none)_ | 0px       | Mobile base — siempre primero |
| `xs:`    | 480px     | Teléfonos grandes             |
| `sm:`    | 640px     | Landscape / tablet portrait   |
| `md:`    | 768px     | Tablet                        |
| `lg:`    | 1024px    | Laptop                        |
| `xl:`    | 1280px    | Desktop                       |
| `2xl:`   | 1440px    | Desktop grande                |

Nota: `xs: 480px` no existe en Tailwind 4 por defecto — agregar en `@theme`:

```css
@theme {
  --breakpoint-xs: 480px;
}
```

---

_Generado por ux-architect | 2026-05-21 | web-deluca-abogado Fase 2_
