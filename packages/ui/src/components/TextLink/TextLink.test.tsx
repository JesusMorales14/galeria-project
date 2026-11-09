import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextLink } from "./TextLink";

describe("TextLink", () => {
  it("renderiza un enlace con su destino", () => {
    render(<TextLink href="/buscar">Buscar obras</TextLink>);
    expect(screen.getByRole("link", { name: "Buscar obras" }).getAttribute("href")).toBe("/buscar");
  });

  it("con asChild aplica sus estilos al enlace hijo (p. ej. next/link)", () => {
    render(
      <TextLink asChild>
        <a href="/obra/1" data-router="next">
          Ver obra
        </a>
      </TextLink>,
    );
    const link = screen.getByRole("link", { name: "Ver obra" });
    expect(link.getAttribute("data-router")).toBe("next");
    expect(link.className).toContain("underline");
  });

  it("marca los enlaces externos y los abre de forma segura", () => {
    render(
      <TextLink href="https://www.artic.edu" external>
        Art Institute
      </TextLink>,
    );
    const link = screen.getByRole("link", { name: /art institute.*nueva pestaña/i });
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.getAttribute("target")).toBe("_blank");
  });
});
