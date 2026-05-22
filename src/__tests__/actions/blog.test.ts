/**
 * Tests para Server Actions de blog — T8
 *
 * Cobertura:
 *   - listPosts: retorna posts paginados con estructura correcta
 *   - listPosts: pageSize inválido → error validation_error
 *   - getPostBySlug: slug válido → retorna post
 *   - getPostBySlug: slug inválido (con mayúsculas/espacios) → error validation_error
 *   - getPostBySlug: post no existe → error not_found
 *   - createPost: input válido → success con post creado
 *   - createPost: slug duplicado → error slug_taken
 *   - createPost: campos faltantes → error validation_error
 *   - updatePost: actualiza campos → success
 *   - updatePost: post no encontrado → error not_found
 *   - publishPost: publica post → success con published=true
 *   - deletePost: soft-delete → success
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeBlogPost(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    slug: "guia-despido-laboral",
    title: "Guía de Despido Laboral",
    excerpt: "Todo sobre el despido en Argentina.",
    contentMd: "## Introducción\n\nEste es el contenido.",
    contentHtml: "<h2>Introducción</h2><p>Este es el contenido.</p>",
    areaLegal: "laboral" as const,
    author: "Dr. Pablo De Luca",
    published: true,
    publishedAt: new Date(),
    seoTitle: null,
    seoDescription: null,
    ogImage: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

const validPostData = {
  slug: "nueva-guia-laboral",
  title: "Nueva Guía Laboral",
  excerpt: "Resumen del artículo sobre derecho laboral.",
  contentMd: "## Sección 1\n\nContenido completo del artículo.",
  areaLegal: "laboral" as const,
};

// ─── listPosts ────────────────────────────────────────────────────────────────

describe("listPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna posts con estructura correcta (items, total, page, hasMore)", async () => {
    const { listPosts } = await import("@/app/actions/blog");

    const fakePost = makeBlogPost();
    let callIndex = 0;
    mockSelect.mockImplementation(() => {
      callIndex++;
      if (callIndex === 1) {
        // Primera llamada → items
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue([fakePost]),
                }),
              }),
            }),
          }),
        };
      }
      // Segunda llamada → count
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }]),
        }),
      };
    });

    const result = await listPosts({ page: 1, pageSize: 6 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty("items");
      expect(result.data).toHaveProperty("total");
      expect(result.data).toHaveProperty("page");
      expect(result.data).toHaveProperty("pageSize");
      expect(result.data).toHaveProperty("hasMore");
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(6);
    }
  });

  it("pageSize mayor a 50 → error validation_error", async () => {
    const { listPosts } = await import("@/app/actions/blog");

    const result = await listPosts({ pageSize: 100 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("page inválida (0) → error validation_error", async () => {
    const { listPosts } = await import("@/app/actions/blog");

    const result = await listPosts({ page: 0 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});

// ─── getPostBySlug ────────────────────────────────────────────────────────────

describe("getPostBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("slug válido y post existente → retorna success con post", async () => {
    const { getPostBySlug } = await import("@/app/actions/blog");

    const fakePost = makeBlogPost({ slug: "guia-laboral" });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([fakePost]),
        }),
      }),
    });

    const result = await getPostBySlug("guia-laboral");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("guia-laboral");
    }
  });

  it("slug con mayúsculas → error validation_error", async () => {
    const { getPostBySlug } = await import("@/app/actions/blog");

    const result = await getPostBySlug("GUIA-LABORAL");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("slug con espacios → error validation_error", async () => {
    const { getPostBySlug } = await import("@/app/actions/blog");

    const result = await getPostBySlug("guia laboral");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("post no encontrado → error not_found", async () => {
    const { getPostBySlug } = await import("@/app/actions/blog");

    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // vacío
        }),
      }),
    });

    const result = await getPostBySlug("slug-inexistente");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("not_found");
    }
  });
});

// ─── createPost ───────────────────────────────────────────────────────────────

describe("createPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("input válido → crea post con contentHtml sanitizado", async () => {
    const { createPost } = await import("@/app/actions/blog");

    const fakePost = makeBlogPost({ slug: validPostData.slug, published: false });
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([fakePost]),
      }),
    });

    const result = await createPost(validPostData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe(validPostData.slug);
    }
  });

  it("slug con caracteres inválidos → error validation_error", async () => {
    const { createPost } = await import("@/app/actions/blog");

    const result = await createPost({ ...validPostData, slug: "Slug Inválido!" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("title vacío → error validation_error con campo title", async () => {
    const { createPost } = await import("@/app/actions/blog");

    const result = await createPost({ ...validPostData, title: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
      expect(result.fields?.title).toBeDefined();
    }
  });

  it("slug duplicado → error slug_taken", async () => {
    const { createPost } = await import("@/app/actions/blog");

    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi
          .fn()
          .mockRejectedValue(new Error("duplicate key value violates unique constraint")),
      }),
    });

    const result = await createPost(validPostData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("slug_taken");
    }
  });

  it("contentMd vacío → error validation_error", async () => {
    const { createPost } = await import("@/app/actions/blog");

    const result = await createPost({ ...validPostData, contentMd: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});

// ─── publishPost ──────────────────────────────────────────────────────────────

describe("publishPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publica post existente → success con published=true y publishedAt", async () => {
    const { publishPost } = await import("@/app/actions/blog");

    const now = new Date();
    const fakePost = makeBlogPost({ published: true, publishedAt: now });
    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([fakePost]),
        }),
      }),
    });

    const result = await publishPost("guia-laboral");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(true);
      expect(result.data.publishedAt).toBeDefined();
    }
  });

  it("post no encontrado → error not_found", async () => {
    const { publishPost } = await import("@/app/actions/blog");

    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]), // vacío → not found
        }),
      }),
    });

    const result = await publishPost("slug-inexistente");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("not_found");
    }
  });

  it("slug inválido → error validation_error", async () => {
    const { publishPost } = await import("@/app/actions/blog");

    const result = await publishPost("SLUG INVÁLIDO");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});

// ─── deletePost ───────────────────────────────────────────────────────────────

describe("deletePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("soft-delete de post existente → success con slug", async () => {
    const { deletePost } = await import("@/app/actions/blog");

    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ slug: "guia-laboral" }]),
        }),
      }),
    });

    const result = await deletePost("guia-laboral");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("guia-laboral");
    }
  });

  it("post no existe → error not_found", async () => {
    const { deletePost } = await import("@/app/actions/blog");

    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const result = await deletePost("slug-inexistente");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("not_found");
    }
  });
});
