# Design System — web-deluca-abogado

**Dirección estética**: Clásico Institucional Moderno — encaja con perfil de abogado senior en Mendoza; la confianza y la autoridad se construyen con restraint, precisión tipográfica y materiales (marino/dorado/blanco roto), no con experimentación visual.

**Landing pattern**: Trust & Authority + Minimal | Sections: Hero > Áreas legales > Trayectoria > Reserva > Footer | CTA: Above fold (Hero) + sección Reserva

**Design dials**:

- `design_variance`: 3 (grids simétricos estrictos, 12-col, sin asimetría)
- `motion_intensity`: 3 (solo CSS hover/focus + scroll-triggered IntersectionObserver, sin GSAP ScrollTrigger avanzado en componentes — excepto héroe que ya tiene GSAP sutil)
- `visual_density`: 2 (espaciado generoso, max-width tipográfico 65-70ch, whitespace como respiración)

**Plataforma**: Web (Next.js 16 App Router + Tailwind CSS 4 + shadcn/ui)

**Generado por**: ui-designer | 2026-05-21 | Fase 2

---

## Anti-patterns OBLIGATORIOS (Design Intelligence HIGH + tono)

1. **Outdated box-shadow**: prohibido `box-shadow: 5px 5px 10px rgba(0,0,0,0.5)`. Usar únicamente el sistema de sombras cálidas difusas del css-foundation (`--shadow-xs` a `--shadow-xl`).
2. **Hidden credentials**: áreas de práctica, matrícula, años de experiencia y reconocimientos deben ser visibles en el above-fold o en la primera sección de scroll. Nunca relegados a footer o texto pequeño.
3. **AI purple/pink gradients**: prohibido. Sin gradientes violeta, rosa, magenta, "tech purple" en ningún elemento.
4. **Dorado como texto sobre fondos claros**: el dorado `#C9A961` NO se usa como color de texto sobre `bg-primary` (`#FAF7F2`) ni `bg-secondary` (`#F0ECE4`) — contraste 2.11:1, FAIL. Sobre fondos claros el dorado solo es decorativo (border, icono, separador ornamental, `::before`/`::after`).
5. **CTAs primarios con dorado como background + texto blanco**: fallaría contraste. CTAs primarios = marino como bg + texto blanco roto (contraste 15.43:1 PASS).
6. **Scale > 1.03 en hovers**: prohibido. El tono clásico no "salta".
7. **Rotaciones en hover/animación**: prohibido en este tono.
8. **Blur filters**: prohibido (backdrop-blur, filter:blur).
9. **Border-radius > 8px en cards**: el tono institucional usa bordes moderados (`--radius-md` 6px, `--radius-lg` 8px). Sin rounded-2xl ni pill shapes en cards/paneles de contenido.
10. **Skeleton loading excesivo**: usar solo en calendario de slots (componente con datos dinámicos). Resto de la página es SSR — no necesita skeleton.

---

## Atomic Design — Jerarquía

```
Atoms:     Button, Input, Textarea, Select, Label, Badge, Icon, Divider, Skeleton
Molecules: FormField, DatePicker, SlotButton, NavItem, Card, StatCard, StepIndicator
Organisms: Header, Footer, WhatsAppFloat, HeroSection, PracticeAreaGrid, BookingFlow, TimelineSection
Templates: MainLayout, BookingPageLayout
Pages:     HomePage (/), BookingPage (/reservar), AdminPage (/admin), PrivacidadPage, TerminosPage
```

---

## 1. Tokens de color semánticos — extendiendo css-foundation

Todos los tokens heredados del css-foundation. Extensiones semánticas para componentes:

```
// Estados interactivos — derivados de la paleta base
--color-focus-ring:       var(--color-dorado)          /* outline 2px, offset 3px */
--color-focus-ring-dark:  var(--color-dorado-hover)    /* en fondos oscuros */

// Feedback
--color-success:          #15803D    /* WCAG AA sobre blanco: 5.74:1 */
--color-success-bg:       #DCFCE7    /* Fondo badge confirmación */
--color-error:            #B91C1C    /* WCAG AA sobre blanco: 6.33:1 */
--color-error-bg:         #FEE2E2    /* Fondo badge error */
--color-warning:          #B45309    /* WCAG AA sobre blanco: 4.79:1 */
--color-warning-bg:       #FEF3C7    /* Fondo badge advertencia */
--color-info:             #0F1E3D    /* Marino — informaciones institucionales */
--color-info-bg:          var(--color-marino-subtle)   /* #E8EDF5 */

// Interactivos — estados disabled
--color-disabled-bg:      #E2E8F0
--color-disabled-text:    #94A3B8    /* Ratio ~3.3:1 sobre blanco — solo decorativo */
--color-disabled-border:  #CBD5E1

// Overlay booking
--color-booking-step-active: var(--color-marino)
--color-booking-step-done:   var(--color-dorado)   /* como decoración, no texto */
--color-booking-step-idle:   var(--color-border)

// Fondos de secciones alternadas
--color-section-light:    var(--color-bg-primary)      /* #FAF7F2 */
--color-section-alt:      var(--color-bg-secondary)    /* #F0ECE4 */
--color-section-dark:     var(--color-marino)          /* #0F1E3D — para Experience/Stats */
```

### Variantes semánticas (text-emphasis, bg-subtle, border-subtle)

```
// Marino
--marino-text-emphasis:   #061122    /* shade 40% — marino oscuro para texto sobre fondos claros */
--marino-bg-subtle:       #E8EDF5    /* tint 80% — fondos de info badges */
--marino-border-subtle:   #C5CFDF    /* tint 60% — bordes decorativos suaves */

// Dorado
--dorado-text-emphasis:   #8A6D2A    /* shade 40% — NUNCA usar sobre bg-primary (2.11 base), esto es shade que puede servir para texto decorativo si se necesita */
--dorado-bg-subtle:       #F7F1E4    /* tint 80% — fondo tooltip, highlight mínimo */
--dorado-border-subtle:   #E8D9B8    /* tint 60% — border decorativo en cards */
```

### Escala tint/shade para marino (9 pasos)

```
--marino-100: #E8EDF5   /* tint 80% */
--marino-200: #C5CFDF   /* tint 60% */
--marino-300: #8FA4C4   /* tint 40% */
--marino-400: #4D71A2   /* tint 20% */
--marino-500: #0F1E3D   /* base */
--marino-600: #0C1831   /* shade 20% */
--marino-700: #091226   /* shade 40% */
--marino-800: #060D1A   /* shade 60% */
--marino-900: #03070D   /* shade 80% */
```

---

## 2. Componentes — Atoms

### Button

**Filosofía**: En este tono el botón primario NO usa dorado como fondo. Usa marino como fondo (autoridad) con texto blanco roto. El dorado aparece como borde/acento en secondary, o como ring en focus.

#### Variante Primary

