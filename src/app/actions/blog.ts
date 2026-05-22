"use server";

/**
 * Server Actions de blog — T8
 *
 * Operaciones públicas: listPosts, getPostBySlug
 * Operaciones admin (placeholder auth — se valida en T34 Basic Auth):
 *   createPost, updatePost, publishPost, deletePost (soft-delete vía deletedAt)
 *
 * content_html siempre sanitizado con rehype-sanitize antes de almacenar.
 */

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

// ─── Logger estructurado ──────────────────────────────────────────────────────

function log(level: "info" | "warn" | "error", context: Record<string, unknown>, msg: string) {
  console[level === "info" ? "log" : level](
    JSON.stringify({ level, msg, ts: new Date().toISOString(), ...context })
  );
}

// ─── Procesador Markdown → HTML sanitizado ────────────────────────────────────

async function markdownToSafeHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize) // sanitización obligatoria antes de almacenar
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

// ─── Auth placeholder ─────────────────────────────────────────────────────────

/**
 * Verifica contexto admin.
 * Placeholder hasta T34 (proxy.ts Basic Auth).
 * Las rutas /admin/* quedan protegidas por proxy.ts antes de llegar aquí.
 * Esta función es defensa en profundidad — no bloquea en dev.
 */
function assertAdminContext(): void {
  // T34 implementará la verificación real.
}

// ─── Schemas Zod ─────────────────────────────────────────────────────────────

const postSlugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, { error: "Slug inválido" });

const listPostsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(6),
  area: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"]).optional(),
});

const upsertPostSchema = z.object({
  slug: postSlugSchema,
  title: z.string().min(1).max(200).trim(),
  excerpt: z.string().min(1).max(500).trim(),
  contentMd: z.string().min(1).max(100_000).trim(),
  areaLegal: z.enum(["civil_familia", "laboral", "penal", "comercial", "general"]),
  author: z.string().min(1).max(100).trim().optional(),
  seoTitle: z.string().max(70).trim().optional(),
  seoDescription: z.string().max(160).trim().optional(),
  ogImage: z.string().max(500).optional(),
});

// ─── Tipos de resultado ───────────────────────────────────────────────────────

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fields?: Record<string, string[]> };

export type BlogPostRow = typeof blogPosts.$inferSelect;

