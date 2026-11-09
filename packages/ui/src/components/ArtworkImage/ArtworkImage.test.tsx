import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArtworkImage } from "./ArtworkImage";

const props = {
  src: "https://iiif.test/a/full/843,/0/default.jpg",
  srcSet:
    "https://iiif.test/a/full/400,/0/default.jpg 400w, https://iiif.test/a/full/843,/0/default.jpg 843w",
  sizes: "(min-width: 1024px) 25vw, 100vw",
  width: 3000,
  height: 2000,
  alt: "Personas en un parque",
};

describe("ArtworkImage", () => {
  it("entrega srcset y sizes para que el navegador elija el tamaño", () => {
    render(<ArtworkImage {...props} />);
    const img = screen.getByRole("img", { name: "Personas en un parque" });
    expect(img.getAttribute("srcset")).toBe(props.srcSet);
    expect(img.getAttribute("sizes")).toBe(props.sizes);
  });

  it("reserva el espacio con la proporción real (sin saltos de diseño)", () => {
    render(<ArtworkImage {...props} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("width")).toBe("3000");
    expect(img.getAttribute("height")).toBe("2000");
    expect(img.parentElement?.style.getPropertyValue("--ratio")).toBe("1.5");
  });

  it("carga diferida por defecto y prioridad alta solo cuando se pide", () => {
    const { rerender } = render(<ArtworkImage {...props} />);
    expect(screen.getByRole("img").getAttribute("loading")).toBe("lazy");

    rerender(<ArtworkImage {...props} priority />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("loading")).toBe("eager");
    expect(img.getAttribute("fetchpriority")).toBe("high");
  });

  it("usa una proporción por defecto si no se conocen las medidas", () => {
    render(<ArtworkImage {...props} width={null} height={null} />);
    expect(screen.getByRole("img").parentElement?.style.getPropertyValue("--ratio")).toBe("0.8");
  });

  it("muestra el placeholder del museo como fondo mientras carga", () => {
    render(<ArtworkImage {...props} placeholder="data:image/gif;base64,AAAA" />);
    expect(screen.getByRole("img").parentElement?.style.backgroundImage).toContain(
      "data:image/gif",
    );
  });
});
