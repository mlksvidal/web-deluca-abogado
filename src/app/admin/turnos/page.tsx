/**
 * Admin Turnos — T35
 *
 * Lista paginada de turnos con filtros por status y fecha.
 * Acciones: ver detalle (modal), cancelar (confirm dialog), marcar atendido.
 * Búsqueda por nombre/email.
 * Timezone: America/Argentina/Mendoza
 */

"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  XCircle,
  CheckCircle,
  X,
  Phone,
  Mail,
  FileText,
  Clock,
} from "lucide-react";
import { listBookings, cancelBooking } from "@/app/actions/booking";
import { markBookingCompleted } from "@/app/actions/admin-bookings";
import type { Booking, BookingStatus } from "@/lib/db/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

// ─── Constantes ────────────────────────────────────────────────────────────────

const TZ = "America/Argentina/Mendoza";
const PAGE_SIZE = 20;

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: "Pendiente",
  completed: "Atendido",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  confirmed: "bg-[#DCFCE7] text-[#15803D]",
  completed: "bg-[#EFF6FF] text-[#1D4ED8]",
  cancelled: "bg-[#FEF2F2] text-[#DC2626]",
};

const AREA_LABELS: Record<string, string> = {
  civil_familia: "Civil y Familia",
  laboral: "Laboral",
  penal: "Penal",
  comercial: "Comercial",
  general: "General",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateAR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const zoned = toZonedTime(d, TZ);
  return format(zoned, "dd/MM/yyyy HH:mm", { locale: es });
}

// ─── Modal Detalle ─────────────────────────────────────────────────────────────

