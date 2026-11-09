import { expect, test } from "@playwright/test";
import { expectAccessible } from "../support/axe";

/**
 * Pruebas de humo independientes de los datos: sirven contra la API simulada
 * y contra la API real del museo (vistas previas de Vercel: --grep @humo).
 */
test.describe("@humo", () => {
  test("portada, búsqueda y obra funcionan con datos reales", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Galería" })).toBeVisible();
    await expectAccessible(page);

    await page.goto("/buscar?q=monet");
    await expect(page.getByRole("status")).toHaveText(/obras? encontradas?/);
    const first = page.getByRole("article").first().getByRole("link");
    await expect(first).toBeVisible();
    await first.click();

    await expect(page).toHaveURL(/\/obra\/\d+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectAccessible(page);
  });

  test("un id no válido muestra la página 404 propia", async ({ page }) => {
    await page.goto("/obra/no-es-un-id");
    await expect(page.getByRole("heading", { name: "Esta sala está vacía" })).toBeVisible();
  });
});
