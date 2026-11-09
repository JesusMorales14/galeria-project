import { expect, test } from "@playwright/test";

test.describe("Navegación solo con teclado", () => {
  test.skip(({ isMobile }) => isMobile, "Flujo de teclado físico: solo escritorio");

  test("saltar al contenido, buscar, abrir una obra y guardarla", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#contenido")).toBeFocused();

    // Primer control del contenido: el botón de buscar en la colección.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Buscar en la colección" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/buscar$/);
    await page.getByRole("searchbox", { name: "Buscar" }).focus();
    await page.keyboard.type("bedroom");
    await page.keyboard.press("Enter"); // enviar el formulario con Enter
    await expect(page.getByRole("status")).toHaveText("1 obra encontrada");

    const result = page.getByRole("link", { name: "The Bedroom" });
    await result.focus();
    await expect(result).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 1, name: "The Bedroom" })).toBeVisible();

    const save = page.getByRole("button", { name: "Guardar en colección" });
    await save.focus();
    await page.keyboard.press("Enter");
    await expect(save).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "Crea tu primera colección" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(save).toBeFocused();
  });

  test("todos los elementos enfocables muestran un indicador de foco visible", async ({ page }) => {
    await page.goto("/buscar");
    for (let step = 0; step < 12; step += 1) {
      await page.keyboard.press("Tab");
      // El indicador puede estar en el elemento o en su contenedor (p. ej. la tarjeta de obra completa).
      const outline = await page.evaluate(() => {
        let el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return "none";
        for (let depth = 0; el && depth < 4; depth += 1, el = el.parentElement) {
          const style = getComputedStyle(el);
          if (style.outlineStyle !== "none" || style.boxShadow !== "none") return "visible";
        }
        return "none";
      });
      expect(outline, `paso ${step + 1}`).toBe("visible");
    }
  });
});