function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-bg rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.20)] overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-border-default"
          style={{ background: "var(--color-marino)" }}
        >
          <h2 id="modal-title" className="font-serif text-base font-semibold text-bg">
            Detalle del turno
          </h2>
          <button
            onClick={onClose}
            className="text-[rgba(250,247,242,0.60)] hover:text-bg transition-colors focus-visible:outline-2 focus-visible:outline-dorado focus-visible:rounded-[4px]"
            aria-label="Cerrar detalle"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full font-ui text-xs font-semibold ${STATUS_COLORS[booking.status]}`}
            >
              {STATUS_LABELS[booking.status]}
            </span>
            <span className="font-ui text-xs text-text-tertiary">
              ID: {booking.id.slice(0, 8)}…
            </span>
          </div>

          {/* Cliente */}
          <div>
            <p className="font-ui text-xs uppercase tracking-wide text-text-tertiary mb-2">
              Cliente
            </p>
            <div className="space-y-1.5">
              <p className="font-ui text-sm font-semibold text-marino">{booking.clientName}</p>
              <a
                href={`mailto:${booking.clientEmail}`}
                className="flex items-center gap-2 font-body text-sm text-carbon-soft hover:text-marino transition-colors"
              >
                <Mail size={13} aria-hidden="true" />
                {booking.clientEmail}
              </a>
              <a
                href={`tel:${booking.clientPhone}`}
                className="flex items-center gap-2 font-body text-sm text-carbon-soft hover:text-marino transition-colors"
              >
                <Phone size={13} aria-hidden="true" />
                {booking.clientPhone}
              </a>
            </div>
          </div>

          {/* Turno */}
          <div>
            <p className="font-ui text-xs uppercase tracking-wide text-text-tertiary mb-2">Turno</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-dorado-deep" aria-hidden="true" />
                <span className="font-ui text-sm font-semibold text-marino">
                  {formatDateAR(booking.slotStartUtc)}
                </span>
              </div>
              <p className="font-ui text-sm text-carbon-soft">
                Área: {AREA_LABELS[booking.legalArea] ?? booking.legalArea}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="font-ui text-xs uppercase tracking-wide text-text-tertiary mb-2">
              Descripción del caso
            </p>
            <div
              className="rounded-[8px] border border-border-default px-4 py-3"
              style={{ background: "var(--color-bg-warm)" }}
            >
              <div className="flex items-start gap-2">
                <FileText
                  size={13}
                  className="mt-0.5 shrink-0 text-text-tertiary"
                  aria-hidden="true"
                />
                <p className="font-body text-sm text-carbon-soft leading-relaxed whitespace-pre-wrap break-words">
                  {booking.description}
                </p>
              </div>
            </div>
          </div>

          {/* Metadatos */}
          <div className="pt-2 border-t border-border-default">
            <p className="font-ui text-xs uppercase tracking-wide text-text-tertiary mb-2">
              Registro
            </p>
            <div className="space-y-1">
              <p className="font-ui text-xs text-text-tertiary">
                Creado: {formatDateAR(booking.createdAt)}
              </p>
              {booking.consentimientoAt && (
                <p className="font-ui text-xs text-text-tertiary">
                  Consentimiento: {formatDateAR(booking.consentimientoAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[6px] border border-border-default font-ui text-sm font-medium text-marino hover:bg-marino-subtle transition-colors focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm bg-bg rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.20)] px-6 py-6">
        <h2 id="confirm-title" className="font-serif text-lg font-semibold text-marino mb-2">
          {title}
        </h2>
        <p id="confirm-desc" className="font-body text-sm text-carbon-soft mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-[6px] border border-border-default font-ui text-sm font-medium text-marino hover:bg-marino-subtle transition-colors disabled:opacity-50"
          >
            No, volver
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-[6px] font-ui text-sm font-semibold text-white transition-colors disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Fila de turno ─────────────────────────────────────────────────────────────

function BookingRow({
  booking,
  onView,
  onCancel,
  onComplete,
}: {
  booking: Booking;
  onView: (b: Booking) => void;
  onCancel: (b: Booking) => void;
  onComplete: (b: Booking) => void;
}) {
  return (
    <tr className="border-b border-border-default hover:bg-bg-warm transition-colors">
      <td className="px-4 py-3 font-ui text-sm text-marino tabular-nums whitespace-nowrap">
        {formatDateAR(booking.slotStartUtc)}
      </td>
      <td className="px-4 py-3">
        <p className="font-ui text-sm font-medium text-marino">{booking.clientName}</p>
      </td>
      <td className="px-4 py-3 font-body text-sm text-carbon-soft">{booking.clientEmail}</td>
      <td className="px-4 py-3 font-body text-sm text-carbon-soft whitespace-nowrap">
        {booking.clientPhone}
      </td>
      <td className="px-4 py-3 font-ui text-xs text-carbon-soft">
        {AREA_LABELS[booking.legalArea] ?? booking.legalArea}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full font-ui text-xs font-semibold ${STATUS_COLORS[booking.status]}`}
        >
          {STATUS_LABELS[booking.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(booking)}
            title="Ver detalle"
            aria-label={`Ver detalle del turno de ${booking.clientName}`}
            className="p-1.5 rounded-[4px] text-text-tertiary hover:text-marino hover:bg-marino-subtle transition-colors focus-visible:outline-2 focus-visible:outline-dorado"
          >
            <Eye size={15} />
          </button>

          {booking.status === "confirmed" && (
            <>
              <button
                onClick={() => onComplete(booking)}
                title="Marcar como atendido"
                aria-label={`Marcar turno de ${booking.clientName} como atendido`}
                className="p-1.5 rounded-[4px] text-text-tertiary hover:text-[#15803D] hover:bg-[#DCFCE7] transition-colors focus-visible:outline-2 focus-visible:outline-dorado"
              >
                <CheckCircle size={15} />
              </button>
              <button
                onClick={() => onCancel(booking)}
                title="Cancelar turno"
                aria-label={`Cancelar turno de ${booking.clientName}`}
                className="p-1.5 rounded-[4px] text-text-tertiary hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors focus-visible:outline-2 focus-visible:outline-dorado"
              >
                <XCircle size={15} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTurnosPage() {
  // Estado de filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  // Estado de datos
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de modales
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [cancelBookingItem, setCancelBookingItem] = useState<Booking | null>(null);
  const [completeBookingItem, setCompleteBookingItem] = useState<Booking | null>(null);

  const [isPending, startTransition] = useTransition();

  // ─── Cargar datos ───────────────────────────────────────────────────────────

  const loadBookings = useCallback(
    (p = page, s = statusFilter, df = dateFrom, dt = dateTo) => {
      startTransition(async () => {
        try {
          const result = await listBookings({
            status: s || undefined,
            dateFrom: df ? new Date(df).toISOString() : undefined,
            dateTo: dt ? new Date(dt).toISOString() : undefined,
            page: p,
            pageSize: PAGE_SIZE,
          });

          if (result.success) {
            setBookingsList(result.data.items);
            setTotal(result.data.total);
            setError(null);
          } else {
            setError("Error al cargar los turnos");
          }
          setLoaded(true);
        } catch {
          setError("Error de conexión");
          setLoaded(true);
        }
      });
    },
    [page, statusFilter, dateFrom, dateTo]
  );

  // Cargar al montar (useEffect — nunca en render)
  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Filtros de búsqueda (cliente) ─────────────────────────────────────────

  const filtered = search.trim()
    ? bookingsList.filter((b) => {
        const q = search.toLowerCase();
        return b.clientName.toLowerCase().includes(q) || b.clientEmail.toLowerCase().includes(q);
      })
    : bookingsList;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // ─── Acciones ──────────────────────────────────────────────────────────────

  const handleCancel = async () => {
    if (!cancelBookingItem) return;
    startTransition(async () => {
      await cancelBooking(cancelBookingItem.id);
      setCancelBookingItem(null);
      loadBookings();
    });
  };

  const handleComplete = async () => {
    if (!completeBookingItem) return;
    startTransition(async () => {
      await markBookingCompleted(completeBookingItem.id);
      setCompleteBookingItem(null);
      loadBookings();
    });
  };

  const applyFilters = () => {
    setPage(1);
    loadBookings(1);
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
    loadBookings(newPage);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Modales */}
      {viewBooking && (
        <BookingDetailModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
      {cancelBookingItem && (
        <ConfirmDialog
          title="Cancelar turno"
          message={`¿Cancelar el turno de ${cancelBookingItem.clientName} el ${formatDateAR(cancelBookingItem.slotStartUtc)}? Se enviarán emails de cancelación.`}
          confirmLabel="Cancelar turno"
          confirmClass="bg-[#DC2626] hover:bg-[#B91C1C]"
          onConfirm={handleCancel}
          onCancel={() => setCancelBookingItem(null)}
          loading={isPending}
        />
      )}
      {completeBookingItem && (
        <ConfirmDialog
          title="Marcar como atendido"
          message={`¿Marcar el turno de ${completeBookingItem.clientName} como atendido?`}
          confirmLabel="Confirmar"
          confirmClass="bg-[#15803D] hover:bg-[#166534]"
          onConfirm={handleComplete}
          onCancel={() => setCompleteBookingItem(null)}
          loading={isPending}
        />
      )}

      <div className="max-w-full">
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-[8px] flex items-center justify-center"
            style={{ background: "var(--color-marino)", color: "var(--color-dorado)" }}
            aria-hidden="true"
          >
            <Calendar size={16} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-marino">Turnos</h1>
            <p className="font-body text-xs text-text-secondary">
              {total > 0 ? `${total} registros` : "Sin registros"}
            </p>
          </div>
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

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
            className="px-3 py-2 rounded-[6px] border border-border-default font-ui text-sm text-marino focus:outline-none focus:border-marino focus:ring-1 focus:ring-marino"
            style={{ background: "var(--color-bg-warm)" }}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            <option value="confirmed">Pendiente</option>
            <option value="completed">Atendido</option>
            <option value="cancelled">Cancelado</option>
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

        {/* Estado de carga / error */}
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
                <Calendar
                  size={32}
                  className="mx-auto mb-3 text-text-tertiary"
                  aria-hidden="true"
                />
                <p className="font-ui text-sm text-text-secondary">
                  No hay turnos que coincidan con los filtros.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[8px] border border-border-default">
                <table className="w-full text-left" aria-label="Lista de turnos">
                  <thead>
                    <tr
                      className="border-b border-border-default"
                      style={{ background: "var(--color-bg-warm)" }}
                    >
                      {[
                        "Fecha/hora",
                        "Cliente",
                        "Email",
                        "Teléfono",
                        "Área",
                        "Estado",
                        "Acciones",
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
                    {filtered.map((booking) => (
                      <BookingRow
                        key={booking.id}
                        booking={booking}
                        onView={setViewBooking}
                        onCancel={setCancelBookingItem}
                        onComplete={setCompleteBookingItem}
                      />
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
    </>
  );
}