```
Fondo:      var(--color-marino) → #0F1E3D
Texto:      var(--color-text-inverse) → #FAF7F2   [contraste 15.43:1 PASS AAA]
Borde:      none (solo el fondo habla)
Border-radius: var(--radius-base) → 4px
Padding:    0.625rem 1.5rem (sm) | 0.75rem 1.75rem (md) | 0.875rem 2rem (lg)
Min-height: 44px (a11y touch target)
Font:       var(--font-ui) Inter, 500, var(--text-sm) uppercase con tracking-wide
Sombra default: var(--shadow-sm)

Estados:
  hover:
    fondo:   var(--color-marino-hover) → #1E3A6E
    sombra:  var(--shadow-accent) → glow dorado suave (0 4px 20px rgba(201,169,97,0.30))
    transform: translateY(-2px)
    duration: var(--duration-normal) → 250ms
    easing:  var(--ease-primary)
  active:
    fondo:   #0A1630 (marino-600)
    transform: translateY(0)
    sombra:  var(--shadow-xs)
    duration: var(--duration-instant) → 100ms
  focus-visible:
    outline: 2px solid var(--color-dorado)
    outline-offset: 3px
    (sin cambio de fondo — el ring dorado es el indicador)
  disabled:
    fondo:   var(--color-disabled-bg) → #E2E8F0
    texto:   var(--color-disabled-text) → #94A3B8
    cursor:  not-allowed
    transform: none
    sombra:  none
  loading:
    texto:   invisible (opacity 0)
    icon:    spinner centrado, mismo color que texto original
    pointer-events: none
    fondo:   mismo que hover (indica estado procesando)

Reveal pattern: fade-up 300ms con var(--ease-out) — solo en hero/CTA principal
```

#### Variante Secondary (outline marino)

```
Fondo:      transparent
Texto:      var(--color-marino) → #0F1E3D   [sobre bg-primary: 15.43:1 PASS]
Borde:      2px solid var(--color-marino)
Border-radius: var(--radius-base) → 4px
Padding:    mismo que primary (border compensa)
Font:       mismo que primary

Estados:
  hover:
    fondo:   var(--color-marino)
    texto:   var(--color-text-inverse) → #FAF7F2
    borde:   var(--color-marino)
    sombra:  var(--shadow-md)
    transform: translateY(-2px)
    duration: var(--duration-normal)
  active:
    fondo:   #0A1630
    texto:   var(--color-text-inverse)
    transform: translateY(0)
  focus-visible:
    outline: 2px solid var(--color-dorado)
    outline-offset: 3px
  disabled:
    borde:   var(--color-disabled-border)
    texto:   var(--color-disabled-text)
    fondo:   transparent
    cursor:  not-allowed
```

#### Variante Ghost

```
Fondo:      transparent
Texto:      var(--color-marino)
Borde:      none
Padding:    mismo (sin borde visual, pero área de click conservada)

Estados:
  hover:
    fondo:   var(--marino-bg-subtle) → #E8EDF5
    texto:   var(--color-marino)
    duration: var(--duration-fast) → 150ms
  active:
    fondo:   var(--marino-200) → #C5CFDF
  focus-visible:
    outline: 2px solid var(--color-dorado)
    outline-offset: 3px
  disabled: mismo esquema disabled que primary
```

#### Variante Link

```
Fondo:      transparent
Texto:      var(--color-marino)
Padding:    0 (sin padding)
Font:       heredado del contexto (no uppercase, no tracking extra)
Underline:  clase .hover-underline del css-foundation (animación de ancho 0→100%)

Estados:
  hover: underline animado
  focus-visible: outline dorado
  visited: sin cambio (institucional — no marcar visited)
```

#### Variante Danger

```
Fondo:      var(--color-error) → #B91C1C
Texto:      #FFFFFF   [contraste 6.33:1 PASS AA]
Borde:      none
Uso:        solo en modal de cancelación de turno (admin)

Estados:
  hover:
    fondo: #991B1B (shade 15%)
    transform: translateY(-1px)
  active: fondo #7F1D1D
```

---

### Input

```
Base:
  fondo:          var(--color-bg-primary) → #FAF7F2
  texto:          var(--color-text-primary) → #1A1A1A
  placeholder:    var(--color-text-tertiary) → #6B7280
  borde:          1px solid var(--color-border) → #D4C9B8
  border-radius:  var(--radius-md) → 6px
  padding:        0.625rem 0.875rem
  min-height:     44px (a11y)
  font:           var(--font-ui) Inter, 400, var(--text-base)
  sombra:         var(--shadow-inset) → inset sutil
  width:          100% (siempre full-width dentro de su contenedor)

Estados:
  hover:
    borde: 1px solid var(--color-border-strong) → #B8AA96
    duration: var(--duration-fast) → 150ms
  focus:
    borde: 2px solid var(--color-marino)
    outline: none (el borde actúa como indicador)
    fondo: #FFFFFF (blanco puro — contraste más limpio al tipear)
    sombra: 0 0 0 3px rgba(15,30,61,0.12) (ring marino suave)
  error:
    borde: 2px solid var(--color-error) → #B91C1C
    sombra: 0 0 0 3px rgba(185,28,28,0.12)
  error + focus:
    borde: 2px solid var(--color-error)
    sombra: 0 0 0 3px rgba(185,28,28,0.18)
  disabled:
    fondo: var(--color-disabled-bg) → #E2E8F0
    texto: var(--color-disabled-text)
    cursor: not-allowed
    borde: var(--color-disabled-border)
  valid (post-submit):
    borde: 2px solid var(--color-success) → #15803D
    sombra: 0 0 0 3px rgba(21,128,61,0.12)
```

---

### Textarea

```
Hereda todas las specs de Input, con diferencias:
  min-height: 120px (booking: descripción del caso)
  max-height: 300px (con overflow-y: auto si supera)
  resize: vertical (solo eje Y — no horizontal, rompe layout)
  line-height: var(--leading-normal) → 1.6
  padding: 0.75rem 0.875rem

Counter de caracteres (booking form):
  Posición: inline en el corner inferior derecho del textarea
  Texto: "X / 500 caracteres"
  Color: var(--color-text-tertiary) cuando < 400, var(--color-warning) cuando > 450, var(--color-error) cuando > 500
  Font: var(--font-ui) var(--text-xs)
  Aria: aria-live="polite" en el counter para lectores de pantalla
```

---

### Select

```
Hereda specs visuales de Input.
  Ícono dropdown: chevron-down de Lucide, var(--color-text-secondary), 16px, right 0.75rem
  Transición ícono: rotate 180deg cuando open, duration 200ms ease-in-out

Dropdown panel:
  fondo:          var(--color-bg-primary) → #FAF7F2
  borde:          1px solid var(--color-border-strong)
  border-radius:  var(--radius-md)
  sombra:         var(--shadow-lg)
  max-height:     280px con overflow-y: scroll
  z-index:        var(--z-dropdown) → 1000

Opciones:
  padding:       0.625rem 0.875rem
  hover:         fondo var(--marino-bg-subtle), texto var(--color-marino)
  selected:      fondo var(--color-marino), texto var(--color-text-inverse), check-icon a la derecha
  disabled:      var(--color-disabled-text), cursor: not-allowed

A11y:
  role="combobox" + aria-expanded + aria-haspopup="listbox"
  Opciones: role="option" + aria-selected
  Keyboard: Enter/Space abre, ArrowUp/Down navega, Escape cierra
```

---

### DatePicker (para booking)

```
Compuesto por: Input trigger + Popover con Calendar (shadcn/ui)

Trigger:
  Hereda specs Input
  Ícono: calendar de Lucide, var(--color-dorado) como decoración (NOT texto — icono)
  Placeholder: "Seleccionar fecha"
  Formato display: "lunes, 23 de junio de 2026" (Intl.DateTimeFormat 'es-AR' long)

Calendar panel:
  fondo:         var(--color-bg-primary)
  borde:         1px solid var(--color-border)
  border-radius: var(--radius-lg)
  sombra:        var(--shadow-xl)
  padding:       1rem
  z-index:       var(--z-popover) → 1040

  Header (mes + navegación):
    fondo:      transparent
    título:     var(--font-serif) Playfair Display, 500, var(--text-lg), var(--color-text-emphasis)
    botones prev/next: variante ghost (chevrons)

  Días de la semana:
    Font: var(--font-ui) Inter, 600, var(--text-xs), uppercase, tracking-wide
    Color: var(--color-text-tertiary)

  Día disponible:
    estado base: fondo transparent, texto var(--color-text-primary)
    hover: fondo var(--marino-bg-subtle), texto var(--color-marino), border-radius 4px
    selected: fondo var(--color-marino), texto #FAF7F2, border-radius 4px
    today (si no selected): borde 1px solid var(--color-dorado-muted)

  Día sin slots / deshabilitado:
    texto: var(--color-disabled-text) → #94A3B8
    cursor: not-allowed
    hover: sin efecto
    Nota: días feriados y fines de semana se deshabilitan en este estado

  Día ya pasado:
    mismo que deshabilitado

A11y:
  role="grid" + aria-label="Calendario de turnos"
  Cada celda: role="gridcell" + aria-disabled o aria-selected
  Keyboard: Arrow keys navegan días, Enter selecciona
```

