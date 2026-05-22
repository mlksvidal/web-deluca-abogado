"use server";

/**
 * Server Actions admin para bookings — T35
 * Marcar turno como "completed" (atendido).
 */

import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

export async function markBookingCompleted(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = idSchema.safeParse(bookingId);
  if (!parsed.success) {
    return { success: false, error: "ID inválido" };
  }

  try {
    const updated = await db
      .update(bookings)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(bookings.id, parsed.data))
      .returning({ id: bookings.id });

    if (updated.length === 0) {
      return { success: false, error: "Turno no encontrado" };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al actualizar",
    };
  }
}
