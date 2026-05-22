/**
 * run-seeds.ts — Runner de seeds para la base de datos.
 * Uso: npm run db:seed
 *
 * Requiere DATABASE_URL en el entorno.
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema";
import { GLOSARIO_SEEDS } from "./glosario";
import { BLOG_SEEDS } from "./blog";

async function main() {
  console.log("🌱 Iniciando seeds...");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurado");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  const db = drizzle(client, { schema });

  try {
    // ─── Seed: glosario_terminos ──────────────────────────────
    console.log(`\n📚 Insertando ${GLOSARIO_SEEDS.length} términos del glosario...`);

    for (const termino of GLOSARIO_SEEDS) {
      await db
        .insert(schema.glosarioTerminos)
        .values({
          slug: termino.slug,
          termino: termino.termino,
          letra: termino.letra,
          definicionCorta: termino.definicionCorta,
          definicionLarga: termino.definicionLarga,
          areaLegal: termino.areaLegal,
          sinonimos: termino.sinonimos ?? null,
          terminosRelacionados: termino.terminosRelacionados ?? null,
        })
        .onConflictDoNothing();
    }

    console.log(`✅ Glosario: ${GLOSARIO_SEEDS.length} términos procesados`);

    // ─── Seed: blog_posts ────────────────────────────────────
    console.log(`\n📝 Insertando ${BLOG_SEEDS.length} posts del blog...`);

    for (const post of BLOG_SEEDS) {
      await db
        .insert(schema.blogPosts)
        .values({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          contentMd: post.contentMd,
          contentHtml: post.contentHtml || post.contentMd, // fallback
          areaLegal: post.areaLegal,
          author: post.author,
          published: post.published,
          publishedAt: post.published ? new Date() : null,
          seoTitle: post.seoTitle ?? null,
          seoDescription: post.seoDescription ?? null,
        })
        .onConflictDoNothing();
    }

    console.log(`✅ Blog: ${BLOG_SEEDS.length} posts procesados`);

    console.log("\n✅ Seeds completados exitosamente");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("❌ Error en seeds:", err);
  process.exit(1);
});