---

### FormField (Molecule)

```
Composición: Label + Input/Textarea/Select + HelperText o ErrorMessage

Label:
  Font: var(--font-ui) Inter, 500, var(--text-sm)
  Color: var(--color-text-primary) → #1A1A1A
  Margin-bottom: var(--spacing-2) → 8px
  Indicador required: "*" en var(--color-error), margin-left 2px, aria-hidden="true"
  (El "required" semántico va en el input con required + aria-required)

HelperText:
  Font: var(--font-ui) var(--text-sm)
  Color: var(--color-text-tertiary)
  Margin-top: var(--spacing-2)

ErrorMessage:
  Font: var(--font-ui) var(--text-sm)
  Color: var(--color-error) → #B91C1C   [sobre bg-primary: 6.33:1 PASS]
  Margin-top: var(--spacing-2)
  Ícono: alert-circle Lucide, 14px, inline-start
  A11y: role="alert" aria-live="assertive" — se anuncia inmediatamente al aparecer
  Animación: fade-in 150ms (no slide, para lectores de pantalla)
```

---

### Badge

```
Base:
  display: inline-flex, align-items: center, gap: 4px
  padding: 2px 8px (sm) | 4px 10px (md)
  border-radius: var(--radius-sm) → 2px   [institucional: sin pill shapes]
  font: var(--font-ui) Inter, 600, var(--text-xs), uppercase, tracking-wide

Variante estado turno:
  confirmed:   fondo #DCFCE7, texto #15803D, borde 1px solid #86EFAC → "Confirmado"
  cancelled:   fondo #FEE2E2, texto #B91C1C, borde 1px solid #FCA5A5 → "Cancelado"
  completed:   fondo var(--marino-bg-subtle), texto var(--color-marino), borde var(--marino-border-subtle) → "Completado"
  pending:     fondo #FEF3C7, texto #B45309, borde 1px solid #FCD34D → "Pendiente"

Variante área legal (en cards de práctica):
  fondo: var(--color-bg-secondary) → #F0ECE4
  texto: var(--color-text-secondary) → #4A5568
  borde: 1px solid var(--color-border) → #D4C9B8
  (heredado de .badge-area del css-foundation)

Variante credencial/destacado:
  fondo: var(--color-marino)
  texto: var(--color-text-inverse) → #FAF7F2
  sin borde
  uso: "Matrícula CSJN", "20+ años", "500+ casos"
```

---

### Skeleton

```
Color base:    var(--color-bg-secondary) → #F0ECE4
Color shimmer: var(--color-bg-tertiary) → #E8E0D4
Animación:     pulse (opacity 0.5→1.0→0.5) 1.5s ease-in-out infinite
Border-radius: var(--radius-md) para blocks, var(--radius-full) para avatares/círculos

Uso exclusivo en:
  - Grid de slots del calendario (booking) — mientras carga disponibilidad
  - Tabla admin — carga inicial de turnos
  - NUNCA en landing (SSR, no necesita skeleton)

Skeleton del calendar-picker:
  - 7 rectángulos 36x36px en fila (días semana) × 5 filas (semanas)
  - Separados 4px gap
  - Placeholder texto "Cargando disponibilidad..." en type-caption
```

---

## 3. Componentes — Molecules

### Card de Área Legal

```
Contenedor:
  fondo:         var(--color-bg-primary) → #FAF7F2
  borde:         1px solid var(--color-border) → #D4C9B8
  border-radius: var(--radius-md) → 6px
  padding:       var(--spacing-8) → 2rem
  sombra default: var(--shadow-sm)
  position: relative (para el acento de borde)

Acento dorado izquierdo:
  ::before pseudo-elemento
  width: 3px, height: 100%
  background: var(--color-dorado)
  position: absolute, left: 0, top: 0
  border-radius: 3px 0 0 3px
  opacity: 0 → 1 en hover
  transition: opacity var(--duration-normal) var(--ease-primary)

Icono:
  Tamaño: 40px × 40px
  Color: var(--color-marino) (líneas) — NO relleno, trazo fino
  Margin-bottom: var(--spacing-4)
  Transition: color → var(--color-dorado) en hover   [el ícono es SVG, no texto — permitido dorado como color decorativo]

Título (h3):
  Font: var(--font-serif) Playfair Display, 500, var(--text-2xl)
  Color: var(--color-text-emphasis) → #0F1E3D
  Margin-bottom: var(--spacing-3)

Descripción:
  Font: var(--font-body) Lora, 400, var(--text-base)
  Color: var(--color-text-secondary)
  Line-height: var(--leading-normal) → 1.6
  Max: 3 líneas (no truncar — mostrar completo)

Lista de sub-temas:
  Margin-top: var(--spacing-4)
  Cada item: ícono check 12px + texto var(--text-sm) var(--color-text-secondary)
  Separación: var(--spacing-2) entre items

Estados:
  hover:
    borde: 1px solid var(--color-border-strong)
    sombra: var(--shadow-md)
    transform: translateY(-3px)   [máximo, per restricción < 4px in tables below]
    acento izquierdo: opacity 1
    ícono: color var(--color-dorado)
    duration: var(--duration-normal) → 250ms
    easing: var(--ease-primary)
  focus-within:
    outline: 2px solid var(--color-dorado) en el link interno
    no transformar la card completa

Reveal pattern: stagger con IntersectionObserver
  - Las 4 cards se revelan en secuencia (delay: 0ms, 80ms, 160ms, 240ms)
  - Usando clase .reveal-stagger del css-foundation
  - fadeUp 16px, duration 600ms, ease-out

A11y:
  Card completa no es link — el link es el elemento "Más info" interno
  aria-label en el link: "Saber más sobre [nombre del área]"
```

---

### StatCard (para sección Experience)

```
Uso: sección de stats (bg marino — fondo oscuro)

Fondo: transparent (hereda bg marino de la sección)
Borde: 1px solid rgba(201,169,97,0.30) — dorado suave, decorativo
Border-radius: var(--radius-md)
Padding: var(--spacing-8) var(--spacing-6)
Alineación: texto centrado

Número grande:
  Font: var(--font-serif) Playfair Display, 700, var(--text-4xl) → clamp(2.5rem…4rem)
  Color: var(--color-dorado) → #C9A961   [sobre marino #0F1E3D: 7.33:1 PASS AA]
  Letter-spacing: var(--tracking-tight)

Label:
  Font: var(--font-ui) Inter, 600, var(--text-xs), uppercase, tracking-wider
  Color: var(--color-text-inverse) → #FAF7F2   [sobre marino: 15.43:1 PASS AAA]
  Margin-top: var(--spacing-2)
  Opacity: 0.8

Animación counter:
  Al entrar viewport (IntersectionObserver), contar de 0 al número final
  Duration: 1200ms, easing: ease-out
  Honrar prefers-reduced-motion: mostrar número final directamente sin animación
```

