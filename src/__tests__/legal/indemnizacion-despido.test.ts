/**
 * Tests para calcularDespido() — Art. 245 LCT + preaviso + SAC + multa art. 80.
 *
 * Casos verificados manualmente contra la fórmula legal argentina.
 */

import { describe, it, expect } from "vitest";
import { calcularDespido } from "../../lib/legal/indemnizacion-despido";

describe("calcularDespido — art. 245 básico", () => {
  it("1 año de antigüedad, $500.000, sin preaviso otorgado", () => {
    const r = calcularDespido({
      sueldoBruto: 500000,
      antiguedadAnios: 1,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
    });
    // art 245: 500000 × 1 = 500000
    expect(r.desglose.art245).toBe(500000);
    // preaviso: 1 mes = 500000
    expect(r.desglose.preaviso).toBe(500000);
    // SAC s/preaviso: 500000 / 12 ≈ 41667
    expect(r.desglose.sacSobrePreaviso).toBeCloseTo(41666.67, 0);
    expect(r.desglose.total).toBeCloseTo(1041666.67, 0);
  });

  it("5 años completos, $800.000 — preaviso 2 meses", () => {
    const r = calcularDespido({
      sueldoBruto: 800000,
      antiguedadAnios: 5,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
    });
    // art 245: 800000 × 5 = 4000000
    expect(r.desglose.art245).toBe(4000000);
    // preaviso: 2 meses = 1600000
    expect(r.desglose.preaviso).toBe(1600000);
    // SAC: 1600000 / 12 ≈ 133333
    expect(r.desglose.sacSobrePreaviso).toBeCloseTo(133333.33, 0);
    expect(r.desglose.total).toBeCloseTo(5733333.33, 0);
  });

  it("3 años + 4 meses: los 4 meses se redondean a 1 año extra", () => {
    const r = calcularDespido({
      sueldoBruto: 600000,
      antiguedadAnios: 3,
      antiguedadMeses: 4,
      tipoDespido: "sin_causa",
    });
    // 3 años + 4 meses → 4 años computados
    expect(r.desglose.aniosComputados).toBe(4);
    // art 245: 600000 × 4 = 2400000
    expect(r.desglose.art245).toBe(2400000);
  });

  it("3 años + 2 meses: los 2 meses NO se redondean (< 3)", () => {
    const r = calcularDespido({
      sueldoBruto: 600000,
      antiguedadAnios: 3,
      antiguedadMeses: 2,
      tipoDespido: "sin_causa",
    });
    // 2 meses < 3: no se agregan
    expect(r.desglose.aniosComputados).toBe(3);
    expect(r.desglose.art245).toBe(1800000);
  });

  it("preaviso otorgado: no se cobra indemnización sustitutiva", () => {
    const r = calcularDespido({
      sueldoBruto: 500000,
      antiguedadAnios: 2,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
      preavisoOtorgado: true,
    });
    expect(r.desglose.preaviso).toBe(0);
    expect(r.desglose.sacSobrePreaviso).toBe(0);
    // Solo art. 245
    expect(r.desglose.total).toBe(1000000);
  });

  it("multa art. 80 = 3 sueldos cuando aplica", () => {
    const r = calcularDespido({
      sueldoBruto: 500000,
      antiguedadAnios: 2,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
      aplicarMultaArt80: true,
    });
    expect(r.desglose.multaArt80).toBe(1500000);
  });

  it("tope convencional aplicado cuando sueldo supera 3× promedio", () => {
    // Tope convencional = 300000 → tope art245 = 900000
    // Sueldo real = 1200000 → se trunca a 900000
    const r = calcularDespido({
      sueldoBruto: 1200000,
      antiguedadAnios: 3,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
      topeConvencional: 300000,
    });
    expect(r.desglose.topeAplicado).toBe(true);
    expect(r.desglose.baseCalculo).toBe(900000);
    expect(r.desglose.art245).toBe(2700000); // 900000 × 3
  });

  it("despido con causa: total = 0", () => {
    const r = calcularDespido({
      sueldoBruto: 800000,
      antiguedadAnios: 5,
      antiguedadMeses: 0,
      tipoDespido: "con_causa",
    });
    expect(r.desglose.art245).toBe(0);
    expect(r.desglose.total).toBe(0);
  });

  it("período de prueba < 3 meses: solo 15 días de preaviso", () => {
    const r = calcularDespido({
      sueldoBruto: 400000,
      antiguedadAnios: 0,
      antiguedadMeses: 1,
      tipoDespido: "periodo_prueba",
    });
    expect(r.desglose.art245).toBe(0);
    // 15 días ≈ 400000 × (15/30) = 200000
    expect(r.desglose.preaviso).toBeCloseTo(200000, 0);
  });

  it("despido indirecto: mismos cálculos que sin_causa", () => {
    const r = calcularDespido({
      sueldoBruto: 700000,
      antiguedadAnios: 4,
      antiguedadMeses: 0,
      tipoDespido: "indirecto",
    });
    expect(r.desglose.art245).toBe(2800000);
    expect(r.desglose.preaviso).toBe(700000); // < 5 años → 1 mes
  });

  it("antigüedad exactamente 5 años → preaviso 2 meses", () => {
    const r = calcularDespido({
      sueldoBruto: 600000,
      antiguedadAnios: 5,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
    });
    expect(r.desglose.preaviso).toBe(1200000); // 2 meses
  });

  it("caso completo: 10 años, $1.000.000, multa art. 80", () => {
    const r = calcularDespido({
      sueldoBruto: 1000000,
      antiguedadAnios: 10,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
      aplicarMultaArt80: true,
    });
    // art 245: 1000000 × 10 = 10000000
    expect(r.desglose.art245).toBe(10000000);
    // preaviso: 2 meses = 2000000
    expect(r.desglose.preaviso).toBe(2000000);
    // SAC: 2000000/12 ≈ 166667
    expect(r.desglose.sacSobrePreaviso).toBeCloseTo(166666.67, 0);
    // multa: 3 sueldos = 3000000
    expect(r.desglose.multaArt80).toBe(3000000);
    // total ≈ 15166667
    expect(r.desglose.total).toBeCloseTo(15166666.67, 0);
  });
});

describe("calcularDespido — validaciones de input", () => {
  it("lanza error si sueldo es 0", () => {
    expect(() =>
      calcularDespido({
        sueldoBruto: 0,
        antiguedadAnios: 2,
        antiguedadMeses: 0,
        tipoDespido: "sin_causa",
      })
    ).toThrow("mayor a 0");
  });

  it("retorna disclaimer con texto legal", () => {
    const r = calcularDespido({
      sueldoBruto: 500000,
      antiguedadAnios: 1,
      antiguedadMeses: 0,
      tipoDespido: "sin_causa",
    });
    expect(r.disclaimer).toBeTruthy();
    expect(r.disclaimer.length).toBeGreaterThan(50);
  });
});
