import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroArtwork } from "./HeroArtwork";

const artwork = {
  id: 27992,
  title: "A Sunday on La Grande Jatte — 1884",
  artist: "Georges Seurat",
  date: "1884–86",
  artworkType: "Painting",
  image: {
    id: "img",
    iiifBaseUrl: "https://x",
    width: 3000,
    height: 2013,
    lqip: null,
    altText: null,
  },
};

describe("HeroArtwork", () => {
  it("cuelga la obra con prioridad de carga y una cartela sin puntos medios", () => {
    render(<HeroArtwork artwork={artwork} />);

    const image = screen.getByRole("img", { name: /A Sunday on La Grande Jatte/ });
    expect(image.getAttribute("fetchpriority")).toBe("high");
    expect(image.getAttribute("src")).toMatch(/^\/api\/iiif\//);
    expect(screen.getByText("Georges Seurat, 1884–86")).toBeDefined();
  });

  it("el enlace a la obra se nombra con su título", () => {
    render(<HeroArtwork artwork={artwork} />);
    expect(screen.getByRole("link", { name: artwork.title }).getAttribute("href")).toBe(
      "/obra/27992",
    );
  });
});