---

### StepIndicator (booking)

```
Layout: fila horizontal, 4 pasos (en /reservar: 1=Área, 2=Día/Horario, 3=Datos, 4=Confirmación)
En mobile: solo número + título del paso activo, resto con iconos small

Step activo:
  Círculo: 32px, fondo var(--color-marino), número color #FAF7F2, border-radius 50%
  Label: var(--font-ui) Inter, 600, var(--text-sm), var(--color-marino)
  Font-weight: 600

Step completado:
  Círculo: 32px, fondo var(--color-dorado) como background
  NOTA: el fondo dorado es decorativo, el ícono check dentro es blanco
  Check: ícono check-circle Lucide, color #FAF7F2 (no texto — decorativo)
  Label: var(--color-text-secondary)

Step pendiente:
  Círculo: 32px, fondo transparent, borde 1px solid var(--color-border), número var(--color-text-tertiary)
  Label: var(--color-text-tertiary)

Línea conectora entre steps:
  Height: 1px, background: var(--color-border)
  En pasos completados: background: var(--color-dorado)   [decorativo, no texto]
  Transition: width/background en var(--duration-slow) var(--ease-primary)

A11y:
  nav aria-label="Pasos del proceso de reserva"
  ol con li, aria-current="step" en el paso activo
  aria-label en cada step: "Paso 1 de 4: Elegir área legal, completado/actual/pendiente"
```

---

### NavItem

```
Font: var(--font-ui) Inter, 500, var(--text-sm), uppercase, tracking-wide
Color: var(--color-text-primary) cuando header está sobre fondo claro
       var(--color-text-inverse) cuando header está sobre hero (marino/imagen)
Padding: 0.5rem 0.25rem
Position: relative

Subrayado animado:
  ::after pseudo-elemento (clase .hover-underline del css-foundation)
  Altura: 1px, color: var(--color-dorado)   [como decoración, no texto]
  Animación: width 0→100% en hover, var(--duration-normal)

Estado active (ruta actual):
  ::after con width: 100% fijo (sin hover required)
  Color texto: var(--color-marino) sobre fondo claro / var(--color-dorado) sobre marino

focus-visible: outline 2px solid var(--color-dorado), offset 3px
```

---

## 4. Componentes — Organisms

### Header / Nav (sticky)

```
Posicionamiento:
  position: sticky, top: 0, z-index: var(--z-sticky) → 1010
  width: 100%

Estados de scroll:
  Estado 0 (top de página, sobre hero):
    fondo: transparent
    texto/links: var(--color-text-inverse) → #FAF7F2
    sombra: none
    height: 80px
    logo: solo texto "Dr. Pablo De Luca" en Playfair

  Estado 1 (scroll > 80px, transición):
    fondo: var(--color-bg-primary) → #FAF7F2 con opacity 0.97
    backdrop-filter: NO (anti-pattern para este tono)
    borde-bottom: 1px solid var(--color-border)
    sombra: var(--shadow-sm)
    texto/links: var(--color-text-emphasis) → #0F1E3D
    height: 64px (compacta)
    transition: background-color, height, border → var(--duration-moderate) var(--ease-in-out)

Logo (placeholder hasta Fase 2B):
  Texto: "Dr. Pablo De Luca" en Playfair Display 500
  Tagline debajo: "Abogado" en Inter 400 xs, tracking-wide
  Color en estado 0: #FAF7F2
  Color en estado 1: var(--color-marino)

Nav links (desktop, centrado):
  Inicio | Trayectoria | Áreas | Contacto
  Separador: | en color var(--color-border), mx-2

CTA nav:
  Botón primary sm "Reservar Turno"
  Siempre visible (no se oculta en estado 0 del hero)
  En estado 0: botón outline marino con texto blanco → outline blanco + texto blanco
    (ajuste: en hero transparente, usar variante ghost-inverse: borde #FAF7F2, texto #FAF7F2)
    hover: fondo rgba(255,255,255,0.15)
  En estado 1: botón primary normal (marino)

Mobile (< 1024px):
  Hamburger: 3 líneas, color heredado del estado scroll, min 44×44px touch target
  Drawer: slide desde la derecha, full-height, fondo var(--color-bg-primary), z-index var(--z-overlay)
  Links en drawer: verticales, padding 1rem, borde-bottom var(--color-border)
  CTA drawer: botón primary full-width al fondo
  Close: X en esquina superior derecha del drawer
  Transition drawer: translateX(100%→0), duration var(--duration-moderate) var(--ease-primary)
  Overlay: fondo var(--color-overlay) → rgba(15,30,61,0.6), z-index var(--z-overlay)-1, click cierra

A11y:
  <nav> con aria-label="Navegación principal"
  Hamburger: aria-expanded, aria-controls="mobile-nav-drawer"
  Drawer: role="dialog", aria-modal="true", aria-label="Menú de navegación"
  Focus trap dentro del drawer cuando está abierto
  Skip link al inicio del documento: "Saltar al contenido principal" → #main-content
```

---

### Footer

```
Layout:
  Fondo: var(--color-marino) → #0F1E3D
  Padding: var(--spacing-16) var(--spacing-8) var(--spacing-8)   [top generoso]
  3 columnas desktop, 1 columna mobile (stack)

Columna 1 — Identidad:
  Logo/nombre: "Dr. Pablo De Luca" Playfair 500, color #FAF7F2
  Tagline: "Abogado · San Rafael, Mendoza" Inter 400 sm, color rgba(250,247,242,0.7)
  Párrafo corto (opcional): 2 líneas introducción, color text-inverse opacity 0.7
  Ícono WhatsApp link: ver especificación WhatsAppFloat, versión inline texto

Columna 2 — Contacto (PROMINENTE — anti-pattern "hidden credentials"):
  Título h6: "CONTACTO" uppercase, color var(--color-dorado)   [sobre marino: 7.33:1 PASS AA]
  Dirección: ícon map-pin + texto, color #FAF7F2
  Teléfono: ícono phone + texto +54 9 2604 61-4896, color #FAF7F2, link tel:
  Email: ícono mail + texto, color #FAF7F2, link mailto:
  Horarios: ícono clock + "Lun–Vie: 9–13 / 16–20", color rgba(250,247,242,0.7)
  Nota: todos los íconos son Lucide thin 16px, color rgba(201,169,97,0.7) — dorado suave decorativo

Columna 3 — Áreas:
  Título h6: "ÁREAS DE PRÁCTICA" uppercase, color var(--color-dorado)
  Lista 4 links: Civil/Familia, Laboral, Penal, Comercial
  Color links: rgba(250,247,242,0.8)
  Hover: color #FAF7F2, hover-underline animado (color dorado)

Divider dorado:
  .divider-gold del css-foundation — separador ornamental entre cuerpo y bottom row

Bottom row:
  Flex row (copyright izq + links legales der)
  Copyright: "© 2026 Dr. Pablo De Luca. Todos los derechos reservados."
  Font: Inter, var(--text-xs), color rgba(250,247,242,0.5)
  Links: Política de privacidad | Términos de uso
  Font: mismo, hover: color #FAF7F2

A11y:
  <footer> role="contentinfo"
  Links de navegación en <nav> con aria-label="Navegación del pie de página"
```

---

### WhatsApp Floating Button

