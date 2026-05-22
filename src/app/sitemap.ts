import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { db } from "@/lib/db";
import { blogPosts, glosarioTerminos } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";
import { RECURSOS } from "@/lib/recursos-config";

const base = siteConfig.siteUrl;

/**
 * sitemap.ts — Sitemap dinámico para todas las rutas del proyecto.
 * Incluye rutas estáticas + dinámicas desde DB (blog, glosario) + recursos config.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Rutas estáticas ──────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/reservar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/areas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/casos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/estudio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/consultar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/calculadora`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/calculadora/indemnizacion-despido`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/calculadora/cuota-alimentaria`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/calculadora/indemnizacion-art`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/recursos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/glosario`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/verificador/despido`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/proceso/divorcio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terminos`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ─── Recursos descargables (config-driven) ────────────────────
  const recursosRoutes: MetadataRoute.Sitemap = RECURSOS.map((r) => ({
    url: `${base}/recursos/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ─── Rutas dinámicas desde DB ─────────────────────────────────
  let blogRoutes: MetadataRoute.Sitemap = [];
  let glosarioRoutes: MetadataRoute.Sitemap = [];

  try {
    // Blog — solo posts publicados y no eliminados
    const posts = await db
      .select({
        slug: blogPosts.slug,
        updatedAt: blogPosts.updatedAt,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.published, true));

    blogRoutes = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // Glosario — todos los términos no eliminados (soft-delete)
    const terminos = await db
      .select({ slug: glosarioTerminos.slug, updatedAt: glosarioTerminos.updatedAt })
      .from(glosarioTerminos)
      .where(isNull(glosarioTerminos.deletedAt));

    glosarioRoutes = terminos.map((t) => ({
      url: `${base}/glosario/${t.slug}`,
      lastModified: t.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  } catch {
    // Si la DB no está disponible en build time (CI sin DATABASE_URL), continuar sin rutas dinámicas
    console.warn("[sitemap] DB unavailable, skipping dynamic routes");
  }

  return [...staticRoutes, ...recursosRoutes, ...blogRoutes, ...glosarioRoutes];
}
