import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SortableArtworkList } from "./SortableArtworkList";

const artworks = [1, 2, 3].map((id) => ({
  id,
  title: `Obra ${id}`,
  artist: null,
  date: null,
  artworkType: null,
  image: null,
}));

describe("SortableArtworkList", () => {
  it("reordena con botones y anuncia la nueva posición", async () => {
    const onMove = vi.fn().mockResolvedValue(undefined);
    render(<SortableArtworkList artworks={artworks} onMove={onMove} onRemove={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Mover «Obra 3» antes" }));

    expect(onMove).toHaveBeenCalledWith(3, 1);
    expect(screen.getByRole("status").textContent).toBe("«Obra 3» movida a la posición 2 de 3");
  });

  it("deshabilita los movimientos imposibles en los extremos", () => {
    render(<SortableArtworkList artworks={artworks} onMove={vi.fn()} onRemove={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Mover «Obra 1» antes" }).hasAttribute("disabled"),
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Mover «Obra 3» después" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("quita una obra", async () => {
    const onRemove = vi.fn().mockResolvedValue(undefined);
    render(<SortableArtworkList artworks={artworks} onMove={vi.fn()} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole("button", { name: "Quitar «Obra 2» de la colección" }));
    expect(onRemove).toHaveBeenCalledWith(2);
  });
});