```
Posición: fixed, bottom: 1.5rem, right: 1.5rem, z-index: var(--z-toast) → 1050
Visibilidad: oculto primeros 200px de scroll, aparece con fade-in

Botón:
  Tamaño: 56×56px círculo (border-radius: 50%)
  Fondo: #25D366 (verde WhatsApp oficial)
  Ícono: SVG de WhatsApp, 28×28px, color #FFFFFF
  Sombra: 0 4px 16px rgba(37,211,102,0.40)
  href: "https://wa.me/5492604614896" target="_blank" rel="noopener noreferrer"
  aria-label: "Contactar por WhatsApp"

Estados:
  hover:
    fondo: #1DAF5A (shade 10%)
    sombra: 0 6px 24px rgba(37,211,102,0.55)
    transform: scale(1.08)   [excepción justificada: elemento redondo, escala < 1.1]
    duration: var(--duration-normal)
  active:
    transform: scale(0.96)
  focus-visible:
    outline: 2px solid var(--color-dorado)
    outline-offset: 4px

Animación pulse (atención):
  ::before ring pulsante: border 2px solid rgba(37,211,102,0.6)
  Animación: scale(1)→scale(1.6), opacity(0.6)→opacity(0), 2s ease-out infinite
  Delay del loop: 0s start, 1s segunda pulsación
  prefers-reduced-motion: no mostrar pulse, solo botón estático

Aparición/desaparición:
  Entrando: opacity 0→1, translateY(8px)→0, duration 300ms ease-out
  Al volver al top: opacity 1→0, translateY(0)→8px, duration 200ms ease-in
```

---

### Toast / Alert

```
Toast (sonner — confirmaciones temporales):
  Posición: top-right en desktop, top-center en mobile
  z-index: var(--z-toast) → 1050
  Ancho: 360px máximo, 280px mínimo
  Border-radius: var(--radius-md) → 6px
  Sombra: var(--shadow-xl)
  Duración default: 4000ms, error: 6000ms

  Variante success (turno confirmado):
    fondo: var(--color-bg-primary)
    borde-izquierdo: 4px solid var(--color-success) → #15803D
    ícono: check-circle, color #15803D
    título: Inter 600 sm, color text-primary
    descripción: Inter 400 sm, color text-secondary

  Variante error (slot tomado, server error):
    borde-izquierdo: 4px solid var(--color-error) → #B91C1C
    ícono: alert-circle, color #B91C1C
    (mismo resto de estructura)

  Variante warning:
    borde-izquierdo: 4px solid var(--color-warning) → #B45309
    ícono: alert-triangle, color #B45309

  Animación entrada: slide-in desde la derecha 300ms ease-out
  Animación salida: fade-out 200ms ease-in

Alert (componente inline en la página):
  Uso: errores de validación de formulario que agrupan múltiples campos
  Layout: fondo var(--color-error-bg), borde 1px solid var(--color-error) opacity 0.4
  Border-radius: var(--radius-md)
  Padding: var(--spacing-4)
  role="alert", aria-live="assertive"
```

---

### Modal / Dialog

```
Overlay:
  fondo: var(--color-overlay) → rgba(15,30,61,0.6)
  z-index: var(--z-modal) → 1030
  Animación: opacity 0→1, 200ms ease-out
  Click fuera: cierra el dialog

Dialog:
  fondo: var(--color-bg-primary)
  borde-top: 4px solid var(--color-marino)   [acento institucional en lugar de border-radius colorido]
  border-radius: var(--radius-lg) → 8px
  sombra: var(--shadow-xl)
  padding: var(--spacing-8)
  Ancho: min(90vw, 520px) desktop — fullscreen en mobile (< 640px)
  Animación entrada: scale(0.96)→1.0 + opacity 0→1, 300ms ease-out
  Animación salida: scale(1.0)→0.96 + opacity 1→0, 200ms ease-in

  Header:
    Título: h3 Playfair 500, var(--color-text-emphasis)
    X cerrar: 44×44px, variante ghost, esquina superior derecha
    Divider: 1px solid var(--color-border) debajo del header

  Body: padding-top var(--spacing-4)

  Footer:
    Flex row end, gap var(--spacing-3)
    Siempre: botón cancel + botón acción principal
    Cancel: variante ghost
    Confirmar: variante primary (marinoo) o danger (cancelación de turno)

Uso específico:
  Confirmación de reserva exitosa (paso 4 booking):
    Ícono: check-circle grande 56px, color var(--color-success)
    Título: "¡Turno reservado!"
    Subtítulo: fecha+hora en formato AR
    Mensaje: "Te enviamos la confirmación a tu email"
    Botón: "Volver al inicio" (primary)
    Solo un botón (no cancel)

  Error slot tomado:
    Ícono: alert-circle 56px, color var(--color-error)
    Título: "Ese horario ya fue reservado"
    Mensaje: "Por favor, elegí otro horario disponible."
    Botón: "Ver otros horarios" (primary) → cierra dialog + focus al calendario

A11y:
  role="dialog", aria-modal="true", aria-labelledby="{id del título}"
  Focus trap activo mientras el modal está abierto
  Al abrir: focus va al primer elemento interactivo (o al botón de acción si no hay inputs)
  Al cerrar: focus regresa al trigger que lo abrió
  Esc: cierra siempre
```

---

## 5. Patrones de página

### Hero Section

```
Layout:
  min-height: 90vh (con padding-top del header sticky)
  Overflow: hidden
  Position: relative

Capas (de atrás hacia adelante):
  1. Fondo base: var(--color-marino) como fallback
  2. Imagen placeholder (::after, position absolute inset 0):
     - data-placeholder="true"
     - Formato esperado: foto exterior/interior del estudio, o retrato formal en contexto
     - Nota al logo-agent: NO generar IA — placeholder explícito "FOTO ESTUDIO — reemplazar"
     - object-fit: cover, object-position: center top (si es retrato)
  3. Overlay: linear-gradient(to right, rgba(15,30,61,0.85) 50%, rgba(15,30,61,0.55) 100%)
     — más opaco en la izquierda donde está el texto, más transparente hacia la imagen

Contenido (posición: izquierda, centrado verticalmente):
  Container max-width 1200px, padding lateral responsive
  Máximo 55% de ancho en desktop (el resto "respira" hacia la imagen)

  Kicker (sobre el título):
    Texto: "ESTUDIO JURÍDICO"
    Font: Inter 600, var(--text-xs), tracking-widest, uppercase
    Color: var(--color-dorado)   [sobre marino overlay: 7.33:1 PASS AA]
    Decoración: línea horizontal 2px × 32px dorada antes del texto (inline)
    Margin-bottom: var(--spacing-4)

  H1:
    Texto: "Dr. Pablo De Luca"
    Font: Playfair Display, 400 (weight viene del serif), var(--text-hero)
    Color: #FAF7F2   [sobre marino: 15.43:1 PASS AAA]
    Letter-spacing: var(--tracking-tight)
    Line-height: var(--leading-tight) → 1.15

  Subtítulo / área:
    Texto: "Abogado · San Rafael, Mendoza"
    Font: Inter, 400, var(--text-lg)
    Color: rgba(250,247,242,0.80)
    Margin-top: var(--spacing-3)

  Párrafo intro:
    2 líneas máximo
    Font: Lora 400 var(--text-base)
    Color: rgba(250,247,242,0.72)
    Max-width: 500px
    Margin-top: var(--spacing-6)

  CTAs:
    Flex row, gap var(--spacing-4), Margin-top var(--spacing-8)
    CTA primario: "Reservar Consulta" → /reservar
      Variante especial para hero (fondo claro no disponible):
      fondo: var(--color-dorado) → #C9A961   [excepción: sobre fondo marino el dorado es bg decorativo]
      texto: var(--color-marino) → #0F1E3D   [sobre dorado: 7.33:1 PASS AA]
      ESTA ES LA ÚNICA EXCEPCIÓN donde dorado va de fondo — solo en CTAs sobre fondo oscuro
    CTA secundario: "Conocer Áreas" → #areas
      fondo: transparent, borde: 1px solid rgba(250,247,242,0.50), texto: #FAF7F2
      hover: borde rgba(250,247,242,0.80), fondo rgba(250,247,242,0.10)

Animación entrada (GSAP — ya en Tarea 9 del plan):
  Secuencia:
    0ms:    kicker fade+translateY(16px→0), duration 400ms
    200ms:  h1 fade+translateY(20px→0), duration 600ms
    400ms:  subtítulo+párrafo fade, duration 400ms
    600ms:  CTAs fade+translateY(12px→0), duration 400ms
  easing: var(--ease-primary) para todos
  prefers-reduced-motion: todos aparecen inmediatamente sin animación

Scroll indicator (bottom-center):
  Ícono: chevron-down Lucide, 24px, color rgba(250,247,242,0.50)
  Animación: bounce suave arriba-abajo, 1.5s ease-in-out infinite, 2 repeticiones luego detiene
  Aparece a los 1500ms (después de las animaciones de entrada)

Mobile (< 768px):
  Overlay: rgba(15,30,61,0.75) uniforme (sin gradiente lateral)
  Contenido: centrado en lugar de izquierda
  H1: tamaño reducido fluido (clamp ya configurado en css-foundation)
  CTAs: flex-col (botones stacked)
  min-height: 100svh (small viewport height para navegadores mobile)
```

