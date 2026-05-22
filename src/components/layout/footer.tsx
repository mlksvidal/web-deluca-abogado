import * as React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { SelloMatricula } from "@/components/trust/sello-matricula";

/**
 * Footer — pie de página institucional.
 *
 * Fondo: marino-deep #0A152B
 * 3 columnas desktop + bottom row (copyright + legal + sello)
 * Stack 1 columna en mobile
 *
 * Anti-pattern prevenido: contacto prominente (no enterrado) — §18 Design Intelligence
 */

const AREAS_FOOTER = [
  { label: "Civil y Familia", href: "/areas/civil-familia" },
  { label: "Laboral", href: "/areas/laboral" },
  { label: "Penal", href: "/areas/penal" },
  { label: "Comercial y Empresarial", href: "/areas/comercial" },
];

const LEGAL_FOOTER = [
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Términos de uso", href: "/terminos" },
];

/** Icono + texto de contacto en el footer */
function ContactItem({
  icon,
  children,
  href,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <span className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 text-[rgba(201,169,97,0.70)]" aria-hidden="true">
        {icon}
      </span>
      <span className="font-ui text-sm text-[rgba(250,247,242,0.80)] leading-[1.5]">
        {children}
      </span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "block transition-colors duration-fast",
          "hover:text-bg",
          "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
        )}
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

function Footer() {
  return (
    <footer role="contentinfo" className="bg-[var(--color-marino-deep,#0A152B)] text-bg">
      {/* Cuerpo principal */}
      <div
        className="py-16"
        style={{
          paddingInline: "max(24px, calc((100vw - 1200px) / 2))",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Col 1 — Identidad */}
          <div className="space-y-6">
            {/* Logo texto */}
            <div>
              <p className="font-serif text-xl font-semibold text-bg leading-tight tracking-[-0.01em]">
                Dr. Pablo De Luca
              </p>
              <p className="font-ui text-sm text-[rgba(250,247,242,0.55)] tracking-[0.06em] uppercase mt-1">
                Abogado · San Rafael, Mendoza
              </p>
            </div>

            {/* Bajada corta */}
            <p className="font-body text-sm text-[rgba(250,247,242,0.65)] leading-[1.7] max-w-[280px]">
              {siteConfig.taglineShort}
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram del Estudio De Luca"
                className={cn(
                  "text-[rgba(250,247,242,0.50)]",
                  "hover:text-dorado transition-colors duration-fast",
                  "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
                )}
              >
                {/* Instagram icon SVG */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn del Dr. Pablo De Luca"
                className={cn(
                  "text-[rgba(250,247,242,0.50)]",
                  "hover:text-dorado transition-colors duration-fast",
                  "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
                )}
              >
                {/* LinkedIn icon SVG */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Contacto (PROMINENTE — anti-pattern prevenido) */}
          <div className="space-y-5">
            <h3 className="font-ui text-xs font-semibold tracking-[0.1em] uppercase text-dorado">
              Contacto
            </h3>
            <nav aria-label="Información de contacto" className="space-y-4">
              <ContactItem
                icon={<MapPin size={14} strokeWidth={1.5} />}
                href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`}
              >
                {siteConfig.addressFull}
              </ContactItem>

              <ContactItem
                icon={<Phone size={14} strokeWidth={1.5} />}
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              >
                {siteConfig.whatsappDisplay}
              </ContactItem>

              <ContactItem
                icon={<Mail size={14} strokeWidth={1.5} />}
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </ContactItem>

              <ContactItem icon={<Clock size={14} strokeWidth={1.5} />}>
                {siteConfig.horariosDisplay}
              </ContactItem>
            </nav>
          </div>

          {/* Col 3 — Áreas + Legales */}
          <div className="space-y-8">
            {/* Áreas */}
            <div className="space-y-4">
              <h3 className="font-ui text-xs font-semibold tracking-[0.1em] uppercase text-dorado">
                Áreas de Práctica
              </h3>
              <nav aria-label="Áreas legales">
                <ul className="space-y-2.5">
                  {AREAS_FOOTER.map((area) => (
                    <li key={area.href}>
                      <Link
                        href={area.href}
                        className={cn(
                          "nav-underline",
                          "font-ui text-sm text-[rgba(250,247,242,0.75)]",
                          "transition-colors duration-fast",
                          "hover:text-bg",
                          "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
                        )}
                      >
                        {area.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Legales */}
            <div className="space-y-4">
              <h3 className="font-ui text-xs font-semibold tracking-[0.1em] uppercase text-dorado">
                Legal
              </h3>
              <nav aria-label="Links legales">
                <ul className="space-y-2.5">
                  {LEGAL_FOOTER.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "nav-underline",
                          "font-ui text-sm text-[rgba(250,247,242,0.75)]",
                          "transition-colors duration-fast",
                          "hover:text-bg",
                          "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Divisor dorado ornamental */}
      <div
        style={{
          paddingInline: "max(24px, calc((100vw - 1200px) / 2))",
        }}
      >
        <hr className="divider-gold" />
      </div>

      {/* Bottom row */}
      <div
        className="py-6"
        style={{
          paddingInline: "max(24px, calc((100vw - 1200px) / 2))",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright + links legales */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-ui text-xs text-[rgba(250,247,242,0.40)]">
              © {new Date().getFullYear()} Dr. Pablo De Luca. Todos los derechos reservados.
            </p>
            <div
              className="flex gap-3 sm:gap-4"
              aria-label="Navegación del pie de página"
              role="navigation"
            >
              {LEGAL_FOOTER.map((item, i) => (
                <React.Fragment key={item.href}>
                  {i > 0 && (
                    <span className="text-[rgba(250,247,242,0.20)]" aria-hidden="true">
                      |
                    </span>
                  )}
                  <Link
                    href={item.href}
                    className={cn(
                      "font-ui text-xs text-[rgba(250,247,242,0.40)]",
                      "hover:text-[rgba(250,247,242,0.80)] transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-3"
                    )}
                  >
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sello matrícula */}
          <SelloMatricula variant="dark" />
        </div>
      </div>
    </footer>
  );
}

export { Footer };
