/**
 * Admin Leads — T36
 *
 * Tabla de leads de descarga con filtros por área, fecha y recurso.
 * Columnas: fecha, nombre, email, área interés, recurso descargado, IP truncada.
 * Búsqueda por nombre/email.
 * Exportar CSV.
 */

"use client";

import { useState, useTransition, useEffect } from "react";
import { Download, Search, ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { listLeads } from "@/app/actions/admin-leads";
import type { LeadDescarga } from "@/lib/db/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

// ─── Constantes ────────────────────────────────────────────────────────────────

const TZ = "America/Argentina/Mendoza";
const PAGE_SIZE = 25;

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

const RECURSO_LABELS: Record<string, string> = {
  "guia-despido": "Guía Despido Laboral",
  "guia-divorcio": "Guía Divorcio",
  "guia-accidente-transito": "Guía Accidentes de Tránsito",
  "guia-penal-basica": "Guía Derecho Penal Básico",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateAR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const zoned = toZonedTime(d, TZ);
  return format(zoned, "dd/MM/yyyy HH:mm", { locale: es });
}

/** Trunca IP a /24 para mostrar */
function displayIp(ip: string | null): string {
  if (!ip) return "—";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  return ip.slice(0, 12) + "…";
}

// ─── CSV Export ────────────────────────────────────────────────────────────────

function exportToCSV(leads: LeadDescarga[]) {
  const headers = ["Fecha", "Nombre", "Email", "Área de interés", "Recurso", "IP /24"];
  const rows = leads.map((l) => [
    formatDateAR(l.createdAt),
    l.nombre,
    l.email,
    AREA_LABELS[l.areaInteres] ?? l.areaInteres,
    RECURSO_LABELS[l.recursoSlug] ?? l.recursoSlug,
    displayIp(l.ip),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  // BOM para Excel (UTF-8)
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Fila de lead ─────────────────────────────────────────────────────────────

function LeadRow({ lead }: { lead: LeadDescarga }) {
  return (
    <tr className="border-b border-border-default hover:bg-bg-warm transition-colors">
      <td className="px-4 py-3 font-ui text-xs text-carbon-soft tabular-nums whitespace-nowrap">
        {formatDateAR(lead.createdAt)}
      </td>
      <td className="px-4 py-3 font-ui text-sm font-medium text-marino">{lead.nombre}</td>
      <td className="px-4 py-3 font-body text-sm text-carbon-soft">
        <a
          href={`mailto:${lead.email}`}
          className="hover:text-marino transition-colors underline underline-offset-2"
        >
          {lead.email}
        </a>
      </td>
      <td className="px-4 py-3 font-ui text-xs text-carbon-soft">
        {AREA_LABELS[lead.areaInteres] ?? lead.areaInteres}
      </td>
      <td className="px-4 py-3 font-ui text-xs text-carbon-soft">
        {RECURSO_LABELS[lead.recursoSlug] ?? lead.recursoSlug}
      </td>
      <td className="px-4 py-3 font-ui text-xs text-text-tertiary tabular-nums">
        {displayIp(lead.ip)}
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  // Filtros
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [recursoFilter, setRecursoFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  // Datos
  const [leads, setLeads] = useState<LeadDescarga[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // ─── Cargar datos ───────────────────────────────────────────────────────────

  const loadLeads = (
    p = page,
    area = areaFilter,
    recurso = recursoFilter,
    df = dateFrom,
    dt = dateTo
  ) => {
    startTransition(async () => {
      try {
        const result = await listLeads({
          area: area || undefined,
          recurso: recurso || undefined,
          dateFrom: df || undefined,
          dateTo: dt || undefined,
          page: p,
        });
        if (result.success) {
          setLeads(result.items);
          setTotal(result.total);
          setError(null);
        } else {
          setError(result.error);
        }
        setLoaded(true);
      } catch {
        setError("Error de conexión");
        setLoaded(true);
      }
    });
  };

  // Cargar al montar (useEffect — nunca en render)
  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Búsqueda client-side ───────────────────────────────────────────────────

  const filtered = search.trim()
    ? leads.filter((l) => {
        const q = search.toLowerCase();
        return l.nombre.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
      })
    : leads;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // ─── Acciones ──────────────────────────────────────────────────────────────

  const handleExport = () => {
    exportToCSV(filtered);
  };

  const applyFilters = () => {
    setPage(1);
    loadLeads(1);
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
    loadLeads(newPage);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-full">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[8px] flex items-center justify-center"
            style={{ background: "var(--color-dorado-deep)", color: "var(--color-bg)" }}
            aria-hidden="true"
          >
            <Download size={16} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-marino">Leads de descarga</h1>
            <p className="font-body text-xs text-text-secondary">
              {total > 0 ? `${total} registros` : "Sin registros"}
            </p>
          </div>
        </div>

        {/* Exportar CSV */}
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-border-default font-ui text-sm font-medium text-marino hover:bg-marino-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
          aria-label="Exportar leads a CSV"
        >
          <FileDown size={14} aria-hidden="true" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div
        className="flex flex-wrap gap-3 mb-5 p-4 rounded-[8px] border border-border-default"
        style={{ background: "var(--color-bg)" }}
      >
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Buscar por nombre o email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-[6px] border border-border-default font-ui text-sm text-marino placeholder:text-text-tertiary focus:outline-none focus:border-marino focus:ring-1 focus:ring-marino"
            style={{ background: "var(--color-bg-warm)" }}
            aria-label="Buscar por nombre o email"
          />
        </div>

        {/* Área */}
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="px-3 py-2 rounded-[6px] border border-border-default font-ui text-sm text-marino focus:outline-none focus:border-marino focus:ring-1 focus:ring-marino"
          style={{ background: "var(--color-bg-warm)" }}
          aria-label="Filtrar por área"
        >
          <option value="">Todas las áreas</option>
          <option value="civil_familia">Civil y Familia</option>
          <option value="laboral">Laboral</option>
          <option value="penal">Penal</option>
          <option value="comercial">Comercial</option>
          <option value="general">General</option>
        </select>

        {/* Recurso */}
        <select
          value={recursoFilter}
          onChange={(e) => setRecursoFilter(e.target.value)}
          className="px-3 py-2 rounded-[6px] border border-border-default font-ui text-sm text-marino focus:outline-none focus:border-marino focus:ring-1 focus:ring-marino"
          style={{ background: "var(--color-bg-warm)" }}
          aria-label="Filtrar por recurso"
        >
          <option value="">Todos los recursos</option>
          {Object.entries(RECURSO_LABELS).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>

        {/* Fecha desde */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 rounded-[6px] border border-border-default font-ui text-sm text-marino focus:outline-none focus:border-marino focus:ring-1 focus:ring-marino"
          style={{ background: "var(--color-bg-warm)" }}
          aria-label="Fecha desde"
        />

        {/* Fecha hasta */}
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 rounded-[6px] border border-border-default font-ui text-sm text-marino focus:outline-none focus:border-marino focus:ring-1 focus:ring-marino"
          style={{ background: "var(--color-bg-warm)" }}
          aria-label="Fecha hasta"
        />

        <button
          onClick={applyFilters}
          disabled={isPending}
          className="px-4 py-2 rounded-[6px] font-ui text-sm font-semibold text-bg bg-marino hover:bg-marino-hover transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
        >
          Filtrar
        </button>
      </div>

      {/* Estado carga / error */}
      {isPending && <p className="font-ui text-sm text-text-secondary py-4">Cargando…</p>}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-[6px] border font-ui text-sm"
          style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}
        >
          {error}
        </div>
      )}

      {/* Tabla */}
      {!isPending && !error && loaded && (
        <>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Download size={32} className="mx-auto mb-3 text-text-tertiary" aria-hidden="true" />
              <p className="font-ui text-sm text-text-secondary">
                No hay leads que coincidan con los filtros.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[8px] border border-border-default">
              <table className="w-full text-left" aria-label="Lista de leads de descarga">
                <thead>
                  <tr
                    className="border-b border-border-default"
                    style={{ background: "var(--color-bg-warm)" }}
                  >
                    {[
                      "Fecha",
                      "Nombre",
                      "Email",
                      "Área de interés",
                      "Recurso descargado",
                      "IP /24",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wide text-text-tertiary whitespace-nowrap"
                        scope="col"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ background: "var(--color-bg)" }}>
                  {filtered.map((lead) => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="font-ui text-xs text-text-tertiary">
                Página {page} de {totalPages} · {total} registros
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page <= 1 || isPending}
                  aria-label="Página anterior"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-border-default font-ui text-xs font-medium text-marino hover:bg-marino-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                  Anterior
                </button>
                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page >= totalPages || isPending}
                  aria-label="Página siguiente"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] border border-border-default font-ui text-xs font-medium text-marino hover:bg-marino-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
