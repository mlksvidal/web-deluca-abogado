"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

/**
 * Header — navegación principal sticky del sitio.
 *
 * Comportamiento scroll:
 *   Estado 0 (top): transparent bg, texto blanco roto, height 80px
 *   Estado 1 (scroll>80px): bg-primary sólido + shadow + height 64px
 *
 * Desktop: logo izq + nav center + CTA der
 * Mobile: logo izq + hamburger der + drawer slide-in desde derecha
 *
 * Logo monogram hover: rota -6° (comportamiento de marca, aprobado por usuario)
 * Nav links: underline dorado animado left→right
 */

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Áreas", href: "/#areas" },
  { label: "Casos", href: "/#casos" },
  {
    label: "Calculadoras",
    href: "/calculadora",
    children: [
      { label: "Indemnización por despido", href: "/calculadora/indemnizacion-despido" },
      { label: "Cuota alimentaria", href: "/calculadora/cuota-alimentaria" },
      { label: "Indemnización ART", href: "/calculadora/indemnizacion-art" },
      { label: "Ver todas →", href: "/calculadora" },
    ],
  },
  { label: "Recursos", href: "/recursos" },
  { label: "Blog", href: "/blog" },
  { label: "Sobre el Dr.", href: "/#trayectoria" },
  { label: "Estudio", href: "/#estudio" },
];

/** Monograma PDL con hover de rotación */
function LogoMonogram({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "relative flex-shrink-0",
        "w-9 h-9",
        "border transition-all duration-500 ease-primary",
        "flex items-center justify-center",
        // Estado base: dorado sobre marino / marino sobre claro
        variant === "dark"
          ? "border-[var(--color-dorado)] text-[var(--color-dorado-deep)] bg-transparent"
          : "border-[var(--color-dorado)] text-[var(--color-dorado-deep)] bg-transparent",
        // Hover: marino sólido + dorado + rotación vía parent group
        "group-hover/logo:bg-[var(--color-marino)] group-hover/logo:text-[var(--color-dorado)] group-hover/logo:rotate-[-6deg]",
        variant === "light" &&
          "group-hover/logo:bg-[var(--color-bg)] group-hover/logo:border-[var(--color-dorado)]"
      )}
      aria-hidden="true"
    >
      {/* Intentar SVG del logo; fallback al texto monogram */}
      <span className="font-serif text-sm font-semibold leading-none">{siteConfig.monogram}</span>
    </span>
  );
}

/** Item de navegación con underline animado */
function NavLink({
  href,
  children,
  scrolled,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  scrolled: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "nav-underline",
        "relative py-1 px-0.5",
        "font-ui text-sm font-medium tracking-[0.03em] uppercase",
        "transition-colors duration-normal",
        "text-[var(--color-carbon-soft)] hover:text-[var(--color-marino)]"
      )}
    >
      {children}
    </Link>
  );
}