---

### Sección Áreas Legales

```
ID: "areas"
Fondo: var(--color-bg-secondary) → #F0ECE4 (alternado con primary)
Padding: var(--spacing-section-lg) vertical

Header de sección:
  Ornament line: .type-ornament::before (línea dorada 3rem, 2px, mb-6)
  Kicker: "ÁREAS DE PRÁCTICA" tipo .type-label, color var(--color-text-tertiary)
  H2: "Defensa especializada en cada área" Playfair 500, var(--text-3xl), color text-emphasis
  Lead: Lora 400, max-width 600px, centrado, color text-secondary
  Header centrado, margin-bottom var(--spacing-12)

Grid de cards:
  4 cards en grid 2×2 desktop, 1 col mobile
  Gap: var(--spacing-6)
  max-width: 900px, centrado (no full 1200px — cards más proporcionadas)

Áreas (4 slots definidos):
  1. Civil y Familia
     Ícono: scales (balanza) — Lucide "scale" o SVG custom
     Sub-temas: divorcios, herencias, sucesiones, alimentos, custodia

  2. Laboral
     Ícono: briefcase o gavel (mazo)
     Sub-temas: despidos, liquidaciones, accidentes laborales, ART, reinserción

  3. Penal
     Ícono: shield (escudo)
     Sub-temas: defensa criminal, recursos, excarcelaciones, probation, mediación

  4. Comercial / Empresas
     Ícono: building-2 o file-text
     Sub-temas: contratos, sociedades, deudas comerciales, quiebras

Comportamiento (ver Card de Área Legal en Atoms):
  Reveal: .reveal-stagger, stagger 80ms, trigger a 20% de viewport
```

---

### Sección Trayectoria / Stats

```
Fondo: var(--color-marino) → #0F1E3D (contraste con secciones claras)
Padding: var(--spacing-section-md) vertical (un poco más compacta — impacto visual)

Header:
  Ornament: línea dorada centrada
  H2: "Una trayectoria al servicio de la justicia" Playfair 400, color #FAF7F2
  Subtítulo: Inter 400, color rgba(250,247,242,0.7)
  Header centrado

Grid stats:
  4 StatCards en fila desktop, 2×2 en tablet, 1×1 en mobile
  Gap: var(--spacing-8)
  Cada stat (placeholders marcados con []):
    [20]+ años de experiencia
    [500]+ casos resueltos
    [4] áreas de práctica
    [1000]+ clientes asesorados

  Todos los números en brackets son PLACEHOLDERS evidentes
  Usar data-placeholder="true" en el número para que el Dr. los reemplace

Separador al final:
  .divider-gold ornamental (de transparente→dorado→transparente)
  Margin-bottom negativo de -1px para unirse fluidamente a la siguiente sección

Reveal:
  Sección completa: .reveal con fade-up 24px, trigger a entrada de viewport
  Numbers counter: animación JavaScript en IntersectionObserver (0→valor final, 1200ms ease-out)
```

---

### Sección Reserva (CTA/Preview)

```
Fondo: var(--color-bg-primary) → #FAF7F2
Padding: var(--spacing-section-lg)

Layout: 2 columnas desktop (info izq, CTA card der), 1 col mobile

Columna izquierda — Información:
  Ornament + kicker "RESERVA TU CONSULTA"
  H2: "Agenda una consulta confidencial" Playfair 500
  Párrafo: Lora, descripción del proceso (2-3 líneas placeholder)
  Lista de beneficios:
    - Ícono check-circle dorado decorativo (16px)
    - "Consulta inicial sin compromiso"
    - "Respuesta en menos de 24 horas"
    - "Horarios flexibles L-V"
    Font: Lora var(--text-base), color text-secondary

  Horarios placeholder:
    Grid 2 cols: "Mañana: 9:00–13:00" / "Tarde: 16:00–20:00"
    Font: Inter 500 sm, ícono clock decorativo dorado

  Nota confidencialidad:
    Ícono shield-check + "Toda la información compartida es estrictamente confidencial"
    Font: Inter 400 xs, color text-tertiary

Columna derecha — Card CTA:
  fondo: var(--color-marino)
  border-radius: var(--radius-lg) → 8px
  padding: var(--spacing-8) var(--spacing-10)
  sombra: var(--shadow-xl)
  borde-top: 4px solid var(--color-dorado)   [acento institucional]

  Card interior:
    Ícono calendar 40px, color var(--color-dorado) [decorativo, sobre marino PASS 7.33:1]
    H3: "Proceso simple" Playfair 400, color #FAF7F2
    Lista 4 pasos (numerados con círculos dorados — decorativos):
      1. Elegís tu área legal
      2. Seleccionás día y horario
      3. Completás tus datos
      4. ¡Listo! Te confirmamos por email
    Font: Inter 400 var(--text-sm), color rgba(250,247,242,0.80)

    CTA botón:
      "Reservar Turno Online"
      Variante: dorado como fondo (solo válido sobre marino oscuro)
      Fondo: var(--color-dorado), texto: var(--color-marino)
      Contraste: 7.33:1 PASS AA
      Full width dentro de la card
      Font: Inter 600 sm uppercase tracking-wide
      Padding: 0.875rem 2rem, min-height: 48px

    Nota debajo del botón:
      "Sin costo previo" en Inter 400 xs, rgba(250,247,242,0.50)
      Centrado
```

---

### Footer

(Ver sección Footer en Organisms arriba — especificación completa)

---

## 6. Booking Flow — Especificación de 4 pasos

### Estructura general

```
Página: /reservar
Layout: centrado, max-width var(--container-sm) → 640px (formulario angosto — foco)
Header de página: h1 "Reservar consulta" Playfair 500 var(--text-3xl), centrado, con ornament
StepIndicator: 4 pasos, siempre visible en la cima del flow
Padding: var(--spacing-section-sm) vertical
Fondo: var(--color-bg-primary)
```

---

### Paso 1: Elegir Área Legal

