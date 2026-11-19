import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomBanner } from "./RoomBanner";

describe("RoomBanner", () => {
  it("es el h1 y el lector de pantalla oye la palabra entera, no letras sueltas", () => {
    render(<RoomBanner id="t" text="Galería" />);

    const heading = screen.getByRole("heading", { level: 1, name: "Galería" });
    expect(heading.id).toBe("t");
    expect(heading.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
  });
});
