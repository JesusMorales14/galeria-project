import { describe, expect, it } from "vitest";
import complete from "../../test/fixtures/artwork-complete.json";
import noImage from "../../test/fixtures/artwork-no-image.json";
import noDate from "../../test/fixtures/artwork-no-date.json";
import { rawArtworkSchema } from "./schemas";
import { normalizeArtwork } from "./normalizeArtwork";

const IIIF = "https://www.artic.edu/iiif/2";

function normalize(fixture: { data: unknown }) {
  return normalizeArtwork(rawArtworkSchema.parse(fixture.data), IIIF);
}

describe("normalizeArtwork", () => {
  it("convierte una obra completa al tipo propio Artwork", () => {
    const artwork = normalize(complete);

    expect(artwork).toMatchObject({
      id: 27992,
      title: "A Sunday on La Grande Jatte — 1884",
      artist: "Georges Seurat",
      date: "1884–86",
      artworkType: "Painting",
      medium: "Oil on canvas",
      isPublicDomain: true,
    });
    expect(artwork.image).toEqual({
      id: "2d484387-2509-5e8e-2c43-22f9981972eb",
      iiifBaseUrl: IIIF,
      width: 3000,
      height: 2013,
      lqip: expect.stringMatching(/^data:image\/gif;base64,/),
      altText: "Painting of a park on an island with people relaxing in the shade.",
    });
  });

  it("limpia el HTML de la descripción", () => {
    expect(normalize(complete).description).toBe(
      "Georges Seurat painted A Sunday on La Grande Jatte using a technique called pointillism & color theory.\n\nIt took him two years.",
    );
  });

  it("devuelve image null cuando la obra no tiene imagen", () => {
    expect(normalize(noImage).image).toBeNull();
    expect(normalize(noImage).artist).toBeNull();
  });

  it("acepta obras sin fecha y usa short_description si no hay descripción", () => {
    const artwork = normalize(noDate);
    expect(artwork.date).toBeNull();
    expect(artwork.description).toBe("A small study.");
    expect(artwork.image?.lqip).toBeNull();
  });
});
