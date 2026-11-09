import { describe, expect, it } from "vitest";
import {
  initialZoomState,
  MAX_SCALE,
  MIN_SCALE,
  zoomLabel,
  zoomReducer,
  type ZoomState,
} from "./zoomState";

const bounds = { width: 1000, height: 800 };
const zoomed = (scale: number, x = 0, y = 0): ZoomState => ({ scale, x, y });

describe("zoomReducer", () => {
  it("empieza sin zoom y centrado", () => {
    expect(initialZoomState).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it("acerca y aleja en pasos, sin salir de los límites", () => {
    const inOnce = zoomReducer(initialZoomState, { type: "zoomIn", bounds });
    expect(inOnce.scale).toBe(1.5);
    expect(zoomReducer(inOnce, { type: "zoomOut", bounds }).scale).toBe(1);
    expect(zoomReducer(zoomed(MAX_SCALE), { type: "zoomIn", bounds }).scale).toBe(MAX_SCALE);
    expect(zoomReducer(initialZoomState, { type: "zoomOut", bounds }).scale).toBe(MIN_SCALE);
  });

  it("al volver a 1x recentra la imagen", () => {
    expect(zoomReducer(zoomed(1.5, 200, -100), { type: "zoomOut", bounds })).toEqual(
      initialZoomState,
    );
  });

  it("restablece con reset", () => {
    expect(zoomReducer(zoomed(4, 100, 100), { type: "reset" })).toEqual(initialZoomState);
  });

  it("no permite moverse sin zoom", () => {
    expect(zoomReducer(initialZoomState, { type: "pan", dx: 50, dy: 50, bounds })).toEqual(
      initialZoomState,
    );
  });

  it("mueve la imagen con zoom, sin dejar huecos en los bordes", () => {
    // A 2x, la imagen mide 2000×1600: el desplazamiento máximo es 500×400.
    expect(zoomReducer(zoomed(2), { type: "pan", dx: 100, dy: -50, bounds })).toEqual(
      zoomed(2, 100, -50),
    );
    expect(zoomReducer(zoomed(2), { type: "pan", dx: 9999, dy: -9999, bounds })).toEqual(
      zoomed(2, 500, -400),
    );
  });

  it("al alejar, recoloca el desplazamiento dentro de los nuevos límites", () => {
    expect(zoomReducer(zoomed(3, 1000, 800), { type: "zoomOut", bounds })).toEqual(
      zoomed(2, 500, 400),
    );
  });

  it("acerca hacia un punto (rueda o pellizco) manteniéndolo bajo el cursor", () => {
    // Punto a 200px a la derecha del centro: al pasar a 2x debe seguir bajo el cursor.
    const next = zoomReducer(initialZoomState, {
      type: "zoomTo",
      scale: 2,
      origin: { x: 200, y: 0 },
      bounds,
    });
    expect(next).toEqual(zoomed(2, -200, 0));
  });

  it("zoomTo respeta los límites de escala", () => {
    expect(zoomReducer(initialZoomState, { type: "zoomTo", scale: 50, bounds }).scale).toBe(
      MAX_SCALE,
    );
  });
});

describe("zoomLabel", () => {
  it("anuncia el nivel de zoom en porcentaje", () => {
    expect(zoomLabel(1)).toBe("Zoom 100 %");
    expect(zoomLabel(2.25)).toBe("Zoom 225 %");
  });
});
