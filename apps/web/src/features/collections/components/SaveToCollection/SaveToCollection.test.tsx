import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { resetStoreForTests } from "../../lib/store";
import { SaveToCollection } from "./SaveToCollection";

beforeEach(() => {
  resetStoreForTests();
  // IndexedDB nuevo en cada test: sin datos ni conexiones de tests anteriores.
  globalThis.indexedDB = new IDBFactory();
});

describe("SaveToCollection", () => {
  it("crea una colección con la obra desde el panel y lo anuncia", async () => {
    render(<SaveToCollection artworkId={27992} artworkTitle="La Grande Jatte" />);

    const trigger = screen.getByRole("button", { name: "Guardar en colección" });
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    await userEvent.type(
      screen.getByRole("textbox", { name: "Crea tu primera colección" }),
      "Para mi sala",
    );
    await userEvent.click(screen.getByRole("button", { name: "Crear y guardar" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Guardada en 1 colección" })).toBeDefined(),
    );
    expect(screen.getByRole("checkbox", { name: /Para mi sala/ })).toHaveProperty("checked", true);
    expect(screen.getByRole("status").textContent).toContain(
      "guardada en la nueva colección Para mi sala",
    );
  });

  it("valida el nombre antes de crear", async () => {
    render(<SaveToCollection artworkId={1} artworkTitle="Obra" />);
    await userEvent.click(screen.getByRole("button", { name: "Guardar en colección" }));
    await userEvent.click(screen.getByRole("button", { name: "Crear y guardar" }));

    expect(screen.getByRole("alert").textContent).toContain("Escribe un nombre");
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("se cierra con Escape y devuelve el foco al botón", async () => {
    render(<SaveToCollection artworkId={1} artworkTitle="Obra" />);
    const trigger = screen.getByRole("button", { name: "Guardar en colección" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });
});
