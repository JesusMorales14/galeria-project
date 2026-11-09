import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "../../../test/a11y";
import { ArtworkCard } from "./ArtworkCard";

const props = {
  href: "/obra/27992",
  title: "A Sunday on La Grande Jatte — 1884",
  artist: "Georges Seurat",
  date: "1884–86",
  media: <img src="/x.jpg" alt="Personas descansando en un parque junto al río" />,
};

describe("ArtworkCard", () => {
  it("muestra título, artista y fecha como una cartela de museo", () => {
    render(<ArtworkCard {...props} />);

    expect(screen.getByRole("heading", { name: props.title })).toBeDefined();
    expect(screen.getByText("Georges Seurat")).toBeDefined();
    expect(screen.getByText("1884–86")).toBeDefined();
  });

  it("el enlace se nombra con el título de la obra", () => {
    render(<ArtworkCard {...props} />);
    expect(screen.getByRole("link", { name: props.title }).getAttribute("href")).toBe(
      "/obra/27992",
    );
  });

  it("indica artista desconocido y omite la fecha si faltan", () => {
    render(<ArtworkCard {...props} artist={null} date={null} />);
    expect(screen.getByText("Artista desconocido")).toBeDefined();
    expect(screen.queryByText("1884–86")).toBeNull();
  });

  it("acepta un componente de enlace propio (p. ej. next/link)", () => {
    const RouterLink = ({ children, ...p }: React.ComponentProps<"a">) => (
      <a data-router="next" {...p}>
        {children}
      </a>
    );
    render(<ArtworkCard {...props} linkComponent={RouterLink} />);
    expect(screen.getByRole("link").getAttribute("data-router")).toBe("next");
  });

  it("no tiene problemas de accesibilidad dentro de una lista", async () => {
    const { container } = render(
      <ul>
        <li>
          <ArtworkCard {...props} />
        </li>
      </ul>,
    );
    await expectNoA11yViolations(container);
  });
});
