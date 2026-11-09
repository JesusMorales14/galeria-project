import { expect, test } from "@playwright/test";
import { expectAccessible } from "../support/axe";

async function saveToCollection(
  page: import("@playwright/test").Page,
  id: number,
  collection: string,
) {
  await page.goto(`/obra/${id}`);
  await page.getByRole("button", { name: /Guardar en colección|Guardada en/ }).click();
  const existing = page.getByRole("checkbox", { name: new RegExp(collection) });
  if (await existing.count()) {
    await existing.click();
    await expect(existing).toBeChecked();
  } else {
    await page.getByRole("textbox", { name: "Crea tu primera colección" }).fill(collection);
    await page.getByRole("button", { name: "Crear y guardar" }).click();
    await expect(page.getByRole("button", { name: "Guardada en 1 colección" })).toBeVisible();
  }
}

test("crear una colección, guardar obras, reordenar, compartir y abrir el enlace en otro navegador", async ({
  page,
  browser,
}) => {
  await page.goto("/colecciones");
  await expect(page.getByRole("heading", { name: "Aún no tienes colecciones" })).toBeVisible();
  await expectAccessible(page);

  await saveToCollection(page, 27992, "Para mi sala");
  await saveToCollection(page, 28560, "Para mi sala");

  await page.goto("/colecciones");
  await page.reload(); // las colecciones sobreviven a recargar
  await page.getByRole("link", { name: "Para mi sala" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "A Sunday on La Grande Jatte — 1884",
    "The Bedroom",
  ]);

  await page.getByRole("button", { name: "Mover «The Bedroom» antes" }).click();
  await expect(page.getByRole("heading", { level: 2 }).first()).toHaveText("The Bedroom");
  await expect(page.getByRole("status").filter({ hasText: "movida" })).toHaveText(
    "«The Bedroom» movida a la posición 1 de 2",
  );
  await expectAccessible(page);

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copiar enlace para compartir" }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain("/coleccion?nombre=Para+mi+sala&obras=28560%2C27992");

  const other = await browser.newContext(); // otro navegador: sin IndexedDB compartido
  const otherPage = await other.newPage();
  await otherPage.goto(link);
  await expect(otherPage.getByRole("heading", { name: "Para mi sala" })).toBeVisible();
  await expect(otherPage.getByRole("article")).toHaveCount(2);
  await expectAccessible(otherPage);
  await other.close();
});

test("un enlace manipulado muestra un mensaje claro, no un error", async ({ page }) => {
  await page.goto("/coleccion?obras=1;DROP%20TABLE&nombre=x");
  await expect(
    page.getByRole("heading", { name: "Este enlace de colección no es válido" }),
  ).toBeVisible();
  await expectAccessible(page);
});
