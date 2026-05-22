/**
 * Tests para Server Actions de glosario — T8
 *
 * Cobertura:
 *   - listTerminos: retorna terminos con estructura correcta
 *   - listTerminos: filtro por letra → pasa letra en condición
 *   - listTerminos: búsqueda por texto → pasa
 *   - listTerminos: letra inválida (número) → error validation_error
 *   - getTerminoBySlug: slug válido → retorna termino
 *   - getTerminoBySlug: slug inexistente → error not_found
 *   - getTerminoBySlug: slug con caracteres inválidos → error validation_error
 *   - createTermino: input válido → success
 *   - createTermino: slug duplicado → error slug_taken
 *   - createTermino: definicion corta vacía → error validation_error
 *   - updateTermino: actualiza campos → success
 *   - deleteTermino: soft-delete → success
 *   - deleteTermino: no existe → error not_found
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

function makeTermino(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    slug: "accion-civil",
    termino: "Acción Civil",
    letra: "A",
    definicionCorta: "Recurso legal para reclamar derechos civiles.",
    definicionLarga: "La acción civil es el mecanismo procesal mediante el cual...",
    areaLegal: "civil_familia",
    sinonimos: ["demanda civil", "pretensión civil"],
    terminosRelacionados: ["proceso-civil"],
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

const validTerminoData = {
  slug: "contrato-laboral",
  termino: "Contrato Laboral",
  letra: "C",
  definicionCorta: "Acuerdo entre empleador y empleado.",
  definicionLarga:
    "El contrato laboral es el vínculo jurídico que une al trabajador con su empleador...",
  areaLegal: "laboral" as const,
  sinonimos: ["contrato de trabajo"],
  terminosRelacionados: ["despido", "indemnizacion"],
};

// ─── listTerminos ─────────────────────────────────────────────────────────────

describe("listTerminos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna terminos con estructura correcta (items, total, hasMore)", async () => {
    const { listTerminos } = await import("@/app/actions/glosario");

    const fakeTermino = makeTermino();
    let callIndex = 0;
    mockSelect.mockImplementation(() => {
      callIndex++;
      if (callIndex === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue([fakeTermino]),
                }),
              }),
            }),
          }),
        };
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }]),
        }),
      };
    });

    const result = await listTerminos({ page: 1, pageSize: 40 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty("items");
      expect(result.data).toHaveProperty("total");
      expect(result.data).toHaveProperty("hasMore");
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(40);
    }
  });

  it("filtro por letra válida → success (la condición de letra se aplica)", async () => {
    const { listTerminos } = await import("@/app/actions/glosario");

    let callIndex = 0;
    mockSelect.mockImplementation(() => {
      callIndex++;
      if (callIndex === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue([makeTermino({ letra: "A" })]),
                }),
              }),
            }),
          }),
        };
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 5 }]),
        }),
      };
    });

    const result = await listTerminos({ letra: "a" }); // lowercase → se transforma a "A"

    expect(result.success).toBe(true);
  });

  it("búsqueda con texto válido → success", async () => {
    const { listTerminos } = await import("@/app/actions/glosario");

    let callIndex = 0;
    mockSelect.mockImplementation(() => {
      callIndex++;
      if (callIndex === 1) {
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue([makeTermino()]),
                }),
              }),
            }),
          }),
        };
      }
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }]),
        }),
      };
    });

    const result = await listTerminos({ search: "accion" });

    expect(result.success).toBe(true);
  });

  it("letra inválida (número) → error validation_error", async () => {
    const { listTerminos } = await import("@/app/actions/glosario");

    const result = await listTerminos({ letra: "3" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("búsqueda con texto demasiado largo → error validation_error", async () => {
    const { listTerminos } = await import("@/app/actions/glosario");

    const result = await listTerminos({ search: "a".repeat(200) });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});

// ─── getTerminoBySlug ─────────────────────────────────────────────────────────

describe("getTerminoBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("slug válido → retorna termino", async () => {
    const { getTerminoBySlug } = await import("@/app/actions/glosario");

    const fakeTermino = makeTermino({ slug: "accion-civil" });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([fakeTermino]),
        }),
      }),
    });

    const result = await getTerminoBySlug("accion-civil");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("accion-civil");
    }
  });

  it("termino no encontrado → error not_found", async () => {
    const { getTerminoBySlug } = await import("@/app/actions/glosario");

    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const result = await getTerminoBySlug("termino-inexistente");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("not_found");
    }
  });

  it("slug con caracteres inválidos → error validation_error", async () => {
    const { getTerminoBySlug } = await import("@/app/actions/glosario");

    const result = await getTerminoBySlug("TERMINO INVÁLIDO");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});

// ─── createTermino ────────────────────────────────────────────────────────────

describe("createTermino", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("input válido → crea termino con success", async () => {
    const { createTermino } = await import("@/app/actions/glosario");

    const fakeTermino = makeTermino({ slug: validTerminoData.slug });
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([fakeTermino]),
      }),
    });

    const result = await createTermino(validTerminoData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe(validTerminoData.slug);
    }
  });

  it("slug duplicado → error slug_taken", async () => {
    const { createTermino } = await import("@/app/actions/glosario");

    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi
          .fn()
          .mockRejectedValue(new Error("duplicate key value violates unique constraint")),
      }),
    });

    const result = await createTermino(validTerminoData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("slug_taken");
    }
  });

  it("definicionCorta vacía → error validation_error", async () => {
    const { createTermino } = await import("@/app/actions/glosario");

    const result = await createTermino({ ...validTerminoData, definicionCorta: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("letra con número → error validation_error", async () => {
    const { createTermino } = await import("@/app/actions/glosario");

    const result = await createTermino({ ...validTerminoData, letra: "9" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });

  it("más de 20 sinónimos → error validation_error", async () => {
    const { createTermino } = await import("@/app/actions/glosario");

    const result = await createTermino({
      ...validTerminoData,
      sinonimos: Array(25).fill("sinonimo"),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});

// ─── updateTermino ────────────────────────────────────────────────────────────

describe("updateTermino", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("actualiza campos correctamente → success", async () => {
    const { updateTermino } = await import("@/app/actions/glosario");

    const fakeTermino = makeTermino({ definicionCorta: "Nueva definición corta actualizada." });
    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([fakeTermino]),
        }),
      }),
    });

    const result = await updateTermino("accion-civil", {
      definicionCorta: "Nueva definición corta actualizada.",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.definicionCorta).toBe("Nueva definición corta actualizada.");
    }
  });

  it("termino no encontrado → error not_found", async () => {
    const { updateTermino } = await import("@/app/actions/glosario");

    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const result = await updateTermino("slug-inexistente", {
      definicionCorta: "Actualización.",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("not_found");
    }
  });
});

// ─── deleteTermino ────────────────────────────────────────────────────────────

describe("deleteTermino", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("soft-delete de termino existente → success con slug", async () => {
    const { deleteTermino } = await import("@/app/actions/glosario");

    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ slug: "accion-civil" }]),
        }),
      }),
    });

    const result = await deleteTermino("accion-civil");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe("accion-civil");
    }
  });

  it("termino no existe → error not_found", async () => {
    const { deleteTermino } = await import("@/app/actions/glosario");

    mockUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const result = await deleteTermino("slug-inexistente");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("not_found");
    }
  });

  it("slug inválido → error validation_error", async () => {
    const { deleteTermino } = await import("@/app/actions/glosario");

    const result = await deleteTermino("SLUG INVÁLIDO!");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("validation_error");
    }
  });
});
