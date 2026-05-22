"use server";

/**
 * Server Actions de glosario — T8
 *
 * Operaciones públicas: listTerminos, getTerminoBySlug
 * Operaciones admin: createTermino, updateTermino, deleteTermino (soft-delete)
 *
 * Búsqueda: ILIKE %search% en termino + sinonimos (array)
 */

import { db } from "@/lib/db";
import { glosarioTerminos } from "@/lib/db/schema";
import { eq, and, isNull, ilike, or, asc, sql } from "drizzle-orm";
import { z } from "zod";

// ─── Logger estructurado ──────────────────────────────────────────────────────

function log(level: "info" | "warn" | "error", context: Record<string, unknown>, msg: string) {
  console[level === "info" ? "log" : level](
    JSON.stringify({ level, msg, ts: new Date().toISOString(), ...context })
  );
}

// ─── Auth placeholder ─────────────────────────────────────────────────────────

function assertAdminContext(): void {
  // T34 implementará la verificación real via proxy.ts Basic Auth.
}

// ─── Schemas Zod ─────────────────────────────────────────────────────────────

const terminoSlugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, { error: "Slug inválido" });

const listTerminosSchema = z.object({
  letra: z
    .string()
    .length(1)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/)
    .optional()
    .transform((v) => v?.toUpperCase()),
  search: z.string().max(100).trim().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(40),
});

const upsertTerminoSchema = z.object({
  slug: terminoSlugSchema,
  termino: z.string().min(1).max(200).trim(),
  letra: z
    .string()
    .length(1)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/)
    .transform((v) => v.toUpperCase()),
  definicionCorta: z.string().min(1).max(500).trim(),
  definicionLarga: z.string().min(1).max(10_000).trim(),
  areaLegal: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"]).optional(),
  sinonimos: z.array(z.string().max(100).trim()).max(20).optional(),
  terminosRelacionados: z.array(z.string().max(200).trim()).max(20).optional(),
});

// ─── Tipos de resultado ───────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fields?: Record<string, string[]> };

export type GlosarioTerminoRow = typeof glosarioTerminos.$inferSelect;

export type TerminoListResult = {
  items: GlosarioTerminoRow[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// ─── listTerminos (público) ───────────────────────────────────────────────────

export async function listTerminos(params: {
  letra?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<ActionResult<TerminoListResult>> {
  const parsed = listTerminosSchema.safeParse({
    letra: params.letra,
    search: params.search,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 40,
  });

  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  const { letra, search, page, pageSize } = parsed.data;
  const offset = (page - 1) * pageSize;

  // Base condition: no soft-deleted
  const conditions: ReturnType<typeof eq | typeof isNull | typeof ilike | typeof or>[] = [
    isNull(glosarioTerminos.deletedAt),
  ];

  if (letra) {
    conditions.push(eq(glosarioTerminos.letra, letra));
  }

  if (search && search.length > 0) {
    const pattern = `%${search}%`;
    // FTS aproximado: ILIKE en termino + ILIKE en sinonimos (array::text)
    conditions.push(
      or(
        ilike(glosarioTerminos.termino, pattern),
        sql`array_to_string(${glosarioTerminos.sinonimos}, ' ') ILIKE ${pattern}`
      )
    );
  }

  const whereClause = and(...conditions);

  try {
    const [items, countRows] = await Promise.all([
      db
        .select()
        .from(glosarioTerminos)
        .where(whereClause)
        .orderBy(asc(glosarioTerminos.letra), asc(glosarioTerminos.termino))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(glosarioTerminos)
        .where(whereClause),
    ]);

    const total = countRows[0]?.count ?? 0;

    return {
      success: true,
      data: { items, total, page, pageSize, hasMore: offset + items.length < total },
    };
  } catch (err) {
    log(
      "error",
      { err: err instanceof Error ? err.message : String(err) },
      "[glosario] Error al listar terminos"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── getTerminoBySlug (público) ───────────────────────────────────────────────

export async function getTerminoBySlug(slug: string): Promise<ActionResult<GlosarioTerminoRow>> {
  const parsedSlug = terminoSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    const [termino] = await db
      .select()
      .from(glosarioTerminos)
      .where(and(eq(glosarioTerminos.slug, parsedSlug.data), isNull(glosarioTerminos.deletedAt)))
      .limit(1);

    if (!termino) {
      return { success: false, error: "not_found" };
    }

    return { success: true, data: termino };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[glosario] Error al obtener termino por slug"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── createTermino (admin) ────────────────────────────────────────────────────

export async function createTermino(
  data: z.input<typeof upsertTerminoSchema>
): Promise<ActionResult<GlosarioTerminoRow>> {
  assertAdminContext();

  const parsed = upsertTerminoSchema.safeParse(data);
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = [];
      fields[key].push(issue.message);
    }
    return { success: false, error: "validation_error", fields };
  }

  try {
    const [termino] = await db.insert(glosarioTerminos).values(parsed.data).returning();

    log("info", { terminoId: termino.id, slug: termino.slug }, "[glosario] Termino creado");
    return { success: true, data: termino };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "slug_taken" };
    }
    log("error", { err: msg }, "[glosario] Error al crear termino en DB");
    return { success: false, error: "internal_error" };
  }
}

// ─── updateTermino (admin) ────────────────────────────────────────────────────

export async function updateTermino(
  slug: string,
  data: Partial<z.input<typeof upsertTerminoSchema>>
): Promise<ActionResult<GlosarioTerminoRow>> {
  assertAdminContext();

  const parsedSlug = terminoSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  const updateSchema = upsertTerminoSchema.partial().omit({ slug: true });
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    const [updated] = await db
      .update(glosarioTerminos)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(glosarioTerminos.slug, parsedSlug.data), isNull(glosarioTerminos.deletedAt)))
      .returning();

    if (!updated) {
      return { success: false, error: "not_found" };
    }

    log("info", { slug, terminoId: updated.id }, "[glosario] Termino actualizado");
    return { success: true, data: updated };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[glosario] Error al actualizar termino"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── deleteTermino (admin) — soft-delete ──────────────────────────────────────

export async function deleteTermino(slug: string): Promise<ActionResult<{ slug: string }>> {
  assertAdminContext();

  const parsedSlug = terminoSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    const [deleted] = await db
      .update(glosarioTerminos)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(glosarioTerminos.slug, parsedSlug.data), isNull(glosarioTerminos.deletedAt)))
      .returning({ slug: glosarioTerminos.slug });

    if (!deleted) {
      return { success: false, error: "not_found" };
    }

    log("info", { slug }, "[glosario] Termino eliminado (soft-delete)");
    return { success: true, data: { slug: deleted.slug } };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[glosario] Error al eliminar termino"
    );
    return { success: false, error: "internal_error" };
  }
}
