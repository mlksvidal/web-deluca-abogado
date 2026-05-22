"use server";

/**
 * Server Actions para admin leads — T36
 * Accesibles solo desde el panel admin (protegido por proxy.ts Basic Auth).
 */

import { db } from "@/lib/db";
import { leadsDescarga } from "@/lib/db/schema";
import type { LeadDescarga } from "@/lib/db/schema";
import { desc, gte, lte, eq, and, count } from "drizzle-orm";

const PAGE_SIZE = 25;

export interface ListLeadsParams {
  area?: string;
  recurso?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
}

export interface ListLeadsResult {
  success: true;
  items: LeadDescarga[];
  total: number;
}

export interface ListLeadsError {
  success: false;
  error: string;
}

export async function listLeads(
  params: ListLeadsParams
): Promise<ListLeadsResult | ListLeadsError> {
  try {
    const conditions = [];

    if (params.area) {
      conditions.push(eq(leadsDescarga.areaInteres, params.area as LeadDescarga["areaInteres"]));
    }
    if (params.recurso) {
      conditions.push(eq(leadsDescarga.recursoSlug, params.recurso));
    }
    if (params.dateFrom) {
      conditions.push(gte(leadsDescarga.createdAt, new Date(params.dateFrom)));
    }
    if (params.dateTo) {
      conditions.push(lte(leadsDescarga.createdAt, new Date(params.dateTo)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (params.page - 1) * PAGE_SIZE;

    const [items, countResult] = await Promise.all([
      db
        .select()
        .from(leadsDescarga)
        .where(where)
        .orderBy(desc(leadsDescarga.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset),
      db.select({ count: count() }).from(leadsDescarga).where(where),
    ]);

    return {
      success: true,
      items,
      total: countResult[0]?.count ?? 0,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al cargar leads",
    };
  }
}
