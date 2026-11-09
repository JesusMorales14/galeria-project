import { expect, test } from "@playwright/test";
import { expectAccessible } from "../support/axe";

test("el visor de zoom se usa solo con el teclado", async ({ page }) => {
  await page.goto("/obra/27992");
  const viewer = page.getByRole("application", { name: /A Sunday on La Grande Jatte/ });
  const status = page.getByRole("status").filter({ hasText: /^Zoom/ });

  await viewer.focus();
  await expect(viewer).toBeFocused();
  await page.keyboard.press("+");
  await page.keyboard.press("+");
  await expect(status).toHaveText("Zoom 225 %");

  const before = await viewer.locator("img").getAttribute("style");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => viewer.locator("img").getAttribute("style")).not.toBe(before);
  expect(await page.evaluate(() => window.scrollY)).toBe(0); // las flechas no desplazan la página

  await page.keyboard.press("-");
  await expect(status).toHaveText("Zoom 150 %");
  await page.keyboard.press("0");
  await expect(status).toHaveText("Zoom 100 %");
  await expectAccessible(page);
});

test("los botones del visor tienen nombre y se deshabilitan en los límites", async ({ page }) => {
  await page.goto("/obra/27992");
  await expect(page.getByRole("button", { name: "Alejar" })).toBeDisabled();
  await page.getByRole("button", { name: "Acercar" }).click();
  await expect(page.getByRole("button", { name: "Alejar" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Restablecer" })).toBeEnabled();
});