export type PostListResult = {
  items: BlogPostRow[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// ─── listPosts (público) ──────────────────────────────────────────────────────

export async function listPosts(params: {
  page?: number;
  pageSize?: number;
  area?: string;
}): Promise<ActionResult<PostListResult>> {
  const parsed = listPostsSchema.safeParse({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 6,
    area: params.area,
  });

  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  const { page, pageSize, area } = parsed.data;
  const offset = (page - 1) * pageSize;

  const baseConditions: ReturnType<typeof eq>[] = [
    eq(blogPosts.published, true),
    isNull(blogPosts.deletedAt),
  ];
  if (area) {
    baseConditions.push(
      eq(
        blogPosts.areaLegal,
        area as "civil_familia" | "laboral" | "penal" | "comercial" | "general"
      )
    );
  }

  const whereClause = and(...baseConditions);

  try {
    const [items, countRows] = await Promise.all([
      db
        .select()
        .from(blogPosts)
        .where(whereClause)
        .orderBy(desc(blogPosts.publishedAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(blogPosts)
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
      "[blog] Error al listar posts"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── getPostBySlug (público) ──────────────────────────────────────────────────

export async function getPostBySlug(slug: string): Promise<ActionResult<BlogPostRow>> {
  const parsedSlug = postSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.slug, parsedSlug.data),
          eq(blogPosts.published, true),
          isNull(blogPosts.deletedAt)
        )
      )
      .limit(1);

    if (!post) {
      return { success: false, error: "not_found" };
    }

    return { success: true, data: post };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[blog] Error al obtener post por slug"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── createPost (admin) ───────────────────────────────────────────────────────

export async function createPost(
  data: z.input<typeof upsertPostSchema>
): Promise<ActionResult<BlogPostRow>> {
  assertAdminContext();

  const parsed = upsertPostSchema.safeParse(data);
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = [];
      fields[key].push(issue.message);
    }
    return { success: false, error: "validation_error", fields };
  }

  const { contentMd, ...rest } = parsed.data;

  // Sanitizar HTML antes de persistir
  let contentHtml: string;
  try {
    contentHtml = await markdownToSafeHtml(contentMd);
  } catch (err) {
    log(
      "error",
      { err: err instanceof Error ? err.message : String(err) },
      "[blog] Error al procesar Markdown"
    );
    return { success: false, error: "markdown_error" };
  }

  try {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...rest,
        author: rest.author ?? "Dr. Pablo De Luca",
        contentMd,
        contentHtml,
        published: false,
      })
      .returning();

    log("info", { postId: post.id, slug: post.slug }, "[blog] Post creado");
    return { success: true, data: post };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return { success: false, error: "slug_taken" };
    }
    log("error", { err: msg }, "[blog] Error al crear post en DB");
    return { success: false, error: "internal_error" };
  }
}

// ─── updatePost (admin) ───────────────────────────────────────────────────────

export async function updatePost(
  slug: string,
  data: Partial<z.input<typeof upsertPostSchema>>
): Promise<ActionResult<BlogPostRow>> {
  assertAdminContext();

  const parsedSlug = postSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  const updateSchema = upsertPostSchema.partial().omit({ slug: true });
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "validation_error" };
  }

  const { contentMd, ...rest } = parsed.data;

  const updates: Partial<typeof blogPosts.$inferInsert> = {
    ...rest,
    updatedAt: new Date(),
  };

  if (contentMd) {
    try {
      updates.contentHtml = await markdownToSafeHtml(contentMd);
      updates.contentMd = contentMd;
    } catch (err) {
      log(
        "error",
        { err: err instanceof Error ? err.message : String(err) },
        "[blog] Error al procesar Markdown en update"
      );
      return { success: false, error: "markdown_error" };
    }
  }

  try {
    const [updated] = await db
      .update(blogPosts)
      .set(updates)
      .where(and(eq(blogPosts.slug, parsedSlug.data), isNull(blogPosts.deletedAt)))
      .returning();

    if (!updated) {
      return { success: false, error: "not_found" };
    }

    log("info", { slug, postId: updated.id }, "[blog] Post actualizado");
    return { success: true, data: updated };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[blog] Error al actualizar post"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── publishPost (admin) ──────────────────────────────────────────────────────

export async function publishPost(slug: string): Promise<ActionResult<BlogPostRow>> {
  assertAdminContext();

  const parsedSlug = postSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    const [updated] = await db
      .update(blogPosts)
      .set({
        published: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(blogPosts.slug, parsedSlug.data), isNull(blogPosts.deletedAt)))
      .returning();

    if (!updated) {
      return { success: false, error: "not_found" };
    }

    log("info", { slug, postId: updated.id }, "[blog] Post publicado");
    return { success: true, data: updated };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[blog] Error al publicar post"
    );
    return { success: false, error: "internal_error" };
  }
}

// ─── deletePost (admin) — soft-delete ────────────────────────────────────────

export async function deletePost(slug: string): Promise<ActionResult<{ slug: string }>> {
  assertAdminContext();

  const parsedSlug = postSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return { success: false, error: "validation_error" };
  }

  try {
    const [deleted] = await db
      .update(blogPosts)
      .set({
        deletedAt: new Date(),
        published: false,
        updatedAt: new Date(),
      })
      .where(and(eq(blogPosts.slug, parsedSlug.data), isNull(blogPosts.deletedAt)))
      .returning({ slug: blogPosts.slug });

    if (!deleted) {
      return { success: false, error: "not_found" };
    }

    log("info", { slug }, "[blog] Post eliminado (soft-delete)");
    return { success: true, data: { slug: deleted.slug } };
  } catch (err) {
    log(
      "error",
      { slug, err: err instanceof Error ? err.message : String(err) },
      "[blog] Error al eliminar post"
    );
    return { success: false, error: "internal_error" };
  }
}