```
Título paso: "¿Sobre qué tema necesitás asesoramiento?"
Font: Playfair 500, h3, var(--text-2xl), centrado

Layout: grid 2×2 (desktop) → 1 col (mobile)
Cada opción: Radio card (no radio estándar)

Radio Card:
  fondo: var(--color-bg-primary)
  borde: 2px solid var(--color-border) → #D4C9B8
  border-radius: var(--radius-md) → 6px
  padding: var(--spacing-6)
  cursor: pointer
  min-height: 100px

  Contenido:
    Ícono SVG área 32px (ver lista íconos abajo)
    Título: Inter 600, var(--text-base), var(--color-text-emphasis)
    Descripción 1 línea: Inter 400 sm, var(--color-text-tertiary)

Estado seleccionado:
  borde: 2px solid var(--color-marino)
  sombra: 0 0 0 3px rgba(15,30,61,0.12)
  fondo: var(--marino-bg-subtle) → #E8EDF5
  ícono: color var(--color-dorado) [decorativo]
  Check-circle: aparece en esquina superior derecha, 20px, relleno marino, check blanco

Estado hover (no seleccionado):
  borde: 2px solid var(--color-border-strong)
  sombra: var(--shadow-sm)

A11y:
  <fieldset> + <legend> "Área legal"
  Cada radio card: <label> + <input type="radio"> (visualmente oculto, accesible)
  arrow keys navegan entre opciones dentro del fieldset

Botón avanzar: "Siguiente →" primary, bottom-right
Activo solo cuando una opción está seleccionada (disabled mientras no)
```

---

### Paso 2: Calendario y Slots

```
Título: "Elegí un día y horario disponible"

Layout desktop: 2 columnas (calendario izq + slots der)
Layout mobile: 1 col (calendario arriba + slots abajo)

Columna calendario:
  Componente DatePicker → Calendar desplegado (no popover, siempre visible)
  Días disponibles: fondo var(--color-bg-primary), hover marino-subtle
  Días sin slots: deshabilitados (ver DatePicker spec arriba)
  Día seleccionado: fondo marino + texto blanco roto

Columna slots:
  Header: "Horarios disponibles el [día seleccionado]"
  Font: Inter 500 sm, color text-secondary

  Estado loading (mientras carga API):
    Grid skeleton 3×N de bloques 40px × 80px
    Texto: "Buscando disponibilidad..."

  Estado con slots:
    Grid 3 columnas (horarios como botones)
    Cada slot botón:
      Tamaño: 80px × 48px mínimo
      Texto: "09:00" formato HH:mm
      fondo: var(--color-bg-secondary)
      borde: 1px solid var(--color-border)
      border-radius: var(--radius-base) → 4px
      Font: Inter 500 sm, text-emphasis

      hover:
        borde: var(--color-marino)
        fondo: var(--marino-bg-subtle)
        color texto: var(--color-marino)

      seleccionado:
        fondo: var(--color-marino)
        borde: var(--color-marino)
        texto: #FAF7F2
        sombra: var(--shadow-sm)

    A11y: role="group" aria-label="Horarios del [día]", cada botón aria-pressed

  Estado vacío (no hay slots ese día):
    Ícono calendar-x 40px, color var(--color-text-tertiary)
    Texto: "No hay turnos disponibles este día."
    Subtexto: "Probá otro día o contactanos por WhatsApp"
    Link WhatsApp: botón ghost con ícono WhatsApp

  Estado error (falla el fetch):
    Alert inline con icono alert-circle
    Texto: "No pudimos cargar los horarios disponibles."
    Botón: "Reintentar" (variante ghost pequeño)

Botón avanzar: "Siguiente →" primary, bottom-right
Activo solo cuando día + slot seleccionados

NOTA CRÍTICA — slots concurrentes:
  Si al confirmar en paso 3/4 el slot ya fue tomado:
  → Modal error (ver spec Modal, variante "slot tomado")
  → Al cerrar modal: regresa al paso 2, deselecciona el slot tomado, foco en calendario
  → Toast warning: "Ese turno fue tomado. Por favor elegí otro horario."
```

---

### Paso 3: Datos del cliente

```
Título: "Completá tus datos para confirmar"

Form (ver specs de Input/Textarea/FormField/Select arriba):
  Nombre completo: Input, required, min 3 chars
  Email: Input type=email, required
  Teléfono: grupo prefijo fijo "+54 9" + Input numérico (10 dígitos)
    Prefijo: display inline-flex, fondo bg-secondary, borde mismo que input,
             border-radius radius-md solo lado izquierdo, padding 0.5rem 0.75rem
             Font Inter 400 sm, color text-secondary, no editable
  Área legal: pre-seleccionada del paso 1 (disabled, solo lectura visual)
    Mostrar como badge destacado, no como select activo
  Descripción del caso: Textarea, min 10 / max 500 chars, con counter
    Placeholder: "Describí brevemente tu situación para que el Dr. pueda preparar la consulta..."
  Checkbox términos + privacidad: required
    Label: "Acepto la Política de privacidad y los Términos de uso"
    Links inline, abren en nueva pestaña

Honeypot:
  <input name="website" type="text" tabindex="-1" aria-hidden="true" style="display:none">
  No visible, no anunciado, si tiene valor al enviar → rechazar silenciosamente

Resumen visible del turno (read-only):
  Card compacta arriba del form (bg-secondary, border, radius-md):
    Día y hora: Inter 600 sm, text-emphasis
    Área: badge compacta
  Botón "Cambiar" → regresa al paso 2

Botón enviar: "Confirmar Reserva"
  full-width
  Estado loading: spinner + "Procesando..." (mientras Server Action ejecuta)
  A11y: aria-busy="true" durante loading

Validación:
  Client-side (zod + react-hook-form) en tiempo real
  Server-side en Server Action (mismo schema Zod)
  Errores inline en cada campo (ver FormField / ErrorMessage)
  Si hay múltiples errores al submit: Alert summary arriba del form + scroll al primer error
```

---

### Paso 4: Confirmación

```
Trigger: Server Action `createBooking` retorna {ok: true, bookingId}

Layout: centrado, max-width 480px

Ícono check-circle: 72px, color var(--color-success) → #15803D
Animación entrada: scale 0.5→1.0 + opacity 0→1, 400ms ease-out, delay 100ms

H2: "¡Turno confirmado!" Playfair 400, color text-emphasis
Subtítulo: Inter 400, color text-secondary, "Te enviamos los detalles a tu email"

Card resumen del turno:
  fondo: var(--marino-bg-subtle) → #E8EDF5
  borde-izquierdo: 4px solid var(--color-marino)
  border-radius: var(--radius-md)
  padding: var(--spacing-6)

  Items:
    Fecha y hora: [Martes 24 de junio, 10:30] Inter 600 base, text-emphasis
    Área legal: Badge compacta
    Email de confirmación: "Enviado a: usuario@email.com" Inter 400 sm, text-secondary
    Nota WhatsApp: "Ante cualquier cambio, escribinos al +54 9 2604 61-4896"
                  Inter 400 xs, text-tertiary, ícono WhatsApp 14px verde

Botones:
  "Volver al inicio" → botón primary full-width
  "Reservar otro turno" → botón ghost, debajo (reinicia el flow)

A11y:
  focus va automáticamente al título de confirmación al llegar al paso 4
  aria-live="assertive" para anunciar "¡Turno confirmado!" a lectores de pantalla
```

---

### Estados de Error del Booking Flow

