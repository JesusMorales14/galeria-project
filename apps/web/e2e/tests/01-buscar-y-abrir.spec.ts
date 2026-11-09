import { expect, test } from "@playwright/test";
import { expectAccessible } from "../support/axe";

test.describe("Buscar, filtrar y abrir una obra", () => {
  test("flujo completo desde la portada", async ({ page }) => {
    await page.goto("/");
    await expectAccessible(page);
    await page.getByRole("link", { name: "Buscar en la colección" }).click();

    await expect(page).toHaveURL(/\/buscar$/);
    await page.getByRole("searchbox", { name: "Buscar" }).fill("monet");
    await page.getByRole("combobox", { name: "Tipo de obra" }).selectOption("Painting");
    await page.getByRole("button", { name: "Buscar" }).click();

    await expect(page).toHaveURL(/q=monet/);
    await expect(page).toHaveURL(/tipo=Painting/);
    await expect(page.getByRole("status")).toHaveText("3 obras encontradas");
    await expectAccessible(page);

    await page.getByRole("link", { name: "Water Lilies" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Water Lilies" })).toBeVisible();
    await expectAccessible(page);
  });

  test("recargar conserva los filtros (la URL es la fuente de verdad)", async ({ page }) => {
    await page.goto("/buscar?q=monet&orden=oldest");
    await page.reload();
    await expect(page.getByRole("searchbox", { name: "Buscar" })).toHaveValue("monet");
    await expect(page.getByRole("combobox", { name: "Orden" })).toHaveValue("oldest");
  });

  test("sin resultados ofrece limpiar los filtros", async ({ page }) => {
    await page.goto("/buscar?q=zzzz&tipo=Painting");
    await expect(
      page.getByRole("heading", { name: "No encontramos obras con esos filtros" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Limpiar filtros" }).click();
    await expect(page).toHaveURL(/\/buscar$/);
  });

  test("una obra inexistente muestra la página 404 propia", async ({ page }) => {
    await page.goto("/obra/999999");
    await expect(page.getByRole("heading", { name: "Esta sala está vacía" })).toBeVisible();
    await expectAccessible(page);
  });
});

test.describe("Sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("el formulario de búsqueda funciona (mejora progresiva)", async ({ page }) => {
    await page.goto("/buscar");
    await page.getByRole("searchbox", { name: "Buscar" }).fill("monet");
    await page.getByRole("button", { name: "Buscar" }).click();

    await expect(page).toHaveURL(/q=monet/);
    await expect(page.getByRole("status")).toHaveText("3 obras encontradas");
  });
});
