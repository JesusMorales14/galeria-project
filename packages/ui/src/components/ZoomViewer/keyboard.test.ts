import { describe, expect, it } from "vitest";
import { keyToCommand } from "./keyboard";

describe("keyToCommand", () => {
  it("+ y = acercan, - y _ alejan, 0 restablece", () => {
    expect(keyToCommand("+")).toEqual({ type: "zoomIn" });
    expect(keyToCommand("=")).toEqual({ type: "zoomIn" });
    expect(keyToCommand("-")).toEqual({ type: "zoomOut" });
    expect(keyToCommand("_")).toEqual({ type: "zoomOut" });
    expect(keyToCommand("0")).toEqual({ type: "reset" });
  });

  it("las flechas mueven la vista hacia esa dirección", () => {
    // Ver más a la derecha = desplazar la imagen hacia la izquierda.
    expect(keyToCommand("ArrowRight")).toEqual({ type: "pan", direction: { x: -1, y: 0 } });
    expect(keyToCommand("ArrowUp")).toEqual({ type: "pan", direction: { x: 0, y: 1 } });
  });

  it("ignora el resto de teclas (Tab sigue funcionando)", () => {
    expect(keyToCommand("Tab")).toBeNull();
    expect(keyToCommand("a")).toBeNull();
  });
});
