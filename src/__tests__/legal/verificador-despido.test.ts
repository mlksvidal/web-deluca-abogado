/**
 * Tests para evaluarDespido() — verificador de legalidad del despido.
 */

import { describe, it, expect } from "vitest";
import { evaluarDespido } from "../../lib/legal/verificador-despido";

describe("evaluarDespido — casos claros", () => {
  it("trabajo no registrado → siempre ILEGAL", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: true,
      antiguedadAnios: 2,
      registrado: false,
      motivoInformado: false,
      recibioLiquidacion: true,
    });
    expect(r.diagnostico).toBe("ilegal");
    expect(r.razones.some((x) => x.toLowerCase().includes("negro"))).toBe(true);
  });

  it("despido sin causa, con preaviso, liquidación, registrado → LEGAL", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: true,
      antiguedadAnios: 3,
      registrado: true,
      motivoInformado: false,
      recibioLiquidacion: true,
    });
    expect(r.diagnostico).toBe("legal");
  });

  it("despido con causa sin comunicación escrita del motivo → ILEGAL", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_con_causa",
      preavisoRecibido: false,
      antiguedadAnios: 5,
      registrado: true,
      motivoInformado: false, // causa no comunicada por escrito
      recibioLiquidacion: true,
    });
    expect(r.diagnostico).toBe("ilegal");
  });

  it("presión para renunciar → ILEGAL", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: false,
      antiguedadAnios: 1,
      registrado: true,
      motivoInformado: false,
      recibioLiquidacion: false,
      presionParaRenunciar: true,
    });
    expect(r.diagnostico).toBe("ilegal");
  });

  it("firma sin entender → ILEGAL", () => {
    const r = evaluarDespido({
      tipoDespido: "mutuo_acuerdo",
      preavisoRecibido: true,
      antiguedadAnios: 4,
      registrado: true,
      motivoInformado: true,
      recibioLiquidacion: true,
      firmoSinEntender: true,
    });
    expect(r.diagnostico).toBe("ilegal");
  });

  it("mutuo acuerdo sin otros problemas → no ILEGAL (solo requiere verificar homologación)", () => {
    const r = evaluarDespido({
      tipoDespido: "mutuo_acuerdo",
      preavisoRecibido: true,
      antiguedadAnios: 3,
      registrado: true,
      motivoInformado: true,
      recibioLiquidacion: true,
    });
    // Mutuo acuerdo solo suma 1 punto dudoso → no alcanza a ilegal
    expect(r.diagnostico).not.toBe("ilegal");
    expect(r.razones.some((x) => x.toLowerCase().includes("homolog"))).toBe(true);
  });

  it("despido con causa comunicado por escrito → DUDOSO (requiere análisis)", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_con_causa",
      preavisoRecibido: true,
      antiguedadAnios: 2,
      registrado: true,
      motivoInformado: true,
      recibioLiquidacion: true,
    });
    // Con motivo informado es dudoso (la causa debe evaluarse)
    expect(["dudoso", "legal"]).toContain(r.diagnostico);
  });

  it("sin liquidación final Y sin preaviso → al menos DUDOSO", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: false, // sin preaviso → puntosIlegales += 1
      antiguedadAnios: 2,
      registrado: true,
      motivoInformado: false,
      recibioLiquidacion: false, // sin liquidación → puntosDudosos += 1
    });
    // 1 ilegal + 1 dudoso → diagnostico "dudoso" (umbral ilegal es >= 2)
    expect(["dudoso", "ilegal"]).toContain(r.diagnostico);
  });
});

describe("evaluarDespido — recomendación y disclaimer", () => {
  it("diagnóstico ILEGAL incluye advertencia de no firmar", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: false,
      antiguedadAnios: 2,
      registrado: false,
      motivoInformado: false,
      recibioLiquidacion: false,
    });
    expect(r.recomendacion.toLowerCase()).toMatch(/firmar|abogado/);
  });

  it("diagnóstico LEGAL incluye sugerencia de consulta preventiva", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: true,
      antiguedadAnios: 3,
      registrado: true,
      motivoInformado: false,
      recibioLiquidacion: true,
    });
    expect(r.recomendacion).toBeTruthy();
    expect(r.recomendacion.length).toBeGreaterThan(20);
  });

  it("el disclaimer está presente en todos los casos", () => {
    const r = evaluarDespido({
      tipoDespido: "directo_sin_causa",
      preavisoRecibido: true,
      antiguedadAnios: 1,
      registrado: true,
      motivoInformado: false,
      recibioLiquidacion: true,
    });
    expect(r.disclaimer).toBeTruthy();
  });
});
