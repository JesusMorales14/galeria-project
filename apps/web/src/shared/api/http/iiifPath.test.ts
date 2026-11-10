import { describe, expect, it } from "vitest";
import { parseIiifPath } from "./iiifPath";

describe("parseIiifPath", () => {
  it("acepta una imagen IIIF con un ancho permitido", () => {
    expect(
      parseIiifPath(["2d484387-2509-5e8e-2c43-22f9981972eb", "full", "843,", "0", "default.jpg"]),
    ).toEqual({
      imageId: "2d484387-2509-5e8e-2c43-22f9981972eb",
      width: 843,
    });
  });

  it("rechaza anchos no permitidos y rutas que no son imágenes IIIF", () => {
    expect(parseIiifPath(["abc", "full", "5000,", "0", "default.jpg"])).toBeNull();
    expect(parseIiifPath(["abc", "info.json"])).toBeNull();
    expect(parseIiifPath(["..", "..", "api", "v1"])).toBeNull();
    expect(parseIiifPath(["abc", "full", "843,", "0", "default.png"])).toBeNull();
  });
});
