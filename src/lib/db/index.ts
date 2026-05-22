import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Connection string must use Transaction Pooler (port 6543) with prepare=false
// for Supabase compatibility with serverless/edge environments.
//
// NOTE: We defer the throw to runtime (not module evaluation) to allow
// `next build` to run without DATABASE_URL set in the build environment.
// The error surfaces immediately on first request if the var is missing.
const connectionString = process.env.DATABASE_URL ?? "";

// postgres.js con prepare:false obligatorio para Supabase Pooler
const client = postgres(connectionString || "postgresql://localhost/placeholder", {
  prepare: false,
  max: 1, // pool 1 para serverless
});

/**
 * Drizzle ORM client.
 * Throws at runtime if DATABASE_URL is not set — never at build time.
 */
export const db = drizzle(client, { schema });

export type DB = typeof db;

/** Guard para server actions y server components — llama al inicio del handler */
export function assertDatabaseUrl(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Configurá la variable de entorno.");
  }
}
