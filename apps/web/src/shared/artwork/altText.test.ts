import { describe, expect, it } from "vitest";
import { artworkAltText } from "./altText";

const base = { title: "The Bedroom", artist: "Vincent van Gogh", date: "1889" };

describe("artworkAltText", () => {
  it("usa la descripción de la imagen que trae el museo si existe", () => {
    expect(artworkAltText({ ...base, image: { altText: "Dormitorio con cama de madera." } })).toBe(
      "Dormitorio con cama de madera.",
    );
  });

  it("si no hay, compone título, artista y fecha", () => {
    expect(artworkAltText({ ...base, image: { altText: null } })).toBe(
      "The Bedroom, de Vincent van Gogh, 1889",
    );
  });

  it("omite lo que falte sin dejar comas sueltas", () => {
    expect(artworkAltText({ title: "Untitled", artist: null, date: null, image: null })).toBe(
      "Untitled",
    );
  });
});
