import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SkipLink } from "./SkipLink";

vi.mock("next/navigation", () => ({ usePathname: () => "/colecciones/abc" }));

describe("layout", () => {
  it("la cabecera marca la sección actual con aria-current", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(nav).toBeDefined();
    expect(screen.getByRole("link", { name: "Colecciones" }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(screen.getByRole("link", { name: "Buscar" }).getAttribute("aria-current")).toBeNull();
  });

  it("el enlace para saltar al contenido apunta al main", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Saltar al contenido" }).getAttribute("href")).toBe(
      "#contenido",
    );
  });

  it("el pie atribuye las obras al museo y enlaza el código", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: /Art Institute of Chicago/ }).getAttribute("href"),
    ).toBe("https://www.artic.edu");
    expect(screen.getByRole("link", { name: /Código del proyecto/ })).toBeDefined();
  });
});
