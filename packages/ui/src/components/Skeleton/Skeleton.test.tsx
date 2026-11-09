import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArtworkCardSkeleton } from "./ArtworkCardSkeleton";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("es decorativo: los lectores de pantalla lo ignoran", () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("ArtworkCardSkeleton", () => {
  it("reserva la proporción de la imagen para evitar saltos", () => {
    const { container } = render(<ArtworkCardSkeleton aspectRatio={3 / 4} />);
    const media = container.querySelector("[data-skeleton-media]") as HTMLElement;
    expect(media.style.getPropertyValue("--ratio")).toBe("0.75");
    expect(media.className).toContain("aspect-(--ratio)");
  });

  it("no expone contenido a tecnologías de asistencia", () => {
    render(<ArtworkCardSkeleton />);
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
