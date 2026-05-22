/**
 * Tests para calcularCuotaAlimentaria() — estimación orientativa.
 */

import { describe, it, expect } from "vitest";
import { calcularCuotaAlimentaria } from "../../lib/legal/cuota-alimentaria";

describe("calcularCuotaAlimentaria — casos básicos", () => {
  it("1 hijo adulto → 20% del sueldo", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 500000,
      nHijos: 1,
      edades: [12],
    });
    expect(r.porcentajeEstimado).toBe(20);
    expect(r.montoMensual).toBe(100000);
  });

  it("1 hijo menor de 6 años → 25% del sueldo", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 400000,
      nHijos: 1,
      edades: [3],
    });
    expect(r.porcentajeEstimado).toBe(25);
    expect(r.montoMensual).toBe(100000);
  });

  it("2 hijos adultos → 30%", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 600000,
      nHijos: 2,
      edades: [10, 15],
    });
    expect(r.porcentajeEstimado).toBe(30);
    expect(r.montoMensual).toBe(180000);
  });

  it("2 hijos, uno menor de 6 → 35%", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 800000,
      nHijos: 2,
      edades: [4, 9],
    });
    expect(r.porcentajeEstimado).toBe(35);
    expect(r.montoMensual).toBe(280000);
  });

  it("3 hijos adultos → 40%", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 1000000,
      nHijos: 3,
      edades: [8, 12, 16],
    });
    expect(r.porcentajeEstimado).toBe(40);
    expect(r.montoMensual).toBe(400000);
  });

  it("3 hijos, uno menor de 6 → 45%", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 500000,
      nHijos: 3,
      edades: [2, 8, 14],
    });
    expect(r.porcentajeEstimado).toBe(45);
    expect(r.montoMensual).toBe(225000);
  });

  it("otras obligaciones activas → reducción a 25% máximo", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 600000,
      nHijos: 2,
      edades: [7, 12],
      tieneOtrasObligaciones: true,
    });
    expect(r.porcentajeEstimado).toBeLessThanOrEqual(25);
  });

  it("retorna rango min y max distintos al monto estimado", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 700000,
      nHijos: 1,
      edades: [10],
    });
    expect(r.rangoMin).toBeLessThan(r.montoMensual);
    expect(r.rangoMax).toBeGreaterThan(r.montoMensual);
  });

  it("el disclaimer está presente y es sustancial", () => {
    const r = calcularCuotaAlimentaria({
      sueldoBrutoObligado: 500000,
      nHijos: 1,
      edades: [8],
    });
    expect(r.disclaimer).toBeTruthy();
    expect(r.disclaimer.length).toBeGreaterThan(100);
  });
});

describe("calcularCuotaAlimentaria — validaciones", () => {
  it("lanza error si nHijos ≠ longitud de edades", () => {
    expect(() =>
      calcularCuotaAlimentaria({
        sueldoBrutoObligado: 500000,
        nHijos: 2,
        edades: [10], // solo 1 edad para 2 hijos
      })
    ).toThrow();
  });

  it("lanza error si sueldo es 0 o negativo", () => {
    expect(() =>
      calcularCuotaAlimentaria({
        sueldoBrutoObligado: 0,
        nHijos: 1,
        edades: [5],
      })
    ).toThrow();
  });
});
