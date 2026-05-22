/**
 * Admin Dashboard — T35
 *
 * 4 stat cards: turnos pendientes, leads del mes, posts publicados, términos glosario.
 * Shortcuts a secciones de gestión.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Download, BookOpen, BookMarked, Clock, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { bookings, leadsDescarga, blogPosts, glosarioTerminos } from "@/lib/db/schema";
import { eq, gte, count, isNull } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
  robots: { index: false, follow: false },
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number | string;
  href: string;
  icon: React.ElementType;
  description: string;
  accent: string;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const [turnosPendientes, leadsDelMes, postsPublicados, terminosGlosario] = await Promise.all([
      // Turnos confirmados
      db
        .select({ count: count() })
        .from(bookings)
        .where(eq(bookings.status, "confirmed"))
        .then((r) => r[0]?.count ?? 0),

      // Leads del mes actual
      db
        .select({ count: count() })
        .from(leadsDescarga)
        .where(gte(leadsDescarga.createdAt, startOfMonth))
        .then((r) => r[0]?.count ?? 0),

      // Posts publicados (sin soft-delete)
      db
        .select({ count: count() })
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .then((r) => r[0]?.count ?? 0),

      // Términos del glosario activos (sin soft-delete)
      db
        .select({ count: count() })
        .from(glosarioTerminos)
        .where(isNull(glosarioTerminos.deletedAt))
        .then((r) => r[0]?.count ?? 0),
    ]);

    return { turnosPendientes, leadsDelMes, postsPublicados, terminosGlosario };
  } catch {
    // En caso de error de DB, mostrar valores neutros
    return {
      turnosPendientes: "—",
      leadsDelMes: "—",
      postsPublicados: "—",
      terminosGlosario: "—",
    };
  }
}

// ─── Componente stat card ─────────────────────────────────────────────────────

function StatCard({ card }: { card: StatCard }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      className="flex flex-col gap-4 p-5 bg-[var(--color-bg)] border border-[var(--color-border-default)] rounded-[10px] hover:border-[var(--color-marino)] hover:shadow-[0_4px_16px_rgba(15,30,61,0.10)] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
      aria-label={`${card.label}: ${card.value}. Ir a ${card.label}`}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: card.accent, color: "var(--color-bg)" }}
          aria-hidden="true"
        >
          <Icon size={18} />
        </div>
      </div>
      <div>
        <p
          className="font-serif text-3xl font-bold tabular-nums"
          style={{ color: "var(--color-marino)" }}
        >
          {card.value}
        </p>
        <p className="font-ui text-sm font-semibold text-[var(--color-marino)] mt-0.5">
          {card.label}
        </p>
        <p className="font-body text-xs text-[var(--color-text-secondary)] mt-1">
          {card.description}
        </p>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const stats = await getDashboardStats();

  const STAT_CARDS: StatCard[] = [
    {
      label: "Turnos pendientes",
      value: stats.turnosPendientes,
      href: "/admin/turnos",
      icon: Calendar,
      description: "Consultas confirmadas en espera",
      accent: "var(--color-marino)",
    },
    {
      label: "Leads del mes",
      value: stats.leadsDelMes,
      href: "/admin/leads",
      icon: TrendingUp,
      description: "Descargas de recursos este mes",
      accent: "var(--color-dorado-deep)",
    },
    {
      label: "Posts publicados",
      value: stats.postsPublicados,
      href: "/admin/blog",
      icon: BookOpen,
      description: "Artículos visibles en el blog",
      accent: "#2563EB",
    },
    {
      label: "Términos glosario",
      value: stats.terminosGlosario,
      href: "/admin/glosario",
      icon: BookMarked,
      description: "Definiciones jurídicas activas",
      accent: "#059669",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-marino)] mb-1.5">
          Panel de administración
        </h1>
        <p className="font-body text-sm text-[var(--color-text-secondary)]">
          Estudio Jurídico Dr. Pablo De Luca — resumen y acceso rápido.
        </p>
      </div>

      {/* Stat cards */}
      <section aria-label="Estadísticas del estudio">
        <h2 className="font-ui text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] mb-4">
          Resumen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.href} card={card} />
          ))}
        </div>
      </section>

      {/* Accesos rápidos */}
      <section aria-label="Accesos rápidos">
        <h2 className="font-ui text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] mb-4">
          Gestión
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "Gestionar turnos",
              href: "/admin/turnos",
              icon: Calendar,
              description: "Ver, cancelar y marcar turnos como atendidos",
            },
            {
              label: "Ver leads",
              href: "/admin/leads",
              icon: Download,
              description: "Descargas de recursos y datos de contacto",
            },
            {
              label: "Editar blog",
              href: "/admin/blog",
              icon: BookOpen,
              description: "Crear, editar y publicar artículos",
            },
            {
              label: "Editar glosario",
              href: "/admin/glosario",
              icon: BookMarked,
              description: "Agregar y editar términos jurídicos",
            },
          ].map(({ label, href, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-5 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border-default)] rounded-[8px] hover:border-[var(--color-marino)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-3"
            >
              <div
                className="shrink-0 w-9 h-9 rounded-[6px] flex items-center justify-center"
                style={{ background: "var(--color-marino-subtle)", color: "var(--color-marino)" }}
                aria-hidden="true"
              >
                <Icon size={16} />
              </div>
              <div>
                <p className="font-ui text-sm font-semibold text-[var(--color-marino)]">{label}</p>
                <p className="font-body text-xs text-[var(--color-text-secondary)]">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Avisos */}
      <div
        className="mt-10 flex items-start gap-3 px-4 py-3 rounded-[8px] border text-xs font-ui"
        style={{
          background: "var(--color-marino-subtle)",
          borderColor: "var(--color-border-default)",
          color: "var(--color-marino)",
        }}
      >
        <Clock size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          Zona horaria: <strong>America/Argentina/Mendoza (GMT-3)</strong>. Todos los horarios se
          muestran en hora local de Mendoza.
        </span>
      </div>
    </div>
  );
}
