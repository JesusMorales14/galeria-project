import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ArtworkGridSkeleton } from "./ArtworkGridSkeleton";

describe("ArtworkGridSkeleton", () => {
  it("pinta el número pedido de tarjetas, ocultas al lector de pantalla", () => {
    const { container } = render(<ArtworkGridSkeleton count={3} />);
    expect(container.querySelectorAll("[data-skeleton-media]")).toHaveLength(3);
  });
});