```
Error: slot ya tomado (concurrencia)
  Trigger: Server Action retorna {ok: false, error: "SLOT_TAKEN"}
  UX:
    → Modal "Ese horario ya fue reservado" (ver spec Modal)
    → Al cerrar: regresa al paso 2
    → El slot tomado se deshabilita inmediatamente en el grid de slots
    → Toast warning: duración 6000ms (más larga, es error importante)
    → Todos los campos del paso 3 se conservan (no pierde el nombre/email)

Error: validación server-side (datos inválidos, honeypot activado)
  Trigger: Server Action retorna {ok: false, error: "VALIDATION_ERROR", fields: {...}}
  UX:
    → Permanece en paso 3
    → Alert summary arriba del form: "Por favor corregí los errores marcados"
    → Errores inline en campos específicos (mismo ErrorMessage spec)
    → Scroll al primer campo con error
    → focus al primer campo con error

Error: server error (DB caída, email falla)
  Trigger: Server Action retorna {ok: false, error: "SERVER_ERROR"}
  UX:
    → Toast error: "No pudimos completar la reserva. Por favor intentá nuevamente."
    → Botón "Reintentar" en el toast (re-ejecuta el Server Action)
    → Si reintentos > 2: mensaje "Si el problema persiste, contactanos por WhatsApp" con link
    → form NO se resetea (datos del cliente se conservan)

Error: red (network timeout, offline)
  UX:
    → Alert inline bajo el botón submit: "Sin conexión. Revisá tu conexión a Internet."
    → Botón "Reintentar" disponible
    → Toast cuando reconecta: "Conexión restaurada"
```

---

## 7. Iconografía — Lista para logo-agent

### Íconos funcionales (UI) — Lucide thin, trazo 1.5px, sin relleno

```
Navegación y acciones:
  - menu (hamburger) — navegación mobile
  - x (close) — cerrar drawer/modal
  - chevron-down — select, acordeón, scroll indicator
  - chevron-left / chevron-right — navegación calendario
  - arrow-right — CTAs secundarios, "Más info"
  - check — checkboxes, validación
  - check-circle — confirmación de turno (paso 4), badges credencial
  - alert-circle — errores de validación
  - alert-triangle — warnings
  - x-circle — cancel

Contacto y booking:
  - phone — teléfono en footer/contacto
  - mail — email en footer/contacto
  - map-pin — dirección estudio
  - clock — horarios de atención
  - calendar — DatePicker trigger
  - calendar-x — slot vacío
  - message-circle — WhatsApp (alternativo, Lucide no tiene WA oficial — usar SVG custom)

Áreas legales (SVG inline custom — lineal, no relleno, trazo 2px):
  Para que logo-agent genere SVG vectoriales a medida:
  1. scales (balanza) — Civil y Familia → balanza de justicia clásica, 2 brazos equilibrados
  2. shield (escudo) — Penal → escudo simple con línea horizontal en el tercio superior
  3. briefcase — Laboral → maletín profesional, trazo limpio
  4. building-2 — Comercial → edificio de 2-3 pisos, simplificado

Íconos de confianza (para sección Trayectoria / credenciales):
  - award — premios/reconocimientos
  - graduation-cap — formación académica
  - book-open — publicaciones / especialización
  - users — clientes / consultas

Feedback:
  - loader-circle (spinner) — loading states de botones/formularios
  - refresh-cw — retry button
```

### SVG custom que logo-agent debe generar:

```
1. Ícono WhatsApp (SVG oficial — path ya conocido, referenciar brand oficial)
   Tamaño: 24px viewBox, path en #FFFFFF sobre fondo verde
   Uso: FAB flotante, footer, links inline

2. Balanza de Justicia (area: Civil y Familia)
   Estilo: monolínea, trazo 2px, no relleno, color heredado del CSS
   Elementos: viga horizontal, pivote central, 2 platos colgantes
   Viewbox: 24×24px
   Uso: card área Civil, header de sección (decorativo grande)

3. Escudo Institucional (area: Penal)
   Estilo: monolínea, trazo 2px
   Forma: escudo clásico (sin formas geométricas modernas)
   Interior: opcional — línea diagonal o iniciales PDL
   Viewbox: 24×24px

4. Gavel / Mazo Judicial (área: Laboral — más representativo que briefcase)
   Estilo: monolínea, trazo 2px
   Elementos: mazo + base de escritorio
   Viewbox: 24×24px

5. Monograma "PDL" — Logo placeholder del estudio
   Uso: navbar + favicon
   Estilo: letras "P D L" en Playfair Display o serif geométrico
   Color: dorado #C9A961 sobre marino #0F1E3D
   Formato: SVG (para escalar a cualquier tamaño sin pérdida)
   Variante 1: monograma entrelazado o secuencial → para header nav (compact)
   Variante 2: circular con borde fino → para favicon 32×32px

Nota al logo-agent: TODOS los íconos deben ser limpios, vectoriales, sin detalle excesivo.
Recordar anti-pattern: NO gradientes, NO relleno sólido (solo trazo), NO colores múltiples.
Paleta: solo marino (#0F1E3D), dorado (#C9A961), blanco roto (#FAF7F2) o currentColor.
```

---

## 8. Behavioral Rules — resumen por componente

| Componente          | Hover                                                  | Reveal                     | Notas                         |
| ------------------- | ------------------------------------------------------ | -------------------------- | ----------------------------- |
| Button Primary      | translateY(-2px) + shadow-accent glow                  | fade-up 300ms solo en hero | NO scale                      |
| Button Secondary    | fill marino completo                                   | igual que primary          | Inversión bg/texto en hover   |
| Card área legal     | translateY(-3px) + shadow-md + acento izquierdo dorado | stagger 80ms               | acento ::before opacity 0→1   |
| StatCard            | sin transformación                                     | counter JS                 | sobre fondo oscuro            |
| Nav links           | underline animado dorado                               | instantáneo                | animación de borde inferior   |
| Header              | scroll change transparent→bone                         | -                          | 80px threshold                |
| Hero CTA            | translateY(-2px) + glow                                | fade-up secuencial GSAP    | excepción fondo dorado        |
| WhatsApp FAB        | scale(1.08) + shadow verde                             | fade-in tras 200px scroll  | ring pulse                    |
| Radio Card (paso 1) | borde marino + shadow sm                               | stagger leve               | check al seleccionar          |
| Slot button         | borde marino + bg subtle                               | -                          | fill marino al seleccionar    |
| DatePicker días     | bg marino-subtle                                       | -                          | marino relleno al seleccionar |
| Modal               | scale 0.96→1.0 + fade                                  | 300ms ease-out             | focus trap                    |

**Regla universal**: `prefers-reduced-motion: reduce` desactiva TODAS las transiciones y animaciones — mostrar estado final directamente.

---

## 9. Desvíos del css-foundation

**Ningún desvío de tokens**: todos los valores de color, spacing, radius, shadow y typography se toman directamente de los tokens del css-foundation sin modificación.

**Adiciones (extensiones, no conflictos)**:

1. Tokens de feedback (`--color-success-bg`, `--color-error-bg`, `--color-warning-bg`, `--color-disabled-*`) — no estaban en css-foundation, se agregan coherentemente.
2. Escala tint/shade `--marino-100` a `--marino-900` — faltaba, añadida.
3. Tokens `--color-section-*` — alias semánticos para alternar fondos de secciones.

**Excepción documentada — dorado como fondo en 2 casos específicos**:

- Hero CTA primario ("Reservar Consulta"): fondo dorado + texto marino. Solo válido sobre overlay marino del hero.
- Booking CTA card ("Reservar Turno Online"): fondo dorado + texto marino. Solo válido dentro de card marina.
- Rationale: el css-foundation prohíbe dorado como texto sobre fondos claros (FAIL contraste). Dorado como FONDO sobre texto marino sí pasa (7.33:1 PASS AA). Son dos casos acotados y documentados — el frontend-developer debe implementar solo estos dos.
- Fuera de estos dos casos: botones primarios usan marino como fondo en todos los demás contextos (sobre bg-primary, sobre bg-secondary, en forms, en admin).

---

_Design System generado por ui-designer | web-deluca-abogado | 2026-05-21_
