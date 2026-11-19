import { describe, expect, it } from "vitest";
import { approach, hasSettled, pointerToSpot, RESTING_SPOT } from "./spotlight";

const rect = { left: 100, top: 50, width: 400, height: 200 };

describe("pointerToSpot", () => {
  it("convierte la posición del puntero en porcentaje del contenedor", () => {
    expect(pointerToSpot(300, 150, rect)).toEqual({ x: 50, y: 50 });
  });

  it("no se sale del contenedor", () => {
    expect(pointerToSpot(-500, 9999, rect)).toEqual({ x: 0, y: 100 });
  });

  it("vuelve a la posición de reposo si el contenedor no tiene tamaño", () => {
    expect(pointerToSpot(10, 10, { ...rect, width: 0 })).toBe(RESTING_SPOT);
  });
});

describe("approach", () => {
  it("avanza una fracción de la distancia en cada fotograma", () => {
    expect(approach({ x: 0, y: 0 }, { x: 100, y: 50 }, 0.5)).toEqual({ x: 50, y: 25 });
  });

  it("termina asentándose en el destino", () => {
    let spot = { x: 0, y: 0 };
    const target = { x: 80, y: 20 };
    for (let frame = 0; frame < 200 && !hasSettled(spot, target); frame++) {
      spot = approach(spot, target);
    }
    expect(hasSettled(spot, target)).toBe(true);
  });
});
