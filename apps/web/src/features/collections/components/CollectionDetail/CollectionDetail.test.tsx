import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mutate, resetStoreForTests } from "../../lib/store";
import { CollectionDetail } from "./CollectionDetail";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const artwork = (id: number) => ({
  id,
  title: `Obra ${id}`,
  artist: null,
  date: null,
  artworkType: null,
  image: null,
});

beforeEach(() => {
  resetStoreForTests();
  // IndexedDB nuevo en cada test: sin datos ni conexiones de tests anteriores.
  globalThis.indexedDB = new IDBFactory();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ items: [artwork(1), artwork(2)] })),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("CollectionDetail", () => {
  it("explica que la colección no está en este navegador si no existe", async () => {
    render(<CollectionDetail id="no-existe" />);
    expect(
      await screen.findByRole("heading", { name: "Esta colección no está en este navegador" }),
    ).toBeDefined();
  });

  it("muestra las obras, permite renombrar y eliminar con confirmación", async () => {
    const created = await mutate((s) => s.create("Sala azul", [1, 2]));
    render(<CollectionDetail id={created.id} />);

    expect(await screen.findByRole("heading", { level: 1, name: "Sala azul" })).toBeDefined();
    expect(await screen.findAllByRole("article")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "Renombrar" }));
    const name = screen.getByRole("textbox", { name: "Nuevo nombre" });
    await userEvent.type(name, "Sala verde");
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Sala verde" })).toBeDefined();

    await userEvent.click(screen.getByRole("button", { name: "Eliminar colección" }));
    await userEvent.click(screen.getByRole("button", { name: "Pulsa otra vez para eliminar" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/colecciones"));
  });

  it("copia el enlace para compartir y lo anuncia", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const created = await mutate((s) => s.create("Compartible", [1, 2]));
    render(<CollectionDetail id={created.id} />);

    await userEvent.click(
      await screen.findByRole("button", { name: "Copiar enlace para compartir" }),
    );
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("/coleccion?nombre=Compartible&obras=1%2C2"),
    );
    expect(await screen.findByRole("button", { name: "Enlace copiado" })).toBeDefined();
  });

  it("una colección vacía invita a buscar obras", async () => {
    const created = await mutate((s) => s.create("Vacía"));
    render(<CollectionDetail id={created.id} />);
    expect(await screen.findByRole("heading", { name: "Esta colección está vacía" })).toBeDefined();
  });

  it("si el museo no responde, ofrece reintentar sin perder la colección", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    const created = await mutate((s) => s.create("Con error", [1]));
    render(<CollectionDetail id={created.id} />);
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeDefined();
  });
});
