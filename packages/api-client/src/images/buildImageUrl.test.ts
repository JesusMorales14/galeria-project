import { describe, expect, it } from "vitest";
import { buildImageSrcSet, buildImageUrl } from "./buildImageUrl";

const image = { iiifBaseUrl: "https://www.artic.edu/iiif/2", id: "abc-123" };

describe("buildImageUrl", () => {
  it("pide la imagen IIIF al ancho exacto", () => {
    expect(buildImageUrl(image, 843)).toBe(
      "https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg",
    );
  });

  it("no duplica la barra si la base termina en /", () => {
    expect(buildImageUrl({ ...image, iiifBaseUrl: "https://x.test/iiif/2/" }, 400)).toBe(
      "https://x.test/iiif/2/abc-123/full/400,/0/default.jpg",
    );
  });

  it("rechaza anchos no válidos", () => {
    expect(() => buildImageUrl(image, 0)).toThrow(RangeError);
    expect(() => buildImageUrl(image, 12.5)).toThrow(RangeError);
  });
});

describe("buildImageSrcSet", () => {
  it("genera un candidato por ancho, ordenado de menor a mayor", () => {
    expect(buildImageSrcSet(image, [843, 400])).toBe(
      "https://www.artic.edu/iiif/2/abc-123/full/400,/0/default.jpg 400w, " +
        "https://www.artic.edu/iiif/2/abc-123/full/843,/0/default.jpg 843w",
    );
  });
});
