import { describe, expect, it } from "vitest";
import type { Artwork } from "@galeria/api-client";
import { artworkDetailRows } from "./detailRows";
import { artworkJsonLd } from "./jsonLd";
import { artworkMetadata } from "./metadata";
import { parseArtworkId } from "./parseArtworkId";
import { relatedQuery } from "./relatedQuery";

const artwork: Artwork = {
  id: 27992,
  title: "A Sunday on La Grande Jatte — 1884",
  artist: "Georges Seurat",
  artistDisplay: "Georges Seurat\nFrench, 1859-1891",
  date: "1884–86",
  dateStart: 1884,
  dateEnd: 1886,
  artworkType: "Painting",
  medium: "Oil on canvas",
  dimensions: "207.5 × 308.1 cm",
  placeOfOrigin: "France",
  description: "Seurat painted it with pointillism. ".repeat(10).trim(),
  creditLine: "Helen Birch Bartlett Memorial Collection",
  department: null,
  style: "Post-Impressionism",
  isPublicDomain: true,
  image: {
    id: "img",
    iiifBaseUrl: "https://www.artic.edu/iiif/2",
    width: 3000,
    height: 2000,
    lqip: null,
    altText: null,
  },
};

describe("parseArtworkId", () => {
  it("acepta ids numéricos positivos", () => expect(parseArtworkId("27992")).toBe(27992));
  it("rechaza todo lo demás", () => {
    for (const bad of ["abc", "-1", "0", "1.5", "27992abc", ""])
      expect(parseArtworkId(bad)).toBeNull();
  });
});

describe("artworkMetadata", () => {
  it("incluye título, descripción recortada e imagen de Open Graph", () => {
    const metadata = artworkMetadata(artwork);
    expect(metadata.title).toBe("A Sunday on La Grande Jatte — 1884, de Georges Seurat");
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      images: [
        {
          url: "http://localhost:3000/api/iiif/img/full/843,/0/default.jpg",
          width: 843,
          height: 562,
        },
      ],
    });
    expect(metadata.alternates?.canonical).toBe("/obra/27992");
  });

  it("sin imagen ni descripción usa la cartela como descripción", () => {
    const metadata = artworkMetadata({ ...artwork, image: null, description: null });
    expect(metadata.description).toBe("Georges Seurat, 1884–86. Oil on canvas.");
    expect(metadata.openGraph?.images).toBeUndefined();
  });
});

describe("artworkJsonLd", () => {
  it("describe la obra como VisualArtwork de schema.org", () => {
    expect(artworkJsonLd(artwork, "https://galeria.test/obra/27992")).toMatchObject({
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      name: artwork.title,
      creator: { "@type": "Person", name: "Georges Seurat" },
      dateCreated: "1884",
      artMedium: "Oil on canvas",
      url: "https://galeria.test/obra/27992",
    });
  });
});

describe("artworkDetailRows", () => {
  it("solo incluye los datos que existen, en orden de cartela", () => {
    expect(artworkDetailRows(artwork).map((row) => row.label)).toEqual([
      "Fecha",
      "Técnica",
      "Medidas",
      "Origen",
      "Estilo",
      "Crédito",
    ]);
  });
});

describe("relatedQuery", () => {
  it("busca obras del mismo artista", () => {
    expect(relatedQuery(artwork)).toMatchObject({ artist: "Georges Seurat", pageSize: 5, page: 1 });
  });

  it("sin artista, busca por tipo de obra", () => {
    expect(relatedQuery({ ...artwork, artist: null })).toMatchObject({ artworkType: "Painting" });
  });

  it("sin artista ni tipo no hay relacionadas", () => {
    expect(relatedQuery({ ...artwork, artist: null, artworkType: null })).toBeNull();
  });
});