/** Dropdown para items con children */
function NavDropdown({ item, scrolled }: { item: NavItem; scrolled: boolean }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Cerrar al click fuera
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "nav-underline",
          "relative py-1 px-0.5",
          "font-ui text-sm font-medium tracking-[0.03em] uppercase",
          "flex items-center gap-1",
          "transition-colors duration-normal",
          "outline-none",
          "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3",
          "text-[var(--color-carbon-soft)] hover:text-[var(--color-marino)]"
        )}
      >
        {item.label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={cn("transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full left-0 mt-2",
            "min-w-[200px]",
            "bg-[var(--color-bg)]",
            "border border-[var(--color-border-default)]",
            "rounded-[6px]",
            "shadow-[var(--shadow-lg)]",
            "py-1",
            "z-[var(--z-dropdown)]"
          )}
        >
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5",
                "font-ui text-sm text-[var(--color-carbon-soft)]",
                "transition-colors duration-fast",
                "hover:bg-[var(--color-marino-subtle)] hover:text-[var(--color-marino)]"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** Drawer de navegación mobile */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Focus trap + cerrar con Escape
  React.useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleNavClick = (href: string) => {
    onClose();
    // Esperar la exit animation antes de hacer scroll
    setTimeout(() => {
      if (href.startsWith("/#")) {
        const id = href.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-[var(--z-overlay)]",
            "bg-[var(--color-overlay)]",
            "transition-opacity duration-400"
          )}
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        id="mobile-nav-drawer"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[calc(var(--z-overlay)+1)]",
          "w-[min(80vw,320px)]",
          "bg-[var(--color-bg)]",
          "flex flex-col",
          "shadow-[var(--shadow-xl)]",
          "transition-transform duration-400 ease-primary",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header del drawer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-default)]">
          <span className="font-serif text-lg font-medium text-[var(--color-marino)]">Menú</span>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className={cn(
              "w-11 h-11 flex items-center justify-center",
              "text-[var(--color-carbon-soft)]",
              "hover:text-[var(--color-marino)]",
              "transition-colors duration-fast",
              "rounded-[4px]",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
            )}
          >
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {/* Links del drawer */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              <button
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "w-full text-left px-6 py-4",
                  "font-ui text-base font-medium tracking-[0.03em] uppercase",
                  "text-[var(--color-carbon-soft)]",
                  "border-b border-[var(--color-border-default)]",
                  "transition-colors duration-fast",
                  "hover:bg-[var(--color-marino-subtle)] hover:text-[var(--color-marino)]",
                  "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)]"
                )}
              >
                {item.label}
              </button>
              {/* Sub-items en drawer */}
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    "block px-10 py-3",
                    "font-ui text-sm text-[var(--color-text-secondary)]",
                    "border-b border-[var(--color-border-default)]",
                    "transition-colors duration-fast",
                    "hover:bg-[var(--color-marino-subtle)] hover:text-[var(--color-marino)]"
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* CTA al fondo del drawer */}
        <div className="p-6 border-t border-[var(--color-border-default)]">
          <Link href="/reservar" onClick={onClose} className="block">
            <Button variant="primary" size="lg" className="w-full" withArrow>
              Reservar consulta
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

/** Header principal */
function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip nav — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only",
          "focus:absolute focus:z-[calc(var(--z-toast)+1)]",
          "focus:top-4 focus:left-4",
          "focus:px-4 focus:py-2",
          "focus:bg-[var(--color-marino)] focus:text-[var(--color-bg)]",
          "focus:rounded-[4px]",
          "focus:font-ui focus:text-sm focus:font-medium"
        )}
      >
        Saltar al contenido principal
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--z-sticky)]",
          "transition-all duration-400 ease-in-out",
          // Estado 0: opaco sutil con blur al inicio (sobre fondo claro del hero)
          !scrolled &&
            "bg-[rgba(250,247,242,0.85)] backdrop-blur-md border-b border-[rgba(15,30,61,0.04)] h-20",
          // Estado 1: sólido con sombra al hacer scroll
          scrolled &&
            "bg-[rgba(250,247,242,0.97)] border-b border-[var(--color-border-default)] shadow-[var(--shadow-sm)] h-16"
        )}
      >
        <div
          className="h-full flex items-center justify-between"
          style={{
            paddingInline: "max(24px, calc((100vw - 1200px) / 2))",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label={`${siteConfig.studioName} — Inicio`}
            className="group/logo flex items-center gap-3 flex-shrink-0"
          >
            <LogoMonogram variant="dark" />
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-serif font-semibold leading-tight tracking-[-0.01em]",
                  "text-[22px] text-[var(--color-marino)]"
                )}
              >
                Pablo De Luca
              </span>
              <span
                className={cn(
                  "font-ui text-xs font-medium tracking-[0.1em] uppercase",
                  "text-[var(--color-text-tertiary)]"
                )}
              >
                Abogado
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <NavDropdown key={item.href} item={item} scrolled={scrolled} />
              ) : (
                <NavLink key={item.href} href={item.href} scrolled={scrolled}>
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* CTA — solo desktop */}
            <Link href="/reservar" className="hidden lg:block">
              <Button variant="primary" size="sm">
                Reservar consulta
              </Button>
            </Link>

            {/* Hamburger — solo mobile/tablet */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Abrir menú de navegación"
              className={cn(
                "lg:hidden",
                "w-11 h-11 flex items-center justify-center",
                "rounded-[4px]",
                "transition-colors duration-fast",
                scrolled
                  ? "text-[var(--color-marino)] hover:bg-[var(--color-marino-subtle)]"
                  : "text-[var(--color-bg)] hover:bg-[rgba(250,247,242,0.15)]",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
              )}
            >
              <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

export { Header };
