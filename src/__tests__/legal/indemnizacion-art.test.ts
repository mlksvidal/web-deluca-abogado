/**
 * Tests para calcularART() — Ley 24.557 + Ley 26.773.
 *
 * Fórmula verificada manualmente:
 *   VIB = 53 × IBM × (% incapacidad / 100) × (65 / edad)
 *   Adicional = VIB × 0.20 (si laboral o in itinere)
 */

import { describe, it, expect } from "vitest";
import { calcularART } from "../../lib/legal/indemnizacion-art";

describe("calcularART — incapacidad permanente parcial", () => {
  it("caso base: 30% incapacidad, sueldo $600.000, edad 45, accidente laboral", () => {
    const r = calcularART({
      sueldoBruto: 600000,
      porcentajeIncapacidad: 30,
      edad: 45,
      tipoAccidente: "laboral",
    });

    // VIB = 53 × 600000 × 0.30 × (65/45)
    // = 53 × 600000 × 0.30 × 1.4444...
    // = 53 × 260000
    // = 13780000 × (65/45)
    const coef = 65 / 45;
    const vibEsperado = 53 * 600000 * 0.3 * coef;
    expect(r.desglose.vib).toBeCloseTo(vibEsperado, 0);

    // Adicional 20%
    const adicionalEsperado = vibEsperado * 0.2;
    expect(r.desglose.adicionalLey26773).toBeCloseTo(adicionalEsperado, 0);

    // Total
    expect(r.desglose.total).toBeCloseTo(vibEsperado + adicionalEsperado, 0);
  });

  it("accidente in itinere incluye adicional 20%", () => {
    const r = calcularART({
      sueldoBruto: 500000,
      porcentajeIncapacidad: 20,
      edad: 35,
      tipoAccidente: "in_itinere",
    });
    expect(r.desglose.adicionalLey26773).toBeGreaterThan(0);
    expect(r.desglose.total).toBeGreaterThan(r.desglose.vib);
  });

  it("enfermedad profesional NO incluye adicional 20%", () => {
    const r = calcularART({
      sueldoBruto: 700000,
      porcentajeIncapacidad: 40,
      edad: 50,
      tipoAccidente: "enfermedad",
    });
    expect(r.desglose.adicionalLey26773).toBe(0);
    expect(r.desglose.total).toBe(r.desglose.vib);
  });

  it("coeficiente edad es 65/edad", () => {
    const r = calcularART({
      sueldoBruto: 400000,
      porcentajeIncapacidad: 15,
      edad: 40,
      tipoAccidente: "laboral",
    });
    expect(r.desglose.coeficienteEdad).toBeCloseTo(65 / 40, 4);
  });

  it("factor RIPTE ajusta el VIB correctamente", () => {
    const sinRipte = calcularART({
      sueldoBruto: 800000,
      porcentajeIncapacidad: 25,
      edad: 42,
      tipoAccidente: "laboral",
    });

    const conRipte = calcularART({
      sueldoBruto: 800000,
      porcentajeIncapacidad: 25,
      edad: 42,
      tipoAccidente: "laboral",
      factorRipte: 1.5,
    });

    expect(conRipte.desglose.vib).toBeCloseTo(sinRipte.desglose.vib * 1.5, 0);
  });

  it("100% de incapacidad calcula VIB máximo", () => {
    const r = calcularART({
      sueldoBruto: 500000,
      porcentajeIncapacidad: 100,
      edad: 30,
      tipoAccidente: "laboral",
    });
    // 53 × 500000 × 1 × (65/30)
    const expected = 53 * 500000 * 1.0 * (65 / 30);
    expect(r.desglose.vib).toBeCloseTo(expected, 0);
  });

  it("incluye baseLegal correcta para accidente laboral", () => {
    const r = calcularART({
      sueldoBruto: 400000,
      porcentajeIncapacidad: 10,
      edad: 55,
      tipoAccidente: "laboral",
    });
    expect(r.desglose.baseLegal).toContain("26.773");
  });

  it("el disclaimer está presente", () => {
    const r = calcularART({
      sueldoBruto: 600000,
      porcentajeIncapacidad: 30,
      edad: 45,
      tipoAccidente: "laboral",
    });
    expect(r.disclaimer).toBeTruthy();
    expect(r.disclaimer.length).toBeGreaterThan(50);
  });
});

describe("calcularART — validaciones de input", () => {
  it("lanza error si porcentaje es 0", () => {
    expect(() =>
      calcularART({
        sueldoBruto: 500000,
        porcentajeIncapacidad: 0,
        edad: 35,
        tipoAccidente: "laboral",
      })
    ).toThrow();
  });

  it("lanza error si porcentaje > 100", () => {
    expect(() =>
      calcularART({
        sueldoBruto: 500000,
        porcentajeIncapacidad: 101,
        edad: 35,
        tipoAccidente: "laboral",
      })
    ).toThrow();
  });

  it("lanza error si edad está fuera del rango válido", () => {
    expect(() =>
      calcularART({
        sueldoBruto: 500000,
        porcentajeIncapacidad: 20,
        edad: 17,
        tipoAccidente: "laboral",
      })
    ).toThrow();
  });
});
