import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { resetStoreForTests } from "../../lib/store";
import { exportCollections } from "../../lib/exportCollections";
import { CollectionsOverview } from "./CollectionsOverview";

beforeEach(() => {
  resetStoreForTests();
  // IndexedDB nuevo en cada test: sin datos ni conexiones de tests anteriores.
  globalThis.indexedDB = new IDBFactory();
});

describe("CollectionsOverview", () => {
  it("la primera visita explica qué son las colecciones y cómo empezar", async () => {
    render(<CollectionsOverview />);
    expect(await screen.findByRole("heading", { name: "Aún no tienes colecciones" })).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Buscar obras para guardar" }).getAttribute("href"),
    ).toBe("/buscar");
    expect(screen.getByRole("button", { name: "Exportar (JSON)" }).hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("crea una colección y la muestra en la lista con enlace a su detalle", async () => {
    render(<CollectionsOverview />);
    await userEvent.type(
      await screen.findByRole("textbox", { name: "Nueva colección" }),
      "Retratos",
    );
    await userEvent.click(screen.getByRole("button", { name: "Crear" }));

    const link = await screen.findByRole("link", { name: "Retratos" });
    expect(link.getAttribute("href")).toMatch(/^\/colecciones\//);
    expect(screen.getByText(/0 obras · actualizada el/)).toBeDefined();
  });

  it("importa una copia de seguridad y rechaza archivos ajenos", async () => {
    render(<CollectionsOverview />);
    const input = await screen.findByLabelText("Importar desde archivo");
    const backup = exportCollections([
      {
        id: "x1",
        name: "Importada",
        artworkIds: [1],
        createdAt: "2026-11-09T10:00:00.000Z",
        updatedAt: "2026-11-09T10:00:00.000Z",
      },
    ]);

    await userEvent.upload(input, new File([backup], "copia.json", { type: "application/json" }));
    expect(await screen.findByRole("link", { name: "Importada" })).toBeDefined();
    await waitFor(() => expect(screen.getByText("Importadas 1 colecciones.")).toBeDefined());

    await userEvent.upload(input, new File(["{}"], "otra.json", { type: "application/json" }));
    expect(
      await screen.findByText("Ese archivo no es una copia de colecciones de Galería."),
    ).toBeDefined();
  });
});
