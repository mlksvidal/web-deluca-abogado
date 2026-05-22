/**
 * Admin Layout — sidebar + header.
 * Auth: Basic Auth en dos capas:
 *   1. src/proxy.ts (Next.js 16 Proxy) — primera línea de defensa
 *   2. Guard server-side aquí — defensa en profundidad (por si proxy.ts falla o
 *      se bypasea con client-side navigation directa)
 */

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Download,
  BookOpen,
  BookMarked,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateAdminAuth } from "@/lib/admin-auth";

// ─── Sidebar nav items ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Turnos", href: "/admin/turnos", icon: Calendar },
  { label: "Leads", href: "/admin/leads", icon: Download },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Glosario", href: "/admin/glosario", icon: BookMarked },
] as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ─── Guard server-side (defensa en profundidad) ───────────────────────────
  // proxy.ts valida antes de llegar aquí. Este guard protege ante cualquier
  // escenario donde proxy.ts no haya corrido (bug, config futura, etc.).
  const reqHeaders = await headers();
  const authHeader = reqHeaders.get("authorization");
  const authorized = await validateAdminAuth(authHeader);
  if (!authorized) {
    // notFound() oculta la existencia del panel admin — no revela el 401
    notFound();
  }
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-bg-warm)" }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 border-r border-border-default"
        style={{ background: "var(--color-marino)" }}
        aria-label="Navegación de administración"
      >
        {/* Logo / título */}
        <div className="px-5 py-5 border-b border-[rgba(250,247,242,0.10)]">
          <Link
            href="/"
            className="flex flex-col gap-0.5 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[4px]"
            aria-label="Ir al sitio público"
          >
            <span className="font-serif text-base font-semibold text-bg leading-tight">
              Estudio De Luca
            </span>
            <span className="font-ui text-xs text-[rgba(250,247,242,0.45)] tracking-wide uppercase">
              Panel Admin
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-0.5" aria-label="Menú de administración">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5",
                "font-ui text-sm font-medium",
                "text-[rgba(250,247,242,0.65)]",
                "transition-colors duration-150",
                "hover:bg-[rgba(250,247,242,0.08)] hover:text-bg",
                "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-[-2px]"
              )}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer del sidebar — Salir */}
        <div className="px-5 py-4 border-t border-[rgba(250,247,242,0.10)]">
          <Link
            href="/admin/salir"
            className={cn(
              "flex items-center gap-3",
              "font-ui text-sm font-medium",
              "text-[rgba(250,247,242,0.50)]",
              "hover:text-bg",
              "transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[4px]"
            )}
          >
            <LogOut size={15} aria-hidden="true" />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top header */}
        <header
          className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border-default"
          style={{ background: "var(--color-bg)" }}
          role="banner"
        >
          {/* Mobile: nombre del panel */}
          <span className="md:hidden font-serif text-base font-semibold text-marino">Admin</span>

          {/* Sello modo administración */}
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck size={15} className="text-dorado-deep" aria-hidden="true" />
            <span className="font-ui text-xs font-semibold text-marino tracking-wide uppercase">
              Modo administración
            </span>
          </div>

          {/* Identidad admin */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-serif font-semibold text-sm"
              style={{ background: "var(--color-marino)", color: "var(--color-dorado)" }}
              aria-hidden="true"
            >
              A
            </div>
            <span className="hidden sm:block font-ui text-sm text-text-secondary">
              Administrador
            </span>
          </div>
        </header>

        {/* Page content */}
        <main id="admin-main" className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
